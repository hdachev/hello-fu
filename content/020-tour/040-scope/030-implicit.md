
## `implicit` Argument Passing

Making use of [lexical scope](lexical-scope.md) can help reduce argument passing noise between a family of related functions, but doing so is not always possible - you might need to split your code among multiple code units.

Implicit argument passing delivers similar levels of terseness:

```
struct Module       { filename: string }
struct LineCol      { line: int; col: int }
struct Diagnostic   { filename: string; lc: LineCol; error: string }

fn emit_diagnostic(error:       string,
    implicit module:            Module,
    implicit lc:                LineCol,
    implicit ref diagnostics:   Diagnostic[])
{
    diagnostics ~= Diagnostic(:module.filename, :lc, :error);
}

fn parse_bool(span: byte[]) {
    if (span == "true")
        return true;

    if (span != "false")
        emit_diagnostic("Invalid bool literal: " ~ span);

    return false;
}
//: hide shoe

fn main() {
    implicit mut module:        Module;
    implicit mut lc:            LineCol;
    implicit mut diagnostics:   Diagnostic[];

    return parse_bool("true") && !diagnostics ? 0 : 1;
}
```

Note how we can call `emit_diagnostic` only only specify the `error: string` argument, the rest will be resolved automatically.

### Implicit Argument Resolution

Here is how `implicit` arguments work:

-   Any function may have any number of `implicit` arguments;

-   When invoking a function, the caller may omit any or all of the `implicit` arguments of the callee;

-   When omitted, `implicit` arguments are automatically resolved as follows:

    1.  First, if an `implicit` local with matching name and type exists within the lexical scope of the callsite, it is matched and passed to the callee.

    2.  Otherwise, the caller itself receives a matching `implicit` argument, and it is now the responsibility of their callers to provide it.

This continues, cross module, until either a matching `implicit` is found, or a function whose signature cannot be extended is reached, at which point the compiler will error out with the reverse call stack of the mismatched `implicit`.
