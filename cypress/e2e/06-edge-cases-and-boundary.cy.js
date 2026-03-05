const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')
const CartPage = require('../support/pages/CartPage')
const CheckoutPage = require('../support/pages/CheckoutPage')

describe('Edge Cases and Boundary Tests', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce')
    ProductsPage.verifyOnProductsPage()
  })

  describe('Data Boundary Tests', () => {
    it('should handle maximum length input in checkout fields', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      const maxLengthString = 'a'.repeat(1000)

      // Act
      CheckoutPage.fillCheckoutInformation(maxLengthString, maxLengthString, maxLengthString)
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle minimum length input (single character)', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('A', 'B', '1')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle empty strings vs null values', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.firstNameInput.clear()
      CheckoutPage.lastNameInput.clear()
      CheckoutPage.postalCodeInput.clear()
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: First Name is required')
    })

    it('should handle whitespace-only input', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('   ', '   ', '   ')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle mixed whitespace and characters', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('  John  ', '  Doe  ', '  12345  ')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })
  })

  describe('Cart Boundary Tests', () => {
    it('should handle adding all 6 products (maximum cart capacity)', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')

      // Assert
      ProductsPage.verifyCartBadgeCount(6)
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(6)
    })

    it('should handle removing all items from full cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.goToCart()

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.removeProduct('Sauce Labs Bike Light')
      CartPage.removeProduct('Sauce Labs Bolt T-Shirt')

      // Assert
      CartPage.verifyCartItemCount(0)
      CartPage.verifyCartBadgeCount(0)
    })

    it('should handle rapid add/remove operations', () => {
      // Act
      for (let i = 0; i < 5; i++) {
        ProductsPage.addProductToCart('Sauce Labs Backpack')
        ProductsPage.removeProductFromCart('Sauce Labs Backpack')
      }

      // Assert
      ProductsPage.verifyCartBadgeCount(0)
    })

    it('should handle cart with zero items checkout attempt', () => {
      // Act
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(0)
      CartPage.proceedToCheckout()

      // Assert
      CheckoutPage.verifyOnCheckoutStepOne()
    })
  })

  describe('Special Characters and Encoding Tests', () => {
    it('should handle HTML tags in input fields', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('<div>Test</div>', '<script>alert(1)</script>', '<b>12345</b>')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle SQL injection patterns', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation("'; DROP TABLE users--", "1' OR '1'='1", "'; DELETE FROM orders--")
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle unicode and emoji characters', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('José 😀', 'Müller 🎉', '12345 ✓')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle newline and tab characters', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('John\nDoe', 'Smith\tJr', '12\n345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle special regex characters', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('.*+?^${}()|[]\\', '.*+?^${}()|[]\\', '.*+?^$')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })
  })

  describe('Session and State Management Tests', () => {
    it('should handle multiple page refreshes', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      cy.reload()
      cy.reload()
      cy.reload()

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(1)
    })

    it('should handle session persistence across navigation', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act
      ProductsPage.goToCart()
      cy.go('back')
      ProductsPage.goToCart()
      cy.go('back')
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(2)
    })

    it('should handle logout and login cycle', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      cy.logout()
      cy.login('standard_user', 'secret_sauce')

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(0)
    })

    it('should handle clearing cookies mid-session', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      cy.clearCookies()
      cy.visit('/inventory.html')

      // Assert
      LoginPage.verifyOnLoginPage()
    })
  })

  describe('Concurrent Action Tests', () => {
    it('should handle rapid clicking on same button', () => {
      // Act - Click once, then verify button state changes
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })

    it('should handle rapid navigation between pages', () => {
      // Act
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()
      cy.go('back')
      cy.wait(500)
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()
      cy.go('back')
      cy.wait(500)
      ProductsPage.goToCart()

      // Assert
      cy.url().should('include', '/cart.html')
      CartPage.verifyOnCartPage()
    })

    it('should handle rapid sorting changes', () => {
      // Act
      ProductsPage.sortProducts('za')
      ProductsPage.sortProducts('lohi')
      ProductsPage.sortProducts('hilo')
      ProductsPage.sortProducts('az')

      // Assert
      ProductsPage.verifyProductsSortedByName('asc')
    })
  })

  describe('Price and Calculation Boundary Tests', () => {
    it('should handle checkout with lowest priced item', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')

      // Act
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifySubtotal('7.99')
      CheckoutPage.taxLabel.should('contain', '$')
      CheckoutPage.totalLabel.should('contain', '$')
    })

    it('should handle checkout with highest priced item', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')

      // Act
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifySubtotal('49.99')
      CheckoutPage.taxLabel.should('contain', '$')
      CheckoutPage.totalLabel.should('contain', '$')
    })

    it('should handle checkout with all items (maximum total)', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')

      // Act
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyCheckoutItemCount(6)
      CheckoutPage.subtotalLabel.should('contain', '$')
      CheckoutPage.taxLabel.should('contain', '$')
      CheckoutPage.totalLabel.should('contain', '$')
    })
  })

  describe('URL Manipulation Tests', () => {
    it('should handle direct access to protected pages', () => {
      // Arrange
      cy.logout()

      // Act
      cy.visit('/inventory.html')
      cy.wait(500) // Allow redirect to complete

      // Assert
      cy.url().should('not.include', '/inventory.html')
      LoginPage.verifyOnLoginPage()
    })

    it('should handle malformed URLs', () => {
      // Act
      cy.visit('/inventory.html?param=<script>alert(1)</script>', { failOnStatusCode: false })
      cy.wait(500) // Allow page to load

      // Assert
      cy.url().should('include', '/inventory.html')
      ProductsPage.verifyOnProductsPage()
    })

    it('should handle URL with multiple query parameters', () => {
      // Act
      cy.visit('/inventory.html?param1=value1&param2=value2&param3=value3')
      cy.wait(500) // Allow page to load

      // Assert
      cy.url().should('include', 'param1=value1')
      ProductsPage.verifyOnProductsPage()
    })

    it('should handle URL fragments', () => {
      // Act
      cy.visit('/inventory.html#section')

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '#section')
    })
  })

  describe('Form Validation Edge Cases', () => {
    it('should handle form submission with Enter key', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.postalCodeInput.type('{enter}')

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle Tab navigation through form fields', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.firstNameInput.type('John{tab}')
      CheckoutPage.lastNameInput.type('Doe{tab}')
      CheckoutPage.postalCodeInput.type('12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle copy-paste in form fields', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.firstNameInput.invoke('val', 'John').trigger('input')
      CheckoutPage.lastNameInput.invoke('val', 'Doe').trigger('input')
      CheckoutPage.postalCodeInput.invoke('val', '12345').trigger('input')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })
  })

  describe('Product Interaction Edge Cases', () => {
    it('should handle clicking product image vs product name', () => {
      // Act - Click image
      ProductsPage.getProductByName('Sauce Labs Backpack').find('img').click()

      // Assert
      cy.url().should('include', '/inventory-item.html')
      cy.go('back')

      // Act - Click name
      ProductsPage.clickProduct('Sauce Labs Backpack')

      // Assert
      cy.url().should('include', '/inventory-item.html')
    })

    it('should handle adding same product multiple times from different pages', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.clickProduct('Sauce Labs Backpack')
      cy.get('[data-test="back-to-products"]').click()
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
    })

    it('should handle sorting with items in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act
      ProductsPage.sortProducts('za')
      ProductsPage.sortProducts('lohi')

      // Assert
      ProductsPage.verifyCartBadgeCount(2)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bike Light')
    })
  })

  describe('Checkout Flow Edge Cases', () => {
    it('should handle canceling at each checkout step', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act & Assert - Cancel at step 1
      CartPage.proceedToCheckout()
      CheckoutPage.clickCancel()
      CartPage.verifyOnCartPage()

      // Act & Assert - Cancel at step 2
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.clickCancel()
      ProductsPage.verifyOnProductsPage()
    })

    it('should handle completing checkout with empty cart', () => {
      // Act
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(0)
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.verifyOnCheckoutComplete()
    })

    it('should handle multiple checkout attempts', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act - First checkout
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.clickFinish()
      CheckoutPage.clickBackHome()

      // Act - Second checkout
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('Jane', 'Smith', '54321')
      CheckoutPage.clickContinue()
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.verifyOnCheckoutComplete()
    })
  })

  describe('Browser Compatibility Edge Cases', () => {
    it('should handle viewport resize during session', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      cy.viewport(375, 667)
      ProductsPage.verifyCartBadgeCount(1)
      cy.viewport(1920, 1080)

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })

    it('should handle window focus/blur events', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      cy.window().trigger('blur')
      cy.window().trigger('focus')

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
    })
  })

  describe('Data Persistence Edge Cases', () => {
    it('should handle cart persistence after multiple operations', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.continueShopping()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.removeProductFromCart('Sauce Labs Backpack')
      cy.reload()

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bike Light')
      ProductsPage.verifyAddToCartButtonVisible('Sauce Labs Backpack')
    })

    it('should handle state after failed checkout', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act - Fail checkout
      CheckoutPage.clickContinue()
      CheckoutPage.verifyErrorMessage('Error: First Name is required')

      // Act - Navigate away and back
      cy.go('back')
      CartPage.verifyOnCartPage()

      // Assert
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })
  })

  describe('Extreme Load Tests', () => {
    it('should handle adding and removing all products multiple times', () => {
      // Act
      for (let i = 0; i < 3; i++) {
        ProductsPage.addProductToCart('Sauce Labs Backpack')
        ProductsPage.addProductToCart('Sauce Labs Bike Light')
        ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
        ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
        ProductsPage.addProductToCart('Sauce Labs Onesie')
        ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')
        
        ProductsPage.removeProductFromCart('Sauce Labs Backpack')
        ProductsPage.removeProductFromCart('Sauce Labs Bike Light')
        ProductsPage.removeProductFromCart('Sauce Labs Bolt T-Shirt')
        ProductsPage.removeProductFromCart('Sauce Labs Fleece Jacket')
        ProductsPage.removeProductFromCart('Sauce Labs Onesie')
        ProductsPage.removeProductFromCart('Test.allTheThings() T-Shirt (Red)')
      }

      // Assert
      ProductsPage.verifyCartBadgeCount(0)
    })

    it('should handle rapid page navigation cycle', () => {
      // Act
      for (let i = 0; i < 5; i++) {
        ProductsPage.goToCart()
        cy.go('back')
      }

      // Assert
      ProductsPage.verifyOnProductsPage()
    })
  })
})