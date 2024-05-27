
## Built-in Types

The usual array of built-in primitive types you would expect from a C-style language are available.

Additionally, dynamic arrays and slices are currently built-in, and thus magical. Our intent is to make them increasingly less magical as we add low-level features to the language, but this is not a priority: if keeping them magical greatly benefits compile times, or enables some form of useful high-level optimization that we cannot otherwise replicate, we will keep them as they are.

### Built-in Arithmetic Primitives

- `i8` .. `i128`: Fixed size signed integers.
- `u8` .. `u128`: Fixed size unsigned integers.
- `f32` and `f64`: Single and double precision floating point numbers.
- `int` and `uint`: Integral types guaranteed to be the same size as array indices.

### Built-in Non-Arithmetic Primitives

- `bool`: A Boolean type, the type of `true`, `false` and the result of the logical `!` operator.
- `byte`: A non-arithmetic byte type, used to represent opaque binary data, including strings.
- `void`: The zero-size return type of blocks and functions that do not produce a value.
- `never`: The empty return type of functions and expressions that never terminate.
- `[]`: The zero-size type of the default-initialization expression, which can convert to any type that supports default-initialization.

### Zero Initialization

TODO

### Built-in Structural Types

- `<T>[]`: The built-in Dynamic Array type.
- `<T>[..]`: The built-in Slice type.

TODO
