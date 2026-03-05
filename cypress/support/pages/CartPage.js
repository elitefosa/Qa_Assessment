class CartPage {
  // Selectors
  get pageTitle() {
    return cy.get('.title')
  }

  get cartItems() {
    return cy.get('.cart_item')
  }

  get cartItemNames() {
    return cy.get('.inventory_item_name')
  }

  get cartItemPrices() {
    return cy.get('.inventory_item_price')
  }

  get cartQuantities() {
    return cy.get('.cart_quantity')
  }

  get continueShoppingButton() {
    return cy.get('[data-test="continue-shopping"]')
  }

  get checkoutButton() {
    return cy.get('[data-test="checkout"]')
  }

  get cartBadge() {
    return cy.get('.shopping_cart_badge')
  }

  getCartItemByName(productName) {
    return cy.contains('.cart_item', productName)
  }

  getRemoveButton(productName) {
    const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    return cy.get(`[data-test="remove-${productId}"]`)
  }

  // Actions
  visit() {
    cy.visit('/cart.html')
  }

  removeProduct(productName) {
    this.getRemoveButton(productName).click()
  }

  continueShopping() {
    this.continueShoppingButton.click()
  }

  proceedToCheckout() {
    this.checkoutButton.click()
  }

  // Assertions
  verifyOnCartPage() {
    cy.url().should('include', '/cart.html')
    this.pageTitle.should('have.text', 'Your Cart')
  }

  verifyCartItemCount(expectedCount) {
    if (expectedCount === 0) {
      this.cartItems.should('not.exist')
    } else {
      this.cartItems.should('have.length', expectedCount)
    }
  }

  verifyProductInCart(productName) {
    this.getCartItemByName(productName).should('be.visible')
  }

  verifyProductNotInCart(productName) {
    this.getCartItemByName(productName).should('not.exist')
  }

  verifyProductPrice(productName, expectedPrice) {
    this.getCartItemByName(productName)
      .find('.inventory_item_price')
      .should('have.text', expectedPrice)
  }

  verifyProductQuantity(productName, expectedQuantity) {
    this.getCartItemByName(productName)
      .find('.cart_quantity')
      .should('have.text', expectedQuantity.toString())
  }

  verifyCartBadgeCount(count) {
    if (count === 0) {
      this.cartBadge.should('not.exist')
    } else {
      this.cartBadge.should('have.text', count.toString())
    }
  }

  verifyCheckoutButtonEnabled() {
    this.checkoutButton.should('be.enabled')
  }

  verifyCheckoutButtonVisible() {
    this.checkoutButton.should('be.visible')
  }
}

module.exports = new CartPage()