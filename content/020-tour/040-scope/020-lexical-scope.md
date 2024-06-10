
## Lexical Scope & Shadowing

Functions can be nested within each other, and child functions see every definition visible at the point of their declaration.

Parent function locals are always captured by reference, which is most similar to the behavior of closures in a language like JavaScript.

```
struct Node { items: Node[] };

//: hat
fn count(node: Node) {
    mut count = 0;

    fn visit(shadow node: Node) {
        count++;
        node.items.each(.visit());
    }

    node.visit();
    return count;
}
//: hide shoe

fn main() {
    let tree = Node(items: [ Node(), Node() ]);
    assert(tree.count == 3);
    return 0;
}
```

We do not have real closures, as nested functions are not allowed to escape their parents. The code above is simply desugared into:

```
fn visit(node: Node, ref count: int) {
    count++;
    for (mut i = 0; i < node.items.len; i++)
        node.items[i].visit(:count);
}

fn count(node: Node) {
    mut count = 0;
    node.visit(:count);
    return count;
}
```

Lexical scoping can unite various language constructs into unique and interesting combinations, for example:

```:standalone,:best
fn reduce(array: <T>[], reducer, mut init!state?: T) {
    for (mut i = array.len; i --> 0; )
        state = reducer(array[i], state);

    return state;
}

//: hide hat
fn parent_fn(array_of_T: <T>[]) {

    // A private type visible within child functions:
    struct ChildType { raw: T };

    let array_of_ChildType = array_of_T.map(|v| ChildType(v));

    // An overloaded operator that mucks around with lexical scope:
    mut number_of_additions_performed = 0;

    infix fn +(a: ChildType, b: ChildType) {
        number_of_additions_performed++;
        return ChildType(a.raw + b.raw);
    }

    // Using the overloaded operator within a generic child fn:
    fn sum(array: _[]) = reduce(array, |a, b| a + b);

    // ... note that summing the ChildType array is impure:
    let actual = sum(array_of_ChildType).raw;
    //           ^^^ as it increments the counter above

    assert(actual == sum(array_of_T)
        && number_of_additions_performed == array_of_T.len);

    return actual;
}
//: hide shoe

fn main() parent_fn([ 1, 2, 3 ]) - 6;
```

### Segue Into Dynamic Scoping

Imagine the basic lexical scoping example above was something larger, such that it needed to be split apart into multiple functions, perhaps across several files, making lexical scoping impractical:

```
fn visit_each(items: Node[], ref count: int) {
    items.each(.visit(:count));
}

fn visit(node: Node, ref count: int) {
    count++;
    node.items.visit_each(:count);
}

fn count(node: Node) {
    mut count = 0;
    node.visit(:count);
    return count;
}
```

Note how we need to pass `ref count: int` around, which is repetitive and cumbersome.

When unable to benefit from lexical scoping, we can achieve similar terseness by using [implicit argument passing](implicit.md):

```
fn visit_each(items: Node[]) {
    items.each(.visit());
}

fn visit(node: Node, implicit ref count: int) {
    count++;
    node.items.visit_each();
}

fn count(node: Node) {
    implicit mut count = 0;
    node.visit();
    return count;
}
```

### Shadowing

TODO
