
## Value vs Reference Semantics

Often when a naively written C++ program is slow it is because of indiscriminate copying of non-trivial values. C++ makes it easy to deep-copy by mistake because it defaults to value semantics, and then implements value semantics by always copying.

Value semantics are a good default, and are responsible for much of the comfort of purely functional programming. What we don't want is the quality of life / efficiency tradeoff.

The basic idea is simple - these two variables need not point to different values:

```
fn test() {
//: hide hat
    let a = [ 1, 2, 3, 4, 5, 6, 7 ];
    let b = a;
//: hide foot

    return b;
}
//: hide shoe

fn main() test.len - 7;
```

Note that `a` and `b` are constants and can safely share the same value in memory without any observable side effects.

### Binding Declarations

Bindings either have value semantics or reference semantics, and either can be mutable or immutable:

```
fn test(ref place, const value) {
//: hide hat
    let const val a = place || value;
    let   mut val b = place || value;

    let const ref c = place;
    let   mut ref d = place;
//: hide foot

    d += b += c + a;
//: hide shoe
}

fn main() {
    mut v = 0;
    test(v, v);
    return v;
}
```

`const` vs `mut` determine whether the binding is mutable or immutable, namely whether you can change its value by writing to it.

`val` vs `ref` determine whether the binding has value or reference semantics.

- **Value semantics** imply that writing to a `val` will not affect any place pointed to by its initializer, and vice versa.

- **Reference semantics** imply the opposite - mutating a `ref` will mutate the place pointed to by its initializer, and vice versa.

### `let` Shorthands

`let` is optional when another keyword is present. When not otherwise specified, we generally default to `val`, vals default to `const`, and refs bind mutably if possible, to assist with generic programming.

Thus, the most common forms you'll use on any day are:

```
    // Shorthand:               // Equivalent to:

    let a = place || value;     /*  val a           = ...
                                    const a         = ...
                                    let val a       = ...
                                    let const a     = ...
                                    let const val a = ...   */

    mut b = place || value;     /*  mut val a       = ...
                                    let mut a       = ...
                                    let mut val a   = ...   */

    ref c = place;              /*  let ref c       = ...   */
//: hide foot

    c += b += a;
```

In function argument position the `let` is always omitted, so these look like:
```
fn test(a: int, mut b: int, ref c: int) {
//: hat
    c += b += a;
//: foot
}
//: hide shoe

fn main() {
    mut v = 0;
    test(v, v, v);
    return v;
}
```

Currently we also run with a Go & Python-like walrus *let expression*:
```
fn test(ref b: int) {
//: hide hat
    a := b;
//: hide foot
    return (b += a) += a;
}
//: hide shoe

fn main() {
    mut v = 1;
    return test(v) - 3;
}
```
... which is equivalent to:
```
    let a = b;
```
... but does not need to appear in statement position.

### About `const ref`

A `const ref`, seldom used, is immutable in the way that you cannot make writes to it, but still reflects mutations that occur on the place it is bound to.

In C++, one commonly defaults to `const &` as a cheap way to bind to some place without copying. This is not necessary here - just use `let`.

The borrow checker tracks what gets mutated and when, and will promote a `let` to a `const ref` when the bound place remains constant until the final use of the `let`. This is done after inlining, code motion and relaxation, and a copy is only incurred when all else fails. Finally, although not free, copies of non-trivial values generally benefit from copy-on-write and only increment a reference counter.

Data will really be copied only if it is actively mutated while used as a previously bound constant, at which point, in equivalent C++, one would have either made the copy explicitly, or would have a bug.

Thus, only use `const ref` if you really want to observe external mutation to an otherwise immutable binding, and otherwise default to `let`. A copy will only be incurred if necessary, and will heal automatically once your code evolves to no longer need it.
