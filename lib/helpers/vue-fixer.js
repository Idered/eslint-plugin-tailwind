const defaultSortOrder = require('./default-sort-order')
const defaultOrder = ['custom', 'customVariant', 'general', 'responsive', 'hover', 'focus']
const resolveConfig = require('tailwindcss/resolveConfig')

module.exports = function(options) {
  const userConfigPath = require('path').resolve(options.configPath)
  const userConfig = require(userConfigPath)
  const config = resolveConfig(userConfig)

  let order = defaultOrder || options.customOrder

  const idx = order.indexOf('responsive')
  if (!!~idx)  {
    const mqs = Object.keys(config.theme.screens)  
    const before = order.slice(0, idx)
    const after  = order.slice(idx+1)
    order = before.concat(mqs).concat(after)
  }

  const indexes = {};
  ['general', 'custom', 'customVariant']
    .forEach(key => {
      const index = order.indexOf(key)
      if (!~index) throw new Error(`${key} not found in customOrder`)
      else indexes[key] = index
    })

  function getScore(className) {
    const score = Array(order.length).fill(1)
    const chunks = className.split(config.separator)
    const selectorOrder = defaultSortOrder.indexOf(chunks.pop())
    chunks.forEach(variant => {
      const idx = order.indexOf(variant)
      score[!!~idx? idx : indexes.customVariant] = 0
    })
    if (!~selectorOrder) score[indexes.custom] = 0
    else if (!chunks.length) score[indexes.general] = 0
    score.push(selectorOrder)
    return score
  }

  function sortFn(c1, c2) {
    const sc1 = getScore(c1)
    const sc2 = getScore(c2)
    for (let i=0; i < sc1.length; i++) {
      const v1 = sc1[i]
      const v2 = sc2[i]
      if (v1 == v2) continue
      return v1 > v2? 1 : -1
    }
  }

  function generateChunks(classList, chunkLength) {
    const chunks = []
    for (let i=0; i < classList.length; i += chunkLength) {
      chunks.push(classList.slice(i, i + chunkLength))
    }
    return chunks;
  }

  return function parser(classList, pad) {
    const spacer = Array(pad).join(' ')
    const sortedList = options.sort? classList.sort(sortFn) : classList
    if (!options.classesPerChunk) return sortedList.join(' ')
    return generateChunks(sortedList, options.classesPerChunk)
      .map(chunk => chunk.join(' '))
      .join(`\n${spacer}`)
  }
}
