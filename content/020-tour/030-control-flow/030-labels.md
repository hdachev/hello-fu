
## Local & Foreign Labels

Labels are introduced with a leading `:`, which is symmetric to how they are later referred to. Here is how to `continue` or `break` from a nested loop:

```exit 1
struct Recipe {
    name:           string;
    ingredients:    string[];
}

fn whats_for_dinner(recipes: Recipe[], fridge: string[]) {
//: hide hat
    :OUTER_LOOP
    recipes.each: |recipe| {
        recipe.ingredients.each: |ingredient|
            if !(fridge.has(ingredient))
                continue :OUTER_LOOP;

        return recipe;
    }
//: hide shoe

    return [];
}

fn main() {
    mut recipes = [
        Recipe("Aglio, Olio, Peperoncino",
            [ "Spaghetti", "Aglio", "Olio", "Peperoncino" ]),
    ];

    let recipe = whats_for_dinner(:recipes, []) || {
        println("Looks like we won't be having dinner tonight.");
        return 1;
    }

    println("We're having " recipe.name " for dinner.");
    return 0;
}
```

We'll discuss [iteration](iteration.md) in the following chapter, in any case calls to `.each` amount to a regular `for (;;)` loop, and we're using them here for brevity.

Of note is that parent function **labels are available to child functions**:

```exit 1
    :OUTER_LOOP
    recipes.each: |recipe| {
        fn fail(reason: string) {
            println("Cannot prepare " recipe.name ": " reason);
            continue :OUTER_LOOP;
        }

        recipe.ingredients.each: |ingredient|
            if !(fridge.has(ingredient))
                fail("We don't have " ~ ingredient);

        return recipe;
    }
```

Because `fn fail` is now defined in the outer loop, the label has become redundant:

```exit 1
    recipes.each: |recipe| {
        fn fail(reason: string)
            continue println("Cannot prepare " recipe.name ": " reason);

        recipe.ingredients.each: |ingredient|
            if !(fridge.has(ingredient))
                fail("We don't have " ~ ingredient);

        return recipe;
    }
```

### Labelled Blocks and Block Expressions

You can `break` from labelled blocks, just like in JavaScript, Rust and Zig:

```
fn main() {
//: hide hat
    :LABEL {
        for (mut i = 0; i < 10; i++)
            for (mut j = 0; j < 10; j++)
                if (i == j)
                    break :LABEL;

        println("This is never executed.");
    }
//: hide shoe

    return 0;
}
```

Blocks are expressions, which allows you to wrap any statement in a block to place it in expression position:

```
fn main() {
//: hide hat
    let zero = {
        println("Effect!");
        0
    };
//: hide shoe
    return zero;
}
```

The comma operator from C-style languages is not available, because blocks provide identical functionality.

Thus, the C-style expression `a = (b, c)` is written as `a = { b; c }`.

You can `break` with a value from labelled block expressions:

```
    let zero = {
        :LABEL {
            for (mut i = 0; i < 10; i++)
                for (mut j = 0; j < 10; j++)
                    if (i == j)
                        break :LABEL i;

            -1
        }
    };

    assert(zero == 0);
```
