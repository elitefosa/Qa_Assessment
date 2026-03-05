class LoginPage {
  // Selectors
  get usernameInput() {
    return cy.get('[data-test="username"]')
  }

  get passwordInput() {
    return cy.get('[data-test="password"]')
  }

  get loginButton() {
    return cy.get('[data-test="login-button"]')
  }

  get errorMessage() {
    return cy.get('[data-test="error"]')
  }

  get errorButton() {
    return cy.get('.error-button')
  }

  // Actions
  visit() {
    cy.visit('/')
  }

  enterUsername(username) {
    this.usernameInput.clear().type(username)
  }

  enterPassword(password) {
    this.passwordInput.clear().type(password)
  }

  clickLogin() {
    this.loginButton.click()
  }

  login(username, password) {
    this.enterUsername(username)
    this.enterPassword(password)
    this.clickLogin()
  }

  // Assertions
  verifyErrorMessage(expectedMessage) {
    this.errorMessage.should('be.visible')
    this.errorMessage.should('contain', expectedMessage)
  }

  verifyLoginButtonEnabled() {
    this.loginButton.should('be.enabled')
  }

  verifyLoginButtonDisabled() {
    this.loginButton.should('be.disabled')
  }

  verifyOnLoginPage() {
    cy.url().should('include', 'saucedemo.com')
    this.loginButton.should('be.visible')
  }
}

module.exports = new LoginPage()