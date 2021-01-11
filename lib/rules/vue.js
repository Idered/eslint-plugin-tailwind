/**
 * @fileoverview Alphabetizes static class names.
 * @author Maciej Chmurski
 */
'use strict'

// ------------------------------------------------------------------------------
// Requirements
// ------------------------------------------------------------------------------

// Stolen eslint-plugin-vue/lib/utils
function defineTemplateBodyVisitor (context, templateBodyVisitor, scriptVisitor) {
  if (context.parserServices.defineTemplateBodyVisitor == null) {
    context.report({
      loc: { line: 1, column: 0 },
      message: 'Use the latest vue-eslint-parser. See also https://eslint.vuejs.org/user-guide/#what-is-the-use-the-latest-vue-eslint-parser-error'
    })
    return {}
  }
  return context.parserServices.defineTemplateBodyVisitor(templateBodyVisitor, scriptVisitor)
}

function parseOptions(options) {
  const defaultOptions = {
    configPath: './tailwind.config.js',
    sort: true,
    classesPerChunk: null
  }
  return { ...defaultOptions, ...options }
}

const createFixer = require('../helpers/vue-fixer')

// ------------------------------------------------------------------------------
// Rule Definition
// ------------------------------------------------------------------------------
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'enforce static class names order',
      recommended: true
    },
    fixable: 'code',
    schema: [
      {
        type: 'object',
        properties: {
          configPath: {
            type: 'string',
          },
          sort: {
            type: 'boolean',
          },
          classesPerChunk: {
            type: 'number'
          },
          customOrder: {
            type: 'array'
          }
        },
        additionalProperties: false
      }
    ],
  },
  create: (context) => {
    const options = parseOptions(context.options[0])
    const vueFixer = createFixer(options) 
    return defineTemplateBodyVisitor(context, {
      "VAttribute[directive=false][key.name='class']"(node) {
        const classListStr = node.value.value
        const classList = classListStr.split(/(\s+)/).filter(className => className.trim() !== '')
        const pad = node.loc.start.column + ' class=\"'.length
        const classListSorted = vueFixer(classList, pad)
        
        if (classListStr !== classListSorted) {
          context.report({
            node,
            loc: node.loc,
            message: 'Classes should be ordered alphabetically.',
            fix: (fixer) =>  {
              return fixer.replaceTextRange(
                [node.value.range[0], node.value.range[1]],
                `"${classListSorted}"`
              )
            }
          })
        }
      }
    })
  }
}
