
## Universal Function Call Syntax

Many languages make a syntactic distinction between method calls and free function calls, usually `a.f(b)` and `f(a, b)`. This can be an inconvenience when refactoring.

We allow you to call any function using either syntax:

```
fn main() {
    let step = 1;
    fn increment(ref v: int)
        v += step;

    mut ret = -2;
    increment(ret);     // f(a)
    ret.increment();    // a.f()    Both are equivalent.
    return ret;
}
```

Note how we appear to have privately extended `int`, a built-in type, with a method that interacts with lexical scope.

We make one distinction between the two syntaxes:

- The free function call syntax only considers functions that have been declared or explicitly imported in scope.
- The dot call syntax also considers all `pub` functions from the module of origin of the type of the dot-argument, and of every type it converts to.

### Parentheses are optional

Similarly, we do not require parentheses when making a call without arguments:

```
struct Dog {
    name:       string;
    dog_years:  int;
}

//: head
fn human_years(d: Dog)
    d.dog_years * 5 + (d.dog_years > 1 && 4)
                    + (d.dog_years > 0 && 10);

fn main() Dog("Robbie", dog_years: 4).human_years - 34;
```

Note how calls to `dog_years` and `human_years` use the same syntax.

### Named arguments

The example above saw us passing the parameter `dog_years: 4` by name. An `:x` shorthand is available for the common `x: x` pattern, here `:dog_years` -

```
fn Dog(name: string, human_years: int) {
    mut dog_years = human_years;
    if (dog_years > 10) dog_years -= 10;
    if (dog_years > 14) dog_years -= 4;

    dog_years /= 5;
    return Dog(:dog_years, :name);
}

fn main() Dog("Robbie", human_years: 34).dog_years - 4;
```

Note how:
- Passing arguments by name allows you to pass them out of order;
- We overloaded `Dog` with an additional initializer with a clashing signature. We are now required to use named arguments to disambiguate between the two.

### Optional arguments

Arguments may have default values, which are used when an argument is left unspecified:

```standalone
fn main() {
//: hide hat
    fn approx_ellipse_perimeter(a: f32, b = a)
        2 * f32.PI * sqrt(0.5 * (a * a + b * b));

    assert(approx_ellipse_perimeter(10)
        == approx_ellipse_perimeter(10, 10));
//: hide foot
    return 0;
}
```

Note that argument default expressions can access anything in [lexical scope](lexical-scope.md), including preceding arguments, in this case `b` defaults to `a`.

A shorthand is available for zero-filled defaults, here `reverse?: bool` defaults to `false`:

```standalone
fn each(ref array: _[], fn, reverse?: bool)
    for (mut i = 0; i < array.len; i++) {
        shadow let i = reverse
            ? array.len - 1 - i
            : i;

        fn(array[i], ?:i);
    }

fn main() {
    mut result = 0;
    [ 1, 2, 3 ].each(reverse: true): |item, i|
        (result += i) *= item;

    return result - 14;
}
```

Off-topic, but worth mentioning, note that `shadow let i` has access to the `mut i` it shadows within its initializer.

### Disregardable arguments

When thinking about optional arguments, we usually envision a function that does not require callers to provide all of its arguments. The opposite can also be useful - a generic callsite that does not require all of the arguments it provides to be used.

Note how the example above uses `?:i` to pass the array index into the iterator block - this allows us to provide it with a block that doesn't have an `i` argument:

```standalone
fn main() {
    fn each(ref array: _[], fn, reverse?: bool)
        for (mut i = 0; i < array.len; i++) {
            shadow let i = reverse
                ? array.len - 1 - i
                : i;

            fn(array[i], ?:i);
        }

//: hide head
    mut result = 0;
    [ 1, 2, 3 ].each(reverse: true): |item|
        (result += item) *= item;
//: hide foot

    return result - 23;
}
```

To protect from ambiguity and typos, we complain when both sides of the callsite have unmatched arguments.
