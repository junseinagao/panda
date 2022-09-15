import { describe, expect, test } from 'vitest'
import { getRecipe, processRecipe } from './fixture'

describe('recipe ruleset', () => {
  test('should work with basic', () => {
    expect(processRecipe('textStyle', { variant: 'h1' })).toMatchInlineSnapshot(`
      ".textStyle {
          text-align: center;
          text-indent: 2px
      }
      .textStyle__variant-h1 {
          font-size: 2rem;
          line-height: 1.4
      }"
    `)

    expect(processRecipe('textStyle', {})).toMatchInlineSnapshot(`
      ".textStyle {
          text-align: center;
          text-indent: 2px
      }
      .textStyle__variant-h2 {
          font-size: 1.5rem;
          line-height: 1.2
      }"
    `)

    expect(processRecipe('textStyle', { variant: { _: 'h1', md: 'h2' } })).toMatchInlineSnapshot(`
      ".textStyle {
          text-align: center;
          text-indent: 2px
      }
      .textStyle__variant-h1 {
          font-size: 2rem;
          line-height: 1.4
      }
      @screen md {
          .md\\\\:textStyle__variant-h2 {
              font-size: 1.5rem;
              line-height: 1.2
          }
      }"
    `)
  })

  test.only('should process recipe with conditions', () => {
    expect(getRecipe('buttonStyle')).toMatchInlineSnapshot(`
      {
        "base": {
          "alignItems": "center",
          "display": "inline-flex",
          "justifyContent": "center",
        },
        "defaultVariants": {
          "size": "md",
          "variant": "solid",
        },
        "name": "buttonStyle",
        "variants": {
          "size": {
            "md": {
              "height": "3rem",
              "minWidth": "3rem",
              "padding": "0 0.75rem",
            },
            "sm": {
              "height": "2.5rem",
              "minWidth": "2.5rem",
              "padding": "0 0.5rem",
            },
          },
          "variant": {
            "outline": {
              "&:hover": {
                "backgroundColor": "blue",
                "color": "white",
              },
              "&[data-disabled]": {
                "backgroundColor": "transparent",
                "border": "1px solid gray",
                "color": "gray",
              },
              "backgroundColor": "transparent",
              "border": "1px solid blue",
              "color": "blue",
            },
            "solid": {
              "&:hover": {
                "backgroundColor": "darkblue",
              },
              "&[data-disabled]": {
                "backgroundColor": "gray",
                "color": "black",
              },
              "backgroundColor": "blue",
              "color": "white",
            },
          },
        },
      }
    `)

    expect(processRecipe('buttonStyle', { variant: 'solid' })).toMatchInlineSnapshot(`
      ".buttonStyle {
          display: inline-flex;
          align-items: center;
          justify-content: center
      }
      .buttonStyle__size-md {
          height: 3rem;
          min-width: 3rem;
          padding: 0 0.75rem
      }
      .buttonStyle__variant-solid {
          background-color: blue;
          color: white;
          &:hover {
              background-color: darkblue
          }
          &[data-disabled] {
              background-color: gray;
              color: black
          }
      }"
    `)

    expect(processRecipe('buttonStyle', { variant: { _: 'solid', lg: 'outline' } })).toMatchInlineSnapshot(`
      ".buttonStyle {
          display: inline-flex;
          align-items: center;
          justify-content: center
      }
      .buttonStyle__size-md {
          height: 3rem;
          min-width: 3rem;
          padding: 0 0.75rem
      }
      .buttonStyle__variant-solid {
          background-color: blue;
          color: white;
          &:hover {
              background-color: darkblue
          }
          &[data-disabled] {
              background-color: gray;
              color: black
          }
      }
      @screen lg {
          .lg\\\\:buttonStyle__variant-outline {
              background-color: transparent;
              border: 1px solid blue;
              color: blue;
              &:hover {
                  background-color: blue;
                  color: white
              }
              &[data-disabled] {
                  background-color: transparent;
                  border: 1px solid gray;
                  color: gray
              }
          }
      }"
    `)
  })
})
