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
      code: '<button class="mt-4 mt-2 flex">Sign In</button>',
      parser: parsers.BABEL_ESLINT,
      errors: [
        {
          message: 'Invalid class names order',
        },
      ],
    },
  ],
})
