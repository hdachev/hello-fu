
## Template Types

TODO

### Template `struct` Declarations

```
struct Pair(type Left, type Right) {
    left:   Left;
    right:  Right;
}

fn fst(pair: Pair(<Left>, _)): Left =
    pair.left;

fn snd(pair: Pair(_, <Right>)): Right =
    pair.right;

fn sum(pair: Pair(<T>, T))
    case (T.is::arithmetic): T =
        pair.fst + pair.snd;
//: hide shoe

fn main() {
    let p = Pair(int, int)(2, 3);
    return p.sum - 5;
}
```

TODO
