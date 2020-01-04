# Sort tailwind class names (class-order)

## Rule Details

This rule aims to keep tailwind classes order consistent.

Examples of **incorrect** code for this rule:

```js
<button class="flex relative mb-2 mb-0"></button>
```

Examples of **correct** code for this rule:

```js
<button class="relative flex mb-0 mb-2"></button>
```

## Further Reading

Order of rules is based on [this list](https://github.com/heybourn/headwind/blob/master/package.json#L59).
