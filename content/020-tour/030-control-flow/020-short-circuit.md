
## Short-Circuit Operators

In most compiled languages, the `&&` and `||` operators take boolean operands and always return a boolean result. Most scripting languages instead tend to evaluate the truthiness of the left argument, and then either return it (whatever its type may be), or evaluate and return the right operand.

We have chosen the latter behaviour, because it is more expressive. Consider this program:

```exit 1
fn trimmed(str: string) {
    mut start = 0;
    for (; start < str.len; start++)
        if (str[start] > ' ')
            break;

    mut end = str.len;
    for (; end --> start; )
        if (str[end] > ' ')
            break;

    return str[start .. end + 1];
}

//: hide hat
fn if(argv: _[], exists!i: int)
    argv.len > i && argv[i];

fn main(argv: string[]) {
    let name = argv.if(exists: 1).trimmed || {
        println("Usage: greet [name]");
        return 1;
    };

    println("Hello, " name "!");
//: shoe
    return 0;
}
```

Note how:

- `argv.if` returns `argv[i]` only if `argv.len > i`, and an empty slice otherwise;
- we're using `argv.if` as an ad-hoc pattern matching utensil in `main`;
- because empty strings are [falsy](#truthy-and-falsy-values) this program will only greet the user if the provided name, once `trimmed` from leading and trailing whitespace, is a non empty.

### Caveats

Static typing imposes some limitations on how these operators can be used in practice.

- In a boolean context (e.g. the condition of an `if` statement), the operators accept any combination of types.

- Otherwise, `||` requires that both operands are of the same type, while `&&` allows operands of mismatched types so long as the right-hand type can be zero initialized.

Thus, outside of a boolean context:

```
fn main() {
//: hide hat
    0     || "Dog"          // is an error
    2     || "Dog"          // is an error
    ""    || "Dog"          // is "Dog"
    "Cat" || "Dog"          // is "Cat"

    0     && "Dog"          // is ""
    2     && "Dog"          // is "Dog"
    ""    && "Dog"          // is ""
    "Cat" && "Dog"          // is "Dog"
//: hide shoe
    return 0;
}
```

### Truthy and Falsy Values

Currently, all value types must be zero-initializable, and any zero-filled value must evaluate to `false` when coerced to `bool`. This means that a sequence of zero bytes of sufficient length is a valid value of any type.

Importantly, currently:

- All primitives are falsy if `0` and truthy otherwise.
- A dynamic array or string is truthy if it is not empty.
- A struct is truthy if any of its [`true`](structures.md#true-fields) fields are truthy.
