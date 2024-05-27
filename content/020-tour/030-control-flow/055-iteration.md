
## Iteration

Brief, our iteration primitives are most similar to iteration in Ruby, and are designed around two principles:

- Everything is a function;
- Control flow is non-local, and can jump to any label in lexical scope.

Let's start with a simple example:

```
fn increment_even_until(ref numbers: int[], needle: int) {
    for (mut i = 0; i < numbers.len; i++) {
        ref num = numbers[i];

        if (num & 1)            continue;
        if (num == needle)      break;
        if (num > needle * 2)   return num;

        num++;
    }

    return -1;
}
//: hide shoe

fn main() {
    mut numbers = [ 1, 2, 3, 4, 5, 6, 7, 8 ];
    assert(increment_even_until(:numbers, 6) == -1);
    assert(numbers == [ 1, 3, 3, 5, 5, 6, 7, 8 ]);
    return 0;
}
```

Let's imagine that the `numbers` array was non-trivial to iterate, and that we wanted to abstract its iteration logic for reuse. It is as simple as:

```
fn my_iterator(ref numbers: int[], fn)
    for (mut i = 0; i < numbers.len; i++)
        fn(numbers[i]);

//: head
fn increment_even_until(ref numbers: int[], needle: int) {
    numbers.my_iterator: |ref num| {
        if (num & 1)            continue;
        if (num == needle)      break;
        if (num > needle * 2)   return num;

        num++;
    }

    return -1;
}
```

You may notice that `continue` and `break` still work as intended.

In a `|block|`, `continue` simply returns from the block. `break` returns from the function whose callsite lexically wraps the block literal, in this case the call to `my_iterator`.

This labelled snippet is equivalent:

```
fn increment_even_until(ref numbers: int[], needle: int)
{
    :LABEL
    numbers.my_iterator: |ref num| {
        if (num & 1)            continue :LABEL;
        if (num == needle)      break :LABEL;
        if (num > needle * 2)   return :increment_even_until num;

        num++;
    }

    return -1;
}
```

Note that `break` breaks from the callsite which lexically scopes the block. Consider this two-layer iteration scheme:

```
fn each_1d(ref cols: int[], fn)
    for (mut i = 0; i < cols.len; i++)
        fn(cols[i]);

fn each_2d(ref rows: int[][], fn)
    for (mut i = 0; i < rows.len; i++)
        rows[i].each_1d: |ref num| fn(num);

//: head
fn increment_even_until(ref rows: int[][], needle: int) {
    rows.each_2d: |ref num| {
        if (num & 1)            continue;
        if (num == needle)      break;
        if (num > needle * 2)   return num;

        num++;
    }

    return -1;
}
//: hide shoe

fn main() {
    mut rows = [ [ 1, 2, 3, 4 ], [ 5, 6, 7, 8 ] ];
    assert(increment_even_until(:rows, 6) == -1);
    assert(rows == [ [ 1, 3, 3, 5 ], [ 5, 6, 7, 8 ] ]);
    return 0;
}
```

Here `break` terminates both iteration levels, and thus this labelled snippet is again equivalent:

```
fn increment_even_until(ref rows: int[][], needle: int)
{
    :LABEL
    rows.each_2d: |ref num| {
        if (num & 1)            continue :LABEL;
        if (num == needle)      break :LABEL;
        if (num > needle * 2)   return :increment_even_until num;

        num++;
    }

    return -1;
}
```

### Labelled `return` Statements and Foreign Jumps

Note that above we labelled the `return` statements when illustrating what jumped where. In fact, code in any non-recursive function can jump to any label currently in lexical scope.

Thus, this snippet is also equivalent to the ones above:

```
fn increment_even_until(ref rows: int[][], needle: int)
{
    :LABEL
    rows.each_2d: |ref num|
    {
        fn visit_number() {
            if (num == needle)      break :LABEL;
            if (num > needle * 2)   return :increment_even_until num;

            num++;
        }

        if !(num & 1)
            visit_number();
    }

    return -1;
}
```

In fact, blocks are just functions which remap the default labels for any unlabelled `break`, `continue`, and `return` statements they contain, such that they behave as if within the context of the lexically enclosing "regular" function.
