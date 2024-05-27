
## Overloading Without Ambiguity

Modern language design often shuns features such as overloading and implicit conversions. We have found that they are harmless so long as their method of operation is fully unambiguous.

### No Overload Resolution Order

When resolving a call, every function is considered equally viable. Every function, template, type and conversion is taken into account, and if the callsite can match more than one overload, it will fail to compile. This rule has no exceptions, and results in a simple guarantee:

- **Removing any definition currently in use will result in a compile time error.**

This may sound like a no-brainer but is generally not the case in languages with overloading.

### `case` Patterns

Template functions can have one or more `case` patterns, evaluated top to bottom.

```
fn sum(v: <T>[])
    case (T.is::arithmetic): T {
        mut ret: T;
        v.each: |it| ret += it;
        return ret;
    }
    case (T.is::flags): T {
        mut ret: T;
        v.each: |it| ret |= it;
        return ret;
    }
//: hide foot

using flags F { A; B; C }

fn main() sum([ A, B|A, C|B ]) == A|B|C
       && sum([ 1, 2, 3 ]) == 6
            ? 0 : 1;
```

The definition above could be split if needed, in which case both are evaluated on equal terms, and an ambiguity error will be raised if both match:

```
fn sum(v: <T>[]) case (T.is::arithmetic): T {
    mut ret: T;
    v.each: |it| ret += it;
    return ret;
}

fn sum(v: <T>[]) case (T.is::flags): T {
    mut ret: T;
    v.each: |it| ret |= it;
    return ret;
}
```

### Template Argument Constraints

Note the type annotation to the `v` arguments above. We simultaneously used `<T>` above to introduce a new type parameter `T` and used `[]` to constrain the argument to an array of that type.

TODO

### Argument `.autocall` Patterns

TODO

### Operator Overloading

```
struct BitSet { data: u8[] };

infix fn |=(ref .data left, .data right) {
    left.grow(max(left.len, right.len));
    right.each: |v, i| left[i] |= v;
}
//: hide foot

fn main() {
    mut a = BitSet([ 7.u8 ]);
    a |= BitSet([ 9.u8 ]);
    a.data[0] == 15 ? 0 : 1
}
```

TODO
