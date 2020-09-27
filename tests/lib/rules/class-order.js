/**
 * @fileoverview Sort tailwind class names
 * @author Kasper Mikiewicz
 */
'use strict'

const RuleTester = require('eslint').RuleTester
const rule = require('../../../lib/rules/class-order')
const parsers = require('../../helpers/parsers')
const parserOptions = {
  ecmaVersion: 2019,
  sourceType: 'module',
  ecmaFeatures: {
    jsx: true,
  },
}

new RuleTester({parserOptions}).run('class-order', rule, {
  valid: [
    {
      code: '<button tw="flex mt-2 mt-4">Sign In</button>',
    },
    {
      code: '<button class="flex mt-2 mt-4">Sign In</button>',
    },
    {
      code: '<button class="flex  mt-2 mt-4">Sign In</button>',
    },
    {
      code: '<button class="  flex  mt-2 mt-4 ">Sign In</button>',
    },
    {
      code: '<button class="flex mt-2 mt-4">Sign In</button>',
      parser: parsers.BABEL_ESLINT,
    },
    {
      code: 'tw.div`flex mt-2 mt-4`',
    },
    {
      code: 'tw`flex mt-2 mt-4`',
    },
    {
      code:
        'const Input = styled.input`\n${tw`flex mt-2 mt-4`}\ncolor: purple;`',
    },
  ],

  invalid: [
    {
      code: '<button class="mt-4 mt-2 flex">Sign In</button>',
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
    {
      code: '<button tw="mt-4 mt-2 flex">Sign In</button>',
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
    {
      code: '<button class="mt-4 mt-2 flex">Sign In</button>',
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
    {
      code: 'tw.div`mt-4 mt-2 flex`',
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
    {
      code:
        'const Input = styled.input`\n${tw`mt-4 mt-2 flex`}\ncolor: purple;`',
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
  ],
})
