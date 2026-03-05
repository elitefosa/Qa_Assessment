class CheckoutPage {
  // Selectors - Step One (Information)
  get pageTitle() {
    return cy.get('.title')
  }

  get firstNameInput() {
    return cy.get('[data-test="firstName"]')
  }

  get lastNameInput() {
    return cy.get('[data-test="lastName"]')
  }

  get postalCodeInput() {
    return cy.get('[data-test="postalCode"]')
  }

  get continueButton() {
    return cy.get('[data-test="continue"]')
  }

  get cancelButton() {
    return cy.get('[data-test="cancel"]')
  }

  get errorMessage() {
    return cy.get('[data-test="error"]')
  }

  // Selectors - Step Two (Overview)
  get cartItems() {
    return cy.get('.cart_item')
  }

  get paymentInfo() {
    return cy.get('[data-test="payment-info-value"]')
  }

  get shippingInfo() {
    return cy.get('[data-test="shipping-info-value"]')
  }

  get subtotalLabel() {
    return cy.get('.summary_subtotal_label')
  }

  get taxLabel() {
    return cy.get('.summary_tax_label')
  }

  get totalLabel() {
    return cy.get('.summary_total_label')
  }

  get finishButton() {
    return cy.get('[data-test="finish"]')
  }

  // Selectors - Complete
  get completeHeader() {
    return cy.get('.complete-header')
  }

  get completeText() {
    return cy.get('.complete-text')
  }

  get backHomeButton() {
    return cy.get('[data-test="back-to-products"]')
  }

  // Actions - Step One
  visitStepOne() {
    cy.visit('/checkout-step-one.html')
  }

  fillCheckoutInformation(firstName, lastName, postalCode) {
    if (firstName) this.firstNameInput.clear().type(firstName)
    if (lastName) this.lastNameInput.clear().type(lastName)
    if (postalCode) this.postalCodeInput.clear().type(postalCode)
  }

  clickContinue() {
    this.continueButton.click()
  }

  clickCancel() {
    this.cancelButton.click()
  }

  // Actions - Step Two
  visitStepTwo() {
    cy.visit('/checkout-step-two.html')
  }

  clickFinish() {
    this.finishButton.click()
  }

  // Actions - Complete
  visitComplete() {
    cy.visit('/checkout-complete.html')
  }

  clickBackHome() {
    this.backHomeButton.click()
  }

  // Assertions - Step One
  verifyOnCheckoutStepOne() {
    cy.url().should('include', '/checkout-step-one.html')
    this.pageTitle.should('have.text', 'Checkout: Your Information')
  }

  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('be.visible')
    this.errorMessage.should('contain', expectedMessage)
  }

  verifyContinueButtonEnabled() {
    this.continueButton.should('be.enabled')
  }

  // Assertions - Step Two
  verifyOnCheckoutStepTwo() {
    cy.url().should('include', '/checkout-step-two.html')
    this.pageTitle.should('have.text', 'Checkout: Overview')
  }

  verifyPaymentInfo(expectedInfo) {
    this.paymentInfo.should('contain', expectedInfo)
  }

  verifyShippingInfo(expectedInfo) {
    this.shippingInfo.should('contain', expectedInfo)
  }

  verifySubtotal(expectedAmount) {
    this.subtotalLabel.should('contain', expectedAmount)
  }

  verifyTax(expectedAmount) {
    this.taxLabel.should('contain', expectedAmount)
  }

  verifyTotal(expectedAmount) {
    this.totalLabel.should('contain', expectedAmount)
  }

  verifyProductInCheckout(productName) {
    cy.contains('.cart_item', productName).should('be.visible')
  }

  verifyCheckoutItemCount(expectedCount) {
    this.cartItems.should('have.length', expectedCount)
  }

  // Assertions - Complete
  verifyOnCheckoutComplete() {
    cy.url().should('include', '/checkout-complete.html')
    this.pageTitle.should('have.text', 'Checkout: Complete!')
  }

  verifyOrderComplete() {
    this.completeHeader.should('have.text', 'Thank you for your order!')
    this.completeText.should('be.visible')
  }

  verifyBackHomeButtonVisible() {
    this.backHomeButton.should('be.visible')
  }
}

module.exports = new CheckoutPage()