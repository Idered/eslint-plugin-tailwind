# eslint-plugin-tailwind

<p align="center">
  <img src="https://i.imgur.com/jFKJZMw.gif">
</p>

![npm (scoped)](https://img.shields.io/npm/v/eslint-plugin-tailwind?style=for-the-badge) ![npm bundle size (scoped)](https://img.shields.io/npm/l/eslint-plugin-tailwind?style=for-the-badge)

ESLint rules for [Tailwind CSS](https://tailwindcss.com/)

## Installation

You'll first need to install [ESLint](http://eslint.org):

```
$ npm i eslint --save-dev
```

Next, install `eslint-plugin-tailwind`:

```
$ npm install eslint-plugin-tailwind --save-dev
```

**Note:** If you installed ESLint globally (using the `-g` flag) then you must also install `eslint-plugin-tailwind` globally.

## Usage

Extend your ESLint config with tailwind config:

```json
{
  "extends": ["plugin:tailwind/recommended"]
}
```

## Supported Rules

- [`tailwind/class-order`](docs/rules/class-order.md)

## Supported languages and file extensions

- HTML - `html`
- React - `js`, `jsx`, `tsx`

## VS Code integration

See [/example/.vscode](./example/.vscode) directory for recommended project settings.

## Roadmap

- [ ] Handle responsive prefixes - `sm`, `md` etc.
- [ ] Handle pseudo classes - `hover`, `active` etc.
- [ ] Add support for Vue
- [ ] Add support for Svelte
- [ ] Add support for Angular
