const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')

describe('Authentication Tests', () => {
  beforeEach(() => {
    LoginPage.visit()
  })

  describe('Positive Login Scenarios', () => {
    it('should successfully login with standard_user', () => {
      // Arrange
      const username = 'standard_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyProductCount(6)
      cy.url().should('include', '/inventory.html')
    })

    it('should successfully login with problem_user', () => {
      // Arrange
      const username = 'problem_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })

    it('should successfully login with performance_glitch_user', () => {
      // Arrange
      const username = 'performance_glitch_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })

    it('should successfully login with error_user', () => {
      // Arrange
      const username = 'error_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })

    it('should successfully login with visual_user', () => {
      // Arrange
      const username = 'visual_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })
  })

  describe('Negative Login Scenarios', () => {
    it('should show error for locked_out_user', () => {
      // Arrange
      const username = 'locked_out_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Sorry, this user has been locked out.')
      LoginPage.verifyOnLoginPage()
      cy.url().should('not.include', '/inventory.html')
    })

    it('should show error for invalid username', () => {
      // Arrange
      const username = 'invalid_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for invalid password', () => {
      // Arrange
      const username = 'standard_user'
      const password = 'wrong_password'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for empty username', () => {
      // Arrange
      const password = 'secret_sauce'

      // Act
      LoginPage.enterPassword(password)
      LoginPage.clickLogin()

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username is required')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for empty password', () => {
      // Arrange
      const username = 'standard_user'

      // Act
      LoginPage.enterUsername(username)
      LoginPage.clickLogin()

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Password is required')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for both empty fields', () => {
      // Act
      LoginPage.clickLogin()

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username is required')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for username with spaces only', () => {
      // Arrange
      const username = '   '
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should show error for password with spaces only', () => {
      // Arrange
      const username = 'standard_user'
      const password = '   '

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })
  })

  describe('Edge Cases and Security Tests', () => {
    it('should handle SQL injection attempt in username', () => {
      // Arrange
      const username = "' OR '1'='1"
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle SQL injection attempt in password', () => {
      // Arrange
      const username = 'standard_user'
      const password = "' OR '1'='1"

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle XSS attempt in username', () => {
      // Arrange
      const username = '<script>alert("XSS")</script>'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
      // Verify no alert was triggered
      cy.on('window:alert', () => {
        throw new Error('Alert should not be triggered')
      })
    })

    it('should handle XSS attempt in password', () => {
      // Arrange
      const username = 'standard_user'
      const password = '<script>alert("XSS")</script>'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle very long username', () => {
      // Arrange
      const username = 'a'.repeat(1000)
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle very long password', () => {
      // Arrange
      const username = 'standard_user'
      const password = 'a'.repeat(1000)

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle special characters in username', () => {
      // Arrange
      const username = '!@#$%^&*()_+-=[]{}|;:,.<>?'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle special characters in password', () => {
      // Arrange
      const username = 'standard_user'
      const password = '!@#$%^&*()_+-=[]{}|;:,.<>?'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle unicode characters in username', () => {
      // Arrange
      const username = '用户名测试'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle case sensitivity in username', () => {
      // Arrange
      const username = 'STANDARD_USER'
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle leading/trailing spaces in username', () => {
      // Arrange
      const username = '  standard_user  '
      const password = 'secret_sauce'

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle leading/trailing spaces in password', () => {
      // Arrange
      const username = 'standard_user'
      const password = '  secret_sauce  '

      // Act
      LoginPage.login(username, password)

      // Assert
      LoginPage.verifyErrorMessage('Epic sadface: Username and password do not match any user in this service')
      LoginPage.verifyOnLoginPage()
    })
  })

  describe('UI and Interaction Tests', () => {
    it('should have login button enabled by default', () => {
      // Assert
      LoginPage.verifyLoginButtonEnabled()
    })

    it('should display username and password fields', () => {
      // Assert
      LoginPage.usernameInput.should('be.visible')
      LoginPage.passwordInput.should('be.visible')
      LoginPage.loginButton.should('be.visible')
    })

    it('should have correct placeholder text', () => {
      // Assert
      LoginPage.usernameInput.should('have.attr', 'placeholder', 'Username')
      LoginPage.passwordInput.should('have.attr', 'placeholder', 'Password')
    })

    it('should mask password input', () => {
      // Arrange
      const password = 'secret_sauce'

      // Act
      LoginPage.enterPassword(password)

      // Assert
      LoginPage.passwordInput.should('have.attr', 'type', 'password')
    })

    it('should allow clearing error message', () => {
      // Arrange
      LoginPage.clickLogin()

      // Act
      LoginPage.verifyErrorMessage('Epic sadface: Username is required')
      LoginPage.errorButton.should('be.visible')
      LoginPage.errorButton.click()

      // Assert
      LoginPage.errorMessage.should('not.exist')
    })

    it('should allow login with Enter key on username field', () => {
      // Arrange
      const username = 'standard_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.enterUsername(username)
      LoginPage.enterPassword(password)
      LoginPage.usernameInput.type('{enter}')

      // Assert
      ProductsPage.verifyOnProductsPage()
    })

    it('should allow login with Enter key on password field', () => {
      // Arrange
      const username = 'standard_user'
      const password = 'secret_sauce'

      // Act
      LoginPage.enterUsername(username)
      LoginPage.passwordInput.clear().type(password + '{enter}')

      // Assert
      ProductsPage.verifyOnProductsPage()
    })
  })
})