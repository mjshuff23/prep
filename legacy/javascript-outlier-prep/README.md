# JavaScript Outlier Prep

This folder is aimed at Outlier's JavaScript skills screening, based on public candidate reports and common JavaScript screening patterns. Public details are limited, but reports consistently describe a fast-paced test with timed questions, a mix of multiple choice, written answers, and video/audio explanation. One candidate report specifically recommends brushing up on closures and hoisting.

Use this like a speed notebook:

1. Start with `outlier-speed-drills.md`.
2. Drill `basic-tech-trivia.md` until the answers feel automatic.
3. Work through `array-methods.md` with a console open.
4. Practice explaining closures, hoisting, coercion, promises, and array transformations out loud in 30-60 seconds.

## Likely Screening Areas

- Types and coercion: `typeof`, truthy/falsy values, `==` vs `===`, `Object.is`, `NaN`, `null`, arrays in comparisons.
- Scope and execution: `var`/`let`/`const`, hoisting, temporal dead zone, closures, lexical scope.
- Functions: arrow functions, regular functions, `this`, default/rest/spread parameters.
- Arrays and objects: destructuring, copying, mutation vs non-mutation, iteration methods, sparse arrays.
- Async JavaScript: callbacks, promises, `async`/`await`, event loop basics, microtasks vs macrotasks.
- Prototypes/classes: prototype chain, constructor functions, `class` syntax, instance vs static methods.
- Practical code reading: predict output, find the bug, write a small utility, explain edge cases.

## Outlier-Specific Practice Style

Do not only memorize answers. Practice giving short explanations:

- "What happens?"
- "Why?"
- "What would I use in real code?"
- "What edge case would break this?"

For timed questions, the move is to identify the category fast. If a question contains `==`, empty arrays, `null`, `NaN`, `var`, closures in loops, promises, or `this`, assume it is testing a known JavaScript edge case.

