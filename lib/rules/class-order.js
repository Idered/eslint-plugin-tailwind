/**
 * @fileoverview Sort tailwind class names
 * @author Kasper Mikiewicz
 */
'use strict'

const defaultSortOrder = require('../helpers/default-sort-order')

//------------------------------------------------------------------------------
// Rule Definition
//------------------------------------------------------------------------------

/**
 * @type {import('eslint').Rule.RuleModule}
 */
module.exports = {
  meta: {
    type: 'suggestion',
    docs: {
      description: 'Sort tailwind class names',
      category: 'Stylistic Issues',
      recommended: false,
    },
    fixable: 'code',
    schema: [
      // TODO: Add options
    ],
    messages: {
      invalidClassOrder: 'Invalid class names order',
    },
  },

  create: function (context) {
    /**
     * @param {string} classString
     * @param {string[]} sortOrder
     */
    function sortClassString(classString, sortOrder) {
      let classArray = classString.split(/\s+/g)

      classArray = [
        ...classArray
          .filter((item) => sortOrder.indexOf(item) !== -1)
          .sort((a, b) => sortOrder.indexOf(a) - sortOrder.indexOf(b)),
        ...classArray.filter((item) => sortOrder.indexOf(item) === -1),
      ]

      // Remove duplicates
      classArray = [...new Set(classArray)]

      return classArray.join(' ').trim()
    }

    /**
     * @param {ASTNode} node
     */
    function getValueNode(node) {
      if (node.attributeValue) {
        return node.attributeValue
      } else if (
        node.quasi &&
        node.quasi.expressions[0] &&
        node.quasi.expressions[0].quasi
      ) {
        return node.quasi.expressions[0].quasi.quasis[0]
      } else if (node.quasi) {
        return node.quasi.quasis[0]
      }

      return Array.isArray(node.value) ? node.value[0] : node.value
    }

    /**
     * @param {ASTNode} node
     */
    function isValidTaggedTemplateNode(node) {
      try {
        if (
          !node.tag ||
          (node.tag.object.name !== 'tw' &&
            node.quasi.expressions[0].tag.name !== 'tw' &&
            node.tag.name !== 'tw')
        ) {
          return false
        }
        if (
          !node.quasi.quasis ||
          (!node.quasi.quasis[0].value &&
            !node.quasi.expressions[0].quasi.quasis[0].value)
        ) {
          return false
        }
      } catch (err) {
        if (err instanceof TypeError) {
          return false
        } else {
          throw err
        }
      }
      return true
    }

    /**
     * @param {ASTNode} node
     */
    function isValidJSXNode(node) {
      if (
        !node.name ||
        ['class', 'className', 'tw'].indexOf(node.name.name) === -1
      ) {
        return false
      }
      if (!getValueNode(node)) {
        return false
      }
      if (['Literal', 'Text'].indexOf(getValueNode(node).type) === -1) {
        return false
      }
      return true
    }

    /**
     * Reports an AST node as a rule violation.
     * @param {import('estree').Node} node The node to report.
     * @returns {void}
     * @private
     */
    function report(node, fix) {
      context.report({
        node,
        loc: getValueNode(node).loc,
        message: 'Invalid class names order',
        fix,
      })
    }

    function parseValue(value) {
      return String(value).trim().replace(/  +/g, ' ')
    }

    //----------------------------------------------------------------------
    // Public
    //----------------------------------------------------------------------

    return {
      TaggedTemplateExpression(node) {
        if (!isValidTaggedTemplateNode(node)) return

        const valueNode = getValueNode(node)
        const value = parseValue(valueNode.value.raw)
        const sortedClasses = sortClassString(value, defaultSortOrder)
        if (sortedClasses === value) return

        report(node, (fixer) =>
          fixer.replaceTextRange(
            [valueNode.range[0] + 1, valueNode.range[1] - 1],
            sortedClasses
          )
        )
      },
      HTMLAttribute(node) {
        if (node.attributeName.value !== 'class') return
        if (!node.attributeValue.value) return

        const valueNode = getValueNode(node)
        const value = parseValue(valueNode.value)
        const sortedClasses = sortClassString(value, defaultSortOrder)
        if (sortedClasses === value) return

        report(node, (fixer) =>
          fixer.replaceTextRange(
            [valueNode.range[0], valueNode.range[1]],
            sortedClasses
          )
        )
      },
      JSXAttribute(node) {
        if (!isValidJSXNode(node)) return

        const valueNode = getValueNode(node)
        const value = parseValue(valueNode.value)
        const sortedClasses = sortClassString(value, defaultSortOrder)
        if (sortedClasses === value) return

        report(node, (fixer) =>
          fixer.replaceTextRange(
            [getValueNode(node).range[0] + 1, getValueNode(node).range[1] - 1],
            sortedClasses
          )
        )
      },
    }
  },
}
