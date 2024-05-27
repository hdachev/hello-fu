
## Structures & Reflection

`struct` declarations work similarly to those in all C-style languages.

```
struct Person {
    name:       string;
    age:        int;
}
//: hide shoe

fn main() {
    let p = Person("Albert", 26);
    return p.name.len + p.age - 32;
}
```

### Field Iteration

In a language like JavaScript, one can iterate over the fields of pretty much any object, which enables a very simple, very expressive form of metaprogramming. We couldn't resist.

```
struct Person {
    name:       string;
    age:        int;
}

//: hide head
fn pretty_print(value: Person) {
    println("Person {");
    for (fieldname i: Person)
        println("    " ~ "i" ~ ": " value.i);

    println("}");
}
```

Note that:
- The loop is unrolled at compile time;
- The loop body is specialized for each field type, here `string` and `int` respectively;
- Here `"i"` gets replaced by `"name"` and `"age"` respectively, a simple macro-like trick meant to help with printing and serialization.

Also note that we're iterating a type, not any value in particular. This is quite expressive:

```
fn maybe_the_same_person(a: Person, b: Person) {
    for (fieldname field: Person)
        if (a.field != b.field)
            return false;

    return true;
}
```

Note how here we trivially zipped over two values.

### `true` Fields

A value of a `struct` type is considered [truthy](short-circuit.md#truthy-and-falsy-values) if any of its `true` fields is truthy:

```
struct Container {
    true size:  int;
    raw_data:   int[];
}
//: hide shoe

fn main() {
    mut c = Container();
    assert(!!c == false);

    c.raw_data ~= [ 1, 2, 3 ];
    assert(!!c == false);

    c.size = 3;
    assert(!!c == true);

    return 0;
}
```

Here `Container` will only evaluate to `true` if its size is non-zero.

If no fields are marked `true`, it is assumed that all are, which means that values of such a `struct` type are considered truthy if any of their fields are truthy.
