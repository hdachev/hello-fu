const cp        = require('child_process');
const path      = require('path');
const fs        = require('fs');

function startWatcher(REBUILD, WATCH_DIRS, RE, onDidBoot)
{
    // console.log("startWatcher: REBUILD(" + REBUILD + ") WATCH_DIRS(" + WATCH_DIRS + ") notify(" + !!onDidBoot + ")");

    let _dirtyTime  = 0;
    let _spawnTime  = 0;

    let _dirty      = false;
    let _rebuild    = null;
    let _didRecycle = false;
    let _didBoot    = false;

    // TODO FIX we don't seem to be shutting down child processes on SIGTERM
    let KILL_EARLY  = false;

    let _chain      = null;

    function triggerRebuild()
    {
        const now   = Date.now();

        if (_rebuild)
        {
            if (_didBoot && Math.abs(_spawnTime - now) > 1000 && KILL_EARLY)
                _rebuild.kill();

            return;
        }

        const args  = REBUILD.split(/\s+/g);
        const cmd   = args.shift();

        // console.log('\n-----------\nRebuild', cmd, '...\n-----------\n');

        _dirty      = false;
        _spawnTime  = now;
        _rebuild    = cp.spawn(cmd, args, {
            stdio: [process.stdin, process.stdout, process.stderr] });

        _rebuild.on('exit', (code, ...args) =>
        {
            // console.log('\n-----------\nRebuild EXIT:', code, ...args, '\n-----------\n');

            _rebuild = null;
            if (_dirty)
                triggerRebuild();

            if (code !== 0)
            {
                // console.log('\n-----------\nBuild failed.\n-----------\n');
                return;
            }
            else
            {
                const notify = !_didBoot && onDidBoot;

                _didBoot = true;

                // console.log('\n-----------\nBuild OK notify(' + !!notify + ').\n-----------\n');

                if (notify)
                    _chain = notify();
                else if (_chain)
                    _chain();
            }
        });
    }

    function watchRecursive(dir, watcher)
    {
        const ls = fs.readdirSync(dir);

        for (let i = 0; i < ls.length; i++)
        {
            // `.vscode`, `.git`, `myfile.myext`, etc.
            let f = ls[i];
            if (f.indexOf('.') >= 0)
                continue;

            let p = path.join(dir, f);
            if (fs.statSync(p).isDirectory())
                watchRecursive(p, watcher);
        }

        fs.watch(dir, watcher);
    }

    function onWatchEvent(event, file)
    {
        if (!RE.test(file))
            return;

        const now = Date.now();
        if (Math.abs(now - _dirtyTime) < 125)
            return;

        _dirty = true;
        _dirtyTime = now;

        // console.log('\n-----------\nWATCH:', event, file, '\n-----------\n');

        triggerRebuild();
    }

    WATCH_DIRS.forEach(dir => watchRecursive(dir, onWatchEvent));

    setTimeout(triggerRebuild);

    return triggerRebuild;
}

startWatcher(
    '../fu/bin/fu --debug -c --bin ./bin/bake ./bake/bake.fu',
    [ './bake', '../fu/lib' ],
    /\.fu$/,
    () => startWatcher(
        './bin/bake',
        [ './content', './static' ],
        /\.(md|html|js|css|svg)$/));
