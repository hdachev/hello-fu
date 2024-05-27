
## Getting Started

Before we begin:

- Windows is not natively supported yet, but WSL should work.
- You'll need either GCC or Clang installed.

### Bootstrap

Ideally, you'd pull the repo at `~/fu/`, like so:

```sh
cd ~
git clone [repo] fu
cd fu
```

To release-build a self-verifying compiler, run:
```sh
./release-safe
```

This will recursively build several generations of the compiler, until you have latest-built-by-latest.

We don't "install" the compiler for you automatically - you can chose to either:

- place `~/fu/bin` in your `PATH`;
- symlink or move `~/fu/bin/fu` to a place of your liking;
- or simply `~/fu/bin/fu` instead of `fu` to invoke the compiler:

```sh
~/fu/bin/fu
```
```output
Hello! This is Fu v0.0.1

To get started:
    echo 'fn main() println("Hello world!");' >> hello.fu

Build it:
    ~/fu/bin/fu -b hello.fu

Run it:
    ./hello
        Hello world!
```

### Compiler Development Setup

This being a research language, odds are you are interested in hacking on the compiler.

An external development watch-and-rebuild script is available:

```sh
node watch.js
```

This builds and tests several generations of the compiler, immediately and on every compiler source change, always starting from a base bootstrap of a known-to-work historical compiler version.

Effectively, this limits the dialect of the language that is usable in the compiler itself to whatever is supported by the committed-in-repo known-to-work C++ sources. These sources are periodically updated, akin to an internal release, making newer syntax and language features available for compiler development.

### Compiler Bug Auto-Reducer

Recursion is great at breaking our compiler, and the compiler itself is a heavily recursive program, which makes it great at breaking itself.

TODO cleanup & describe `node reduce.js`

### Intrusive Compiler Profiler

TODO cleanup & describe `./perf`
