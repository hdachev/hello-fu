
## The `using` Keyword

We take great inspiration from the language Jai, designed by Jonathan Blow. Our `using` is largely based on the design of the `using` keyword in Jai, further overloaded for introducing implicit conversion functions.

### `using` Function Arguments

Let's begin with this snippet:

```
struct vec2     { x: f32; y: f32 };
//: hat
struct Player   { position: vec2 };

//: head
fn move(ref player: Player, dist: vec2) {
    player.position.x += dist.x;
    player.position.y += dist.y;
}
//: hide shoe

fn main() {
    mut p: Player;
    p.move(vec2(10, 10));
    assert(p.position.x * p.position.y == 100);
    return 0;
}
```

In a language like C++, if `move` were a method of `Player`, one would be able to abbreviate the repetitous `player.position.*`  to just `position.*`. We can achieve the same by `using` the `player` argument to `move`:

```
fn move(using ref player: Player, dist: vec2) {
    position.x += dist.x;
    position.y += dist.y;
}
```

You can be `using` as many function arguments as you need.

Any ambiguity is a hard error, so you won't be able to set `using` e.g. on multiple variables of the same type, or use it to shadow a local or global of the same name, etc.

### `using` Variable Declarations

`using` works with any variable declaration, not just function arguments:

```
fn move(ref player: Player, dist: vec2) {
    using ref pos = player.position;
    x += dist.x;
    y += dist.y;
}
```

Since the new `pos` local is never used by name, we can make it anonymous:

```
fn move(ref player: Player, dist: vec2) {
    using ref _ = player.position;
    x += dist.x;
    y += dist.y;
}
```

... or skip the variable declaration altogether:

```
fn move(ref player: Player, dist: vec2) {
    using player.position;
    x += dist.x;
    y += dist.y;
}
```

### `using` Struct Members

In an object-oriented language, one might consider having `Player` inherit from `Position` to avoid having to type `*.position` repeatedly. We can cleanly achieve the same by `using` the `position` field in `Player`.

```
struct Player   { using position: vec2 };

//: head
fn move(using ref player: Player, dist: vec2) {
    x += dist.x;
    y += dist.y;
}
```

You can be `using` as many fields as you need, and there is no limit on `using` depth. Aside from cutting down on typing, `using` can help make code more refactorable, by making fields moveable between a set of related structs without a lot of rework elsewhere.

### `using` Functions

Imagine you don't control the definition for `Player` above, or want to introduce the `Player` -> `Position` conversion temporarily, in some private scope.

You can achieve the same by `using` a function:

```
struct Player   { position: vec2 };

//: head
using fn getPlayerPosition(ref p: Player) p.position;

fn move(ref player: Player, dist: vec2) {
    player.x += dist.x;
    player.y += dist.y;
}
```

Note that although here it doesn't make much of a difference, you can introduce this conversion edge in any scope:

```
fn move(ref player: Player, dist: vec2)
{
    using fn getPlayerPosition(ref p: Player) p.position;

    player.x += dist.x;
    player.y += dist.y;
}
```

Finally, to come full circle, yet another way to achieve the same thing would be by `using` a nullary function:

```
fn move(ref player: Player, dist: vec2)
{
    using fn getPlayerPosition() player.position;

    x += dist.x;
    y += dist.y;
}
```

Currently, `using` a function will invoke it every time it is needed because of a missing or mismatched argument at some callsite, which will reapply its side effects, if any. Thus, `using` functions are best kept pure which helps with common subexpression elimination.
