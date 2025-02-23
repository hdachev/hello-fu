
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
fu-0    The Fu Programming Language

        To get started:
            echo 'fn main() { println("Hello world!"); 0 }' >> hello.fu

        Build it:
            fu -b hello.fu

        Run it:
            ./hello
                Hello world!

        fu --help for more options.
```

### Text Editor & Syntax Highlighting

Basic syntax highlighting for C or JavaScript can work for .fu files. The simpler the highlighter the better: you don't want something that will get stuck because fu code is not valid C or some such. Just use whatever works.

### Compiler Development Setup

An automatic watch-rebuild-and-retest script is available at the root of the repo for compiler hackers:

```sh
cd ~/fu
fu -r watch.fu
```

This builds and tests several generations of the compiler, immediately and on every compiler source change, starting from a base bootstrap of a known-to-work historical compiler version.

Running this for the first time will build and run the entire test suite. This takes a while, especially on a Mac where XProtect will slow things down to a crawl. All artifacts are cached, so iteration time is excellent once this is done.

### Tracking Compiler Codegen

Every run of the test suite emits all code generated + various diagnostics to `testdiff/now.td`. The file is big and rarely commited, but very useful when you want to compare differences in codegen between two commits.

With `watch.fu` running, checkout the commit prior to your change, commit the `now.td` you get out of the testsuite, cherry-pick your change on top and enjoy the diff of everything it affects.

### Tracking Compiler Performance

A script for benchmarking compiler performance is available at the root of the repo. To compare a bunch of commits, kill `watch.fu`, `reset --hard` and run `./bench AAAAAAA BBBBBBB CCCCCCC`. The script pre-builds per-commit non-self-testing release compiler executables, then runs them back to back compiling the compiler itself at the commit you started from. You'll also get rough comparisons of per-pass memory use.

### Compiler Bug Auto-Reducer

TODO cleanup & describe `reduce.js`
