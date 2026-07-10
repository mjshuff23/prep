# Part 3.5 - Animation

Files: `playground.html` (CSS transitions, Bezier/easing, requestAnimationFrame)

## Bezier curves and easing

Animation is mostly interpolation: given progress from `0` to `1`, compute the value
between a start and end state. Easing changes how progress feels.

CSS timing functions describe that mapping:

| Timing | Feel |
|---|---|
| `linear` | constant speed |
| `ease-in` | starts slow, ends fast |
| `ease-out` | starts fast, ends slow |
| `ease-in-out` | slow at both ends |
| `cubic-bezier(...)` | custom curve |

The key mental model: easing changes time, not the property being animated. A box from
`left: 0` to `left: 300px` still ends at `300px`; the curve changes how quickly it
passes intermediate points.

## CSS transitions and animations

Use CSS when the browser can animate declarative property changes:

- transitions for "when this property changes, animate it";
- keyframe animations for named timelines;
- transform/opacity for smooth motion because they can avoid layout work.

Avoid animating layout-heavy properties (`width`, `height`, `top`, `left`) in hot UI.
They can force style/layout/paint every frame. Prefer `transform: translate(...)` and
`opacity` when possible.

## JavaScript animations

Use `requestAnimationFrame` when the next value depends on JavaScript: canvas drawing,
physics, scroll-linked effects, or interruptible custom timelines.

`requestAnimationFrame(callback)` runs before the next repaint and passes a high
resolution timestamp. Always compute progress from time:

```js
const progress = Math.min((timestamp - start) / duration, 1);
```

Do not move by a fixed number of pixels per frame. A 144 Hz screen and a busy 30 Hz
tab would move at different speeds. Time-based progress keeps duration stable.

## Predict the behavior

1. A CSS transition changes `transform` and `width`. Which is usually cheaper?
2. Why is `setInterval(fn, 16)` worse than `requestAnimationFrame` for visual work?
3. In an rAF animation, should position be based on frame count or elapsed time?
4. Does `ease-out` change the final value?

<details>
<summary>Answers</summary>

1. `transform`. It can often be composited without layout.
2. It is not synchronized with painting, keeps firing in awkward times, and can do
   unnecessary work in background/busy tabs.
3. Elapsed time.
4. No. It changes pacing only; the final interpolated value is the same.

</details>
