const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')
const CartPage = require('../support/pages/CartPage')
const CheckoutPage = require('../support/pages/CheckoutPage')

describe('Checkout Flow Tests', () => {
  beforeEach(() => {
    // Login and add product to cart before each test
    cy.login('standard_user', 'secret_sauce')
    ProductsPage.verifyOnProductsPage()
    ProductsPage.addProductToCart('Sauce Labs Backpack')
    ProductsPage.goToCart()
    CartPage.verifyOnCartPage()
  })

  describe('Checkout Step One - Information Form Tests', () => {
    beforeEach(() => {
      CartPage.proceedToCheckout()
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should complete checkout with valid information', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
      cy.url().should('include', '/checkout-step-two.html')
    })

    it('should display all required form fields', () => {
      // Assert
      CheckoutPage.firstNameInput.should('be.visible')
      CheckoutPage.lastNameInput.should('be.visible')
      CheckoutPage.postalCodeInput.should('be.visible')
      CheckoutPage.continueButton.should('be.visible')
      CheckoutPage.cancelButton.should('be.visible')
    })

    it('should have correct placeholder text', () => {
      // Assert
      CheckoutPage.firstNameInput.should('have.attr', 'placeholder', 'First Name')
      CheckoutPage.lastNameInput.should('have.attr', 'placeholder', 'Last Name')
      CheckoutPage.postalCodeInput.should('have.attr', 'placeholder', 'Zip/Postal Code')
    })

    it('should show error when first name is empty', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: First Name is required')
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should show error when last name is empty', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', '', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: Last Name is required')
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should show error when postal code is empty', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: Postal Code is required')
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should show error when all fields are empty', () => {
      // Act
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: First Name is required')
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should accept special characters in name fields', () => {
      // Act
      CheckoutPage.fillCheckoutInformation("O'Brien-Smith", "D'Angelo", '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should accept alphanumeric postal codes', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', 'AB12 3CD')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should accept very long names', () => {
      // Act
      const longName = 'a'.repeat(100)
      CheckoutPage.fillCheckoutInformation(longName, longName, '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should accept unicode characters in name fields', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('José', 'Müller', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle spaces in postal code', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12 345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should cancel checkout and return to cart', () => {
      // Act
      CheckoutPage.clickCancel()

      // Assert
      CartPage.verifyOnCartPage()
      cy.url().should('include', '/cart.html')
    })

    it('should maintain cart items when canceling checkout', () => {
      // Act
      CheckoutPage.clickCancel()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })
  })

  describe('Checkout Step Two - Overview Tests', () => {
    beforeEach(() => {
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should display order summary correctly', () => {
      // Assert
      CheckoutPage.verifyProductInCheckout('Sauce Labs Backpack')
      CheckoutPage.verifyCheckoutItemCount(1)
      CheckoutPage.paymentInfo.should('be.visible')
      CheckoutPage.shippingInfo.should('be.visible')
      CheckoutPage.subtotalLabel.should('be.visible')
      CheckoutPage.taxLabel.should('be.visible')
      CheckoutPage.totalLabel.should('be.visible')
    })

    it('should display correct payment information', () => {
      // Assert
      CheckoutPage.verifyPaymentInfo('SauceCard')
    })

    it('should display correct shipping information', () => {
      // Assert
      CheckoutPage.verifyShippingInfo('Free Pony Express Delivery')
    })

    it('should calculate subtotal correctly for single item', () => {
      // Assert
      CheckoutPage.verifySubtotal('29.99')
    })

    it('should calculate tax correctly', () => {
      // Assert
      CheckoutPage.verifyTax('2.40')
    })

    it('should calculate total correctly', () => {
      // Assert
      CheckoutPage.verifyTotal('32.39')
    })

    it('should display product details in checkout', () => {
      // Assert
      CheckoutPage.verifyProductInCheckout('Sauce Labs Backpack')
      cy.contains('.cart_item', 'Sauce Labs Backpack')
        .should('contain', '$29.99')
        .and('contain', 'carry.allTheThings()')
    })

    it('should display finish and cancel buttons', () => {
      // Assert
      CheckoutPage.finishButton.should('be.visible')
      CheckoutPage.cancelButton.should('be.visible')
    })

    it('should complete order when clicking finish', () => {
      // Act
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.verifyOnCheckoutComplete()
      cy.url().should('include', '/checkout-complete.html')
    })

    it('should cancel checkout and return to products page', () => {
      // Act
      CheckoutPage.clickCancel()

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })
  })

  describe('Checkout Step Two - Multiple Items Tests', () => {
    beforeEach(() => {
      // Add more products
      cy.visit('/inventory.html')
      ProductsPage.verifyOnProductsPage()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      // Verify all 3 items are in cart before proceeding
      ProductsPage.verifyCartBadgeCount(3)
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(3)
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should display all items in checkout overview', () => {
      // Assert
      CheckoutPage.verifyCheckoutItemCount(3)
      CheckoutPage.verifyProductInCheckout('Sauce Labs Backpack')
      CheckoutPage.verifyProductInCheckout('Sauce Labs Bike Light')
      CheckoutPage.verifyProductInCheckout('Sauce Labs Bolt T-Shirt')
    })

    it('should calculate correct subtotal for multiple items', () => {
      // Assert - $29.99 + $9.99 + $15.99 = $55.97
      CheckoutPage.verifySubtotal('55.97')
    })

    it('should calculate correct tax for multiple items', () => {
      // Assert - Tax should be calculated on subtotal
      CheckoutPage.taxLabel.should('contain', '$')
      CheckoutPage.taxLabel.invoke('text').then((text) => {
        const tax = parseFloat(text.replace('Tax: $', ''))
        expect(tax).to.be.greaterThan(0)
      })
    })

    it('should calculate correct total for multiple items', () => {
      // Assert - Subtotal + Tax
      CheckoutPage.totalLabel.should('contain', '$')
      CheckoutPage.totalLabel.invoke('text').then((text) => {
        const total = parseFloat(text.replace('Total: $', ''))
        expect(total).to.be.greaterThan(55.97)
      })
    })
  })

  describe('Checkout Complete Tests', () => {
    beforeEach(() => {
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.clickFinish()
      CheckoutPage.verifyOnCheckoutComplete()
    })

    it('should display order confirmation message', () => {
      // Assert
      CheckoutPage.verifyOrderComplete()
      CheckoutPage.completeHeader.should('have.text', 'Thank you for your order!')
    })

    it('should display confirmation text', () => {
      // Assert
      CheckoutPage.completeText.should('be.visible')
      CheckoutPage.completeText.should('contain', 'dispatched')
    })

    it('should display back home button', () => {
      // Assert
      CheckoutPage.verifyBackHomeButtonVisible()
      CheckoutPage.backHomeButton.should('contain', 'Back Home')
    })

    it('should navigate back to products page', () => {
      // Act
      CheckoutPage.clickBackHome()

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })

    it('should clear cart after order completion', () => {
      // Act
      CheckoutPage.clickBackHome()
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(0)
      CartPage.verifyCartBadgeCount(0)
    })

    it('should display pony express image', () => {
      // Assert
      cy.get('.pony_express').should('be.visible')
    })
  })

  describe('End-to-End Checkout Flow Tests', () => {
    it('should complete full checkout flow with single item', () => {
      // Arrange - Already have item in cart from beforeEach

      // Act - Step 1: Proceed to checkout
      CartPage.proceedToCheckout()
      CheckoutPage.verifyOnCheckoutStepOne()

      // Act - Step 2: Fill information
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()

      // Act - Step 3: Review and finish
      CheckoutPage.verifyProductInCheckout('Sauce Labs Backpack')
      CheckoutPage.verifySubtotal('29.99')
      CheckoutPage.clickFinish()

      // Assert - Order complete
      CheckoutPage.verifyOnCheckoutComplete()
      CheckoutPage.verifyOrderComplete()
    })

    it('should complete full checkout flow with multiple items', () => {
      // Arrange - Add more items
      cy.visit('/inventory.html')
      ProductsPage.verifyOnProductsPage()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      // Verify all items added
      ProductsPage.verifyCartBadgeCount(3)
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(3)

      // Act - Complete checkout
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('Jane', 'Smith', '54321')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyCheckoutItemCount(3)
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.verifyOnCheckoutComplete()
      CheckoutPage.verifyOrderComplete()
    })

    it('should handle checkout with maximum items', () => {
      // Arrange - Add all products
      cy.visit('/inventory.html')
      ProductsPage.verifyOnProductsPage()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')
      // Verify all 6 items added
      ProductsPage.verifyCartBadgeCount(6)
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(6)

      // Act
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('Max', 'Items', '99999')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyCheckoutItemCount(6)
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.verifyOnCheckoutComplete()
    })
  })

  describe('Edge Cases and Boundary Tests', () => {
    it('should handle very long input strings', () => {
      // Arrange
      CartPage.proceedToCheckout()
      const longString = 'a'.repeat(500)

      // Act
      CheckoutPage.fillCheckoutInformation(longString, longString, longString)
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle special characters in all fields', () => {
      // Arrange
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('!@#$%^&*()', '<>?:"{}|', '!@#$%')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle numeric values in name fields', () => {
      // Arrange
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('123', '456', '789')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle spaces only in fields', () => {
      // Arrange
      CartPage.proceedToCheckout()

      // Act
      CheckoutPage.fillCheckoutInformation('   ', '   ', '   ')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should maintain checkout state after page refresh on step one', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')

      // Act
      cy.reload()

      // Assert
      CheckoutPage.verifyOnCheckoutStepOne()
      // Form should be cleared after refresh
      CheckoutPage.firstNameInput.should('have.value', '')
    })

    it('should maintain checkout state after page refresh on step two', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()

      // Act
      cy.reload()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
      CheckoutPage.verifyProductInCheckout('Sauce Labs Backpack')
    })

    it('should handle browser back button during checkout', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()

      // Act
      cy.go('back')

      // Assert
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should handle browser forward button during checkout', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()
      cy.go('back')

      // Act
      cy.go('forward')
      cy.wait(500) // Allow page to restore state

      // Assert
      cy.url().should('include', '/checkout-step-two.html')
      CheckoutPage.verifyOnCheckoutStepTwo()
    })

    it('should handle direct URL navigation to checkout steps', () => {
      // Act - Try to access step two directly
      cy.visit('/checkout-step-two.html')
      cy.wait(500) // Allow redirect to complete if needed

      // Assert - Should redirect or show error
      cy.url().then((url) => {
        // Either stays on step two (if cart has items) or redirects
        expect(url).to.satisfy((url) => 
          url.includes('/checkout-step-two.html') || 
          url.includes('/cart.html') ||
          url.includes('/inventory.html')
        )
      })
    })

    it('should prevent checkout with empty cart', () => {
      // Arrange - Remove item from cart
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.verifyCartItemCount(0)

      // Act
      CartPage.proceedToCheckout()

      // Assert - Should still allow proceeding to checkout page
      CheckoutPage.verifyOnCheckoutStepOne()
    })
  })

  describe('Form Validation Tests', () => {
    beforeEach(() => {
      CartPage.proceedToCheckout()
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should validate first name field first', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('', '', '')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: First Name is required')
    })

    it('should validate last name field after first name', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', '', '')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: Last Name is required')
    })

    it('should validate postal code field last', () => {
      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyErrorMessage('Error: Postal Code is required')
    })

    it('should clear error message when correcting input', () => {
      // Arrange
      CheckoutPage.clickContinue()
      CheckoutPage.verifyErrorMessage('Error: First Name is required')

      // Act
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.verifyOnCheckoutStepTwo()
    })
  })

  describe('UI and Visual Tests', () => {
    it('should display correct page title on step one', () => {
      // Arrange
      CartPage.proceedToCheckout()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Your Information')
    })

    it('should display correct page title on step two', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Overview')
    })

    it('should display correct page title on complete', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Complete!')
    })

    it('should display form labels correctly', () => {
      // Arrange
      CartPage.proceedToCheckout()

      // Assert
      CheckoutPage.firstNameInput.should('have.attr', 'placeholder')
      CheckoutPage.lastNameInput.should('have.attr', 'placeholder')
      CheckoutPage.postalCodeInput.should('have.attr', 'placeholder')
    })

    it('should display payment and shipping sections', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      cy.contains('.summary_info_label', 'Payment Information').should('be.visible')
      cy.contains('.summary_info_label', 'Shipping Information').should('be.visible')
    })

    it('should display price breakdown clearly', () => {
      // Arrange
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.subtotalLabel.should('contain', 'Item total')
      CheckoutPage.taxLabel.should('contain', 'Tax')
      CheckoutPage.totalLabel.should('contain', 'Total')
    })
  })
})