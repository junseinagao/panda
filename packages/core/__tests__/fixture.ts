import * as mocks from '@css-panda/fixture'
import { TokenMap } from '@css-panda/tokens'
import postcss from 'postcss'
import { Conditions, mergeUtilities, Utility } from '../src'
import { mergeRecipes, Recipe } from '../src/recipe'
import type { GeneratorContext } from '../src/types'

const propMap = {
  display: 'd',
  height: 'h',
  width: 'w',
  minHeight: 'min-h',
  textAlign: 'ta',
}

const conditions = new Conditions({
  conditions: mocks.conditions,
  breakpoints: mocks.breakpoints,
})

const tokens = new TokenMap({
  tokens: mocks.tokens,
  semanticTokens: mocks.semanticTokens,
})

export const createContext = (): GeneratorContext => ({
  root: postcss.root(),
  conditions: conditions,
  breakpoints: mocks.breakpoints,
  utility: new Utility({
    config: mergeUtilities(mocks.utilities),
    tokens,
  }),
  helpers: {
    map: () => '',
  },
  transform: (prop, value) => {
    const key = propMap[prop] ?? prop
    return {
      className: `${key}-${value}`,
      styles: { [prop]: value },
    }
  },
})

export function getRecipe(key: 'buttonStyle' | 'textStyle') {
  const recipes = mergeRecipes(mocks.recipes, createContext())
  return recipes[key]
}

export function processRecipe(key: 'buttonStyle' | 'textStyle', value: Record<string, any>) {
  const recipe = getRecipe(key)
  const context = createContext()
  const _recipe = new Recipe(recipe, context)
  _recipe.process({ styles: value })
  return _recipe.toCss()
}
