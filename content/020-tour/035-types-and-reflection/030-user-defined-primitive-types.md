
## Enums, Flags & Primitives

Currently we provide three flavors of user-defined primitives. All three types are declared in a similar manner.

### `primitive` Types

```
primitive Distance: f32 {
    Meter       = 1;
    Kilometer   = 1000;
};
//: hide shoe

fn main() {
    assert(1000 * Distance.Meter == Distance.Kilometer);
    return 0;
}
```

`primitive` declarations introduce new types that behave like strong typedefs of the underlying base primitive. Values of the base-type are not assignable to the new `primitive`, and vice versa. The new type is only convertible from its base-type.

User-defined `primitive` types inherit all arithmetic and bitwise operations supported by their base types.

### `enum` Types

```
enum MyScopedEnum: u8 {
    A = 0;
    B;
}
//: hide shoe

fn main() {
    assert(MyScopedEnum.B.u8 - MyScopedEnum.A.u8 == 1);
    return 0;
}
```

`enum` types behave much like scoped enums in C++. We do not support Rust and Swift-like data-carrying enums yet. The default base-type for enum is `u8`.

`enum` types do not support any arithmetic or bitwise operations, whatever their base type.

### `flags` Types

```
flags MyFlags: u16 {
    FlagA;
    FlagB;
};
//: hide shoe

fn main() {
    assert(u16(MyFlags.FlagA | MyFlags.FlagB) == 3);
    return 0;
}
```

`flags` declarations behave much like `[Flags]` enums in C#. They introduce a new user-defined bitfield type.

Unlike an `enum`, a `flags` value is intended to be used as a mask, possibly containing zero, one, several or all of the members of its type. To that end, `flags` members are automatically numbered as powers of two, starting at `1`, which makes them suitable for masking and bitwise operations, which they support.
