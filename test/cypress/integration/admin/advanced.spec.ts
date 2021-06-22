import { Chance } from 'chance'

const CH = new Chance()
const ALPHA_POOL = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'

describe('Admin > Advanced Features', () => {
  beforeEach(() => cy.login(Cypress.env('ADMIN_USERNAME'), Cypress.env('ADMIN_PASSWORD')))

  describe('Given a WP user with permissions', () => {

    describe('When the user activates the plugin and navigates to the settings page', () => {
      beforeEach(() => 
        cy.task('db:setup')
          .activatePlugin('w3w-autosuggest')
          .openSettingsPage('what3words')
      )

      it('Then the advanced features menu is collapsed', () => {
        cy.getElementByDataTestId('advanced_form')
          .should('exist')
          .should('not.be.visible')
      })

      it('Then the advanced features menu should expand when toggle is clicked', () => {
        cy.toggleAdvancedSettings()
          .getElementByDataTestId('advanced_form')
            .should('exist')
            .should('be.visible')
          .getElementByDataTestId('enable_placeholder')
            .should('exist')
            .should('be.visible')
          .getElementByDataTestId('placeholder')
            .should('exist')
            .should('be.visible')
          .getElementByDataTestId('')
      })

      describe('And the advanced features menu is expanded', () => {
        beforeEach(() => cy.toggleAdvancedSettings())

        it('Then the placeholder checkbox should not be checked by default', () => {
          cy.getElementByDataTestId('enable_placeholder').should('not.be.checked')
          cy.getElementByDataTestId('placeholder').should('be.disabled')
        })

        describe('And the placeholder checkbox is checked', () => {
          beforeEach(() => cy.togglePlaceholder())

          it('Then the placeholder input is enabled', () => {
            cy.getElementByDataTestId('placeholder').should('be.enabled')
          })

          it('Then the placeholder is required when checked', () => {
            cy.assertTargetValidity('placeholder', false)
          })
  
          it('Then the placeholder is saved when a value is entered and submitted', () => {
            const value = 'my custom placeholder'
            cy.getElementByDataTestId('placeholder').focus().type(value)
              .saveAdvanced()
              .toggleAdvancedSettings()
              .getElementByDataTestId('enable_placeholder').should('be.checked')
              .getElementByDataTestId('placeholder').should('have.value', value)
          })
        })

        it('Then the clip to country checkbox should not be checked by default', () => {
          cy.getElementByDataTestId('enable_clip_to_country').should('not.be.checked')
          cy.getElementByDataTestId('clip_to_country').should('be.disabled')
        })

        describe('And the clip to country checkbox is checked', () => {
          const invalidValues = [
            CH.string({ length: 1, pool: ALPHA_POOL }),
            CH.string({ length: 3, pool: ALPHA_POOL }),
            CH.integer({ min: 10, max: 99 }),
            `${CH.integer({ min: 10, max: 99 })},${CH.integer({ min: 10, max: 99 })}`,
          ]
          const validValues = [
            CH.string({ length: 2, pool: ALPHA_POOL }),
            CH.country(),
            `${CH.country()}, ${CH.country()}, ${CH.country()}`,
          ]
          beforeEach(() => cy.toggleClipToCountry())

          it('Then the clip to country input is enabled', () => {
            cy.getElementByDataTestId('clip_to_country').should('be.enabled')
          })

          it('Then the clip to country is required when checked', () => {
            cy.assertTargetValidity('clip_to_country', false)
          })

          invalidValues.forEach((value) => {
            it(`Then the clip to country is not saved when ${value} is entered`, () => {
              cy.getElementByDataTestId('clip_to_country').focus().type(`${value}`)
                .saveAdvanced()
                .getElementByDataTestId('clip_to_country').should('have.class', 'is-invalid')
            })
          })
  
          validValues.forEach((value) => {
            it('Then the clip to country is saved when a value is entered and submitted', () => {
              cy.getElementByDataTestId('clip_to_country').focus().type(value)
                .saveAdvanced()
                .toggleAdvancedSettings()
                .getElementByDataTestId('enable_clip_to_country').should('be.checked')
                .getElementByDataTestId('clip_to_country').should('have.value', value)
            })
          })
        })

        it('Then the clip to circle checkbox should not be checked by default', () => {
          cy.getElementByDataTestId('enable_clip_to_circle').should('not.be.checked')
          cy.getElementByDataTestId('clip_to_circle_lat').should('be.disabled')
          cy.getElementByDataTestId('clip_to_circle_lng').should('be.disabled')
          cy.getElementByDataTestId('clip_to_circle_radius').should('be.disabled')
        })

        describe('And the clip to circle checkbox is checked', () => {
          const invalidValues = [CH.string({ pool: ALPHA_POOL }), CH.bool()]
          const [validLat, validLng] = CH.coordinates().split(', ')
          const validRadius = CH.natural()

          beforeEach(() => cy.toggleClipToCircle())

          it('Then the clip to circle inputs should be enabled', () => {
            cy.getElementByDataTestId('clip_to_circle_lat').should('be.enabled')
            cy.getElementByDataTestId('clip_to_circle_lng').should('be.enabled')
            cy.getElementByDataTestId('clip_to_circle_radius').should('be.enabled')
          })

          it('Then the clip to circle inputs are required when enabled', () => {
            cy.assertTargetValidity('clip_to_circle_lat', false)
            cy.assertTargetValidity('clip_to_circle_lng', false)
            cy.assertTargetValidity('clip_to_circle_radius', false)
          })

          invalidValues.forEach((value) => {
            it(`Then the clip to circle is not saved when ${value} is entered in lat`, () => {
              cy.getElementByDataTestId('clip_to_circle_lat').focus().type(`${value}`)
                .getElementByDataTestId('clip_to_circle_lng').focus().type(validLng)
                .getElementByDataTestId('clip_to_circle_radius').focus().type(`${validRadius}`)
                .saveAdvanced()
                .assertTargetValidity('clip_to_circle_lat', false)
            })
            it(`Then the clip to circle is not saved when ${value} is entered in lng`, () => {
              cy.getElementByDataTestId('clip_to_circle_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_circle_lng').focus().type(`${value}`)
                .getElementByDataTestId('clip_to_circle_radius').focus().type(`${validRadius}`)
                .saveAdvanced()
                .assertTargetValidity('clip_to_circle_lng', false)
            })
            it(`Then the clip to circle is not saved when ${value} is entered in radius`, () => {
              cy.getElementByDataTestId('clip_to_circle_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_circle_lng').focus().type(validLng)
                .getElementByDataTestId('clip_to_circle_radius').focus().type(`${value}`)
                .saveAdvanced()
                .assertTargetValidity('clip_to_circle_radius', false)
            })
          })
  
          it('Then the clip to circle is saved when a value is entered and submitted', () => {
            cy.getElementByDataTestId('clip_to_circle_lat').focus().type(validLat)
            cy.getElementByDataTestId('clip_to_circle_lng').focus().type(validLng)
            cy.getElementByDataTestId('clip_to_circle_radius').focus().type(`${validRadius}`)
              .saveAdvanced()
              .toggleAdvancedSettings()
              .getElementByDataTestId('enable_clip_to_circle').should('be.checked')
              .getElementByDataTestId('clip_to_circle_lat').should('have.value', validLat)
              .getElementByDataTestId('clip_to_circle_lng').should('have.value', validLng)
              .getElementByDataTestId('clip_to_circle_radius').should('have.value', validRadius)
          })
        })

        it('Then the clip to bounding box checkbox should not be checked by default', () => {
          cy.getElementByDataTestId('enable_clip_to_bounding_box').should('not.be.checked')
          cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').should('be.disabled')
          cy.getElementByDataTestId('clip_to_bounding_box_sw_lng').should('be.disabled')
          cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').should('be.disabled')
          cy.getElementByDataTestId('clip_to_bounding_box_ne_lng').should('be.disabled')
        })

        describe('And the clip to bounding box checkbox is checked', () => {
          const invalidValues = [CH.string({ pool: ALPHA_POOL }), CH.bool()]
          const [validLat, validLng] = CH.coordinates().split(', ')

          beforeEach(() => cy.toggleClipToBoundingBox())

          it('Then the clip to bounding_box inputs should be enabled', () => {
            cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').should('be.enabled')
            cy.getElementByDataTestId('clip_to_bounding_box_sw_lng').should('be.enabled')
            cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').should('be.enabled')
            cy.getElementByDataTestId('clip_to_bounding_box_ne_lng').should('be.enabled')
          })

          it('Then the clip to bounding_box inputs are required when enabled', () => {
            cy.assertTargetValidity('clip_to_bounding_box_sw_lat', false)
            cy.assertTargetValidity('clip_to_bounding_box_sw_lng', false)
            cy.assertTargetValidity('clip_to_bounding_box_ne_lat', false)
            cy.assertTargetValidity('clip_to_bounding_box_ne_lng', false)
          })

          invalidValues.forEach((value) => {
            it(`Then the clip to bounding_box is not saved when ${value} is entered in sw lat`, () => {
              cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').focus().type(`${value}`)
                .getElementByDataTestId('clip_to_bounding_box_sw_lng').focus().type(validLng)
              cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_ne_lng').focus().type(validLng)
                .saveAdvanced()
                .assertTargetValidity('clip_to_bounding_box_sw_lat', false)
            })
            it(`Then the clip to bounding_box is not saved when ${value} is entered in sw lng`, () => {
              cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_sw_lng').focus().type(`${value}`)
              cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_ne_lng').focus().type(validLng)
                .saveAdvanced()
                .assertTargetValidity('clip_to_bounding_box_sw_lng', false)
            })
            it(`Then the clip to bounding_box is not saved when ${value} is entered in ne lat`, () => {
              cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_sw_lng').focus().type(validLng)
              cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').focus().type(`${value}`)
                .getElementByDataTestId('clip_to_bounding_box_ne_lng').focus().type(validLng)
                .saveAdvanced()
                .assertTargetValidity('clip_to_bounding_box_ne_lat', false)
            })
            it(`Then the clip to bounding_box is not saved when ${value} is entered in ne lng`, () => {
              cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_sw_lng').focus().type(validLng)
              cy.getElementByDataTestId('clip_to_bounding_box_ne_lat').focus().type(validLat)
                .getElementByDataTestId('clip_to_bounding_box_ne_lng').focus().type(`${value}`)
                .saveAdvanced()
                .assertTargetValidity('clip_to_bounding_box_ne_lng', false)
            })
          })
  
          it('Then the clip to bounding_box is saved when a value is entered and submitted', () => {
            cy.getElementByDataTestId('clip_to_bounding_box_sw_lat').focus().type(validLat)
              .getElementByDataTestId('clip_to_bounding_box_sw_lng').focus().type(validLng)
              .getElementByDataTestId('clip_to_bounding_box_ne_lat').focus().type(validLat)
              .getElementByDataTestId('clip_to_bounding_box_ne_lng').focus().type(validLng)
              .saveAdvanced()
              .toggleAdvancedSettings()
              .getElementByDataTestId('enable_clip_to_bounding_box').should('be.checked')
              .getElementByDataTestId('clip_to_bounding_box_sw_lat').should('have.value', validLat)
              .getElementByDataTestId('clip_to_bounding_box_sw_lng').should('have.value', validLng)
              .getElementByDataTestId('clip_to_bounding_box_ne_lat').should('have.value', validLat)
              .getElementByDataTestId('clip_to_bounding_box_ne_lng').should('have.value', validLng)
          })
        })

        it('Then the clip to polygon checkbox should not be checked by default', () => {
          cy.getElementByDataTestId('enable_clip_to_polygon').should('not.be.checked')
          cy.getElementByDataTestId('clip_to_polygon').should('be.disabled')
        })

        describe('And the clip to polygon checkbox is checked', () => {
          const invalidValues = [
            CH.string({ pool: ALPHA_POOL }),
            CH.coordinates(),
            CH.integer({ min: 10, max: 99 }),
            `${CH.coordinates()}; ${CH.coordinates()}`,
            CH.bool(),
          ]

          beforeEach(() => cy.toggleClipToPolygon())

          it('Then the clip to polygon input is enabled', () => {
            cy.getElementByDataTestId('clip_to_polygon').should('be.enabled')
          })

          it('Then the clip to polygon is required when checked', () => {
            cy.assertTargetValidity('clip_to_polygon', false)
          })

          invalidValues.forEach((value) => {
            it(`Then the clip to polygon is not saved when ${value} is entered`, () => {
              cy.getElementByDataTestId('clip_to_polygon').focus().type(`${value}`)
                .saveAdvanced()
                .getElementByDataTestId('clip_to_polygon').should('have.class', 'is-invalid')
            })
          })
  
          it('Then the clip to polygon is saved when a value is entered and submitted', () => {
            const value = `${CH.coordinates()}; ${CH.coordinates()}; ${CH.coordinates()}`
            cy.getElementByDataTestId('clip_to_polygon').focus().type(value)
              .saveAdvanced()
              .toggleAdvancedSettings()
              .getElementByDataTestId('enable_clip_to_polygon').should('be.checked')
              .getElementByDataTestId('clip_to_polygon').should('have.value', value)
          })
        })
      })
    })
  })
})
