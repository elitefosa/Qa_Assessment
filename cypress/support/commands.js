// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/**
 * Custom command to login to SauceDemo
 * @param {string} username - Username to login with
 * @param {string} password - Password to login with
 */
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/')
  cy.get('[data-test="username"]').clear().type(username)
  cy.get('[data-test="password"]').clear().type(password)
  cy.get('[data-test="login-button"]').click()
})

/**
 * Custom command to add product to cart by name
 * @param {string} productName - Name of the product to add
 */
Cypress.Commands.add('addProductToCart', (productName) => {
  const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  cy.get(`[data-test="add-to-cart-${productId}"]`).click()
})

/**
 * Custom command to remove product from cart by name
 * @param {string} productName - Name of the product to remove
 */
Cypress.Commands.add('removeProductFromCart', (productName) => {
  const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
  cy.get(`[data-test="remove-${productId}"]`).click()
})

/**
 * Custom command to verify cart badge count
 * @param {number} count - Expected count in cart badge
 */
Cypress.Commands.add('verifyCartBadge', (count) => {
  if (count === 0) {
    cy.get('.shopping_cart_badge').should('not.exist')
  } else {
    cy.get('.shopping_cart_badge').should('have.text', count.toString())
  }
})

/**
 * Custom command to fill checkout information
 * @param {string} firstName - First name
 * @param {string} lastName - Last name
 * @param {string} zipCode - Zip/Postal code
 */
Cypress.Commands.add('fillCheckoutInfo', (firstName, lastName, zipCode) => {
  cy.get('[data-test="firstName"]').clear().type(firstName)
  cy.get('[data-test="lastName"]').clear().type(lastName)
  cy.get('[data-test="postalCode"]').clear().type(zipCode)
})

/**
 * Custom command to verify product is in cart
 * @param {string} productName - Name of the product to verify
 */
Cypress.Commands.add('verifyProductInCart', (productName) => {
  cy.get('.cart_item').should('contain', productName)
})

/**
 * Custom command to logout
 */
Cypress.Commands.add('logout', () => {
  cy.get('#react-burger-menu-btn').click()
  cy.get('#logout_sidebar_link').click()
})