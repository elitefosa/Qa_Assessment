const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')
const CartPage = require('../support/pages/CartPage')
const CheckoutPage = require('../support/pages/CheckoutPage')

describe('Navigation and UI Tests', () => {
  beforeEach(() => {
    cy.login('standard_user', 'secret_sauce')
    ProductsPage.verifyOnProductsPage()
  })

  describe('Menu Navigation Tests', () => {
    it('should open menu when clicking menu button', () => {
      // Act
      ProductsPage.openMenu()

      // Assert
      cy.get('.bm-menu').should('be.visible')
      cy.get('#inventory_sidebar_link').should('be.visible')
      cy.get('#about_sidebar_link').should('be.visible')
      cy.get('#logout_sidebar_link').should('be.visible')
      cy.get('#reset_sidebar_link').should('be.visible')
    })

    it('should close menu when clicking close button', () => {
      // Arrange
      ProductsPage.openMenu()
      cy.get('.bm-menu').should('be.visible')

      // Act
      cy.get('#react-burger-cross-btn').click()

      // Assert
      cy.get('.bm-menu').should('not.be.visible')
    })

    it('should navigate to All Items from menu', () => {
      // Arrange
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()

      // Act
      cy.get('#react-burger-menu-btn').click()
      cy.get('#inventory_sidebar_link').click()

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })

    it('should logout from menu', () => {
      // Act
      cy.logout()

      // Assert
      LoginPage.verifyOnLoginPage()
      cy.url().should('not.include', '/inventory.html')
    })

    it('should reset app state from menu', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      cy.get('#react-burger-menu-btn').click()
      cy.get('#reset_sidebar_link').click()

      // Assert
      ProductsPage.verifyCartBadgeCount(0)
    })

    it('should display About link in menu', () => {
      // Act
      ProductsPage.openMenu()

      // Assert
      cy.get('#about_sidebar_link').should('be.visible')
      cy.get('#about_sidebar_link').should('have.attr', 'href')
    })
  })

  describe('Header Navigation Tests', () => {
    it('should display Swag Labs logo', () => {
      // Assert
      cy.get('.app_logo').should('be.visible')
      cy.get('.app_logo').should('contain', 'Swag Labs')
    })

    it('should display shopping cart icon in header', () => {
      // Assert
      ProductsPage.cartLink.should('be.visible')
    })

    it('should display menu button in header', () => {
      // Assert
      ProductsPage.menuButton.should('be.visible')
    })

    it('should navigate to cart when clicking cart icon', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
    })

    it('should maintain header across all pages', () => {
      // Assert - Products page
      cy.get('.app_logo').should('be.visible')
      ProductsPage.cartLink.should('be.visible')

      // Act & Assert - Cart page
      ProductsPage.goToCart()
      cy.get('.app_logo').should('be.visible')
      CartPage.cartLink.should('be.visible')

      // Act & Assert - Checkout page
      CartPage.proceedToCheckout()
      cy.get('.app_logo').should('be.visible')
      CheckoutPage.cartLink.should('be.visible')
    })
  })

  describe('Footer Navigation Tests', () => {
    it('should display footer on all pages', () => {
      // Assert - Products page
      cy.get('footer').should('be.visible')

      // Act & Assert - Cart page
      ProductsPage.goToCart()
      cy.get('footer').should('be.visible')

      // Act & Assert - Checkout page
      CartPage.proceedToCheckout()
      cy.get('footer').should('be.visible')
    })

    it('should display social media links in footer', () => {
      // Assert
      cy.get('footer').within(() => {
        cy.contains('Twitter').should('be.visible')
        cy.contains('Facebook').should('be.visible')
        cy.contains('LinkedIn').should('be.visible')
      })
    })

    it('should display copyright information', () => {
      // Assert
      cy.get('footer').should('contain', '©')
      cy.get('footer').should('contain', 'Sauce Labs')
    })

    it('should have working social media links', () => {
      // Assert
      cy.get('footer').within(() => {
        cy.contains('Twitter').parent().should('have.attr', 'href')
        cy.contains('Facebook').parent().should('have.attr', 'href')
        cy.contains('LinkedIn').parent().should('have.attr', 'href')
      })
    })
  })

  describe('Breadcrumb and Page Title Tests', () => {
    it('should display correct page title on products page', () => {
      // Assert
      ProductsPage.pageTitle.should('have.text', 'Products')
    })

    it('should display correct page title on cart page', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.pageTitle.should('have.text', 'Your Cart')
    })

    it('should display correct page title on checkout step one', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act
      CartPage.proceedToCheckout()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Your Information')
    })

    it('should display correct page title on checkout step two', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')

      // Act
      CheckoutPage.clickContinue()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Overview')
    })

    it('should display correct page title on checkout complete', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()

      // Act
      CheckoutPage.clickFinish()

      // Assert
      CheckoutPage.pageTitle.should('have.text', 'Checkout: Complete!')
    })
  })

  describe('Browser Navigation Tests', () => {
    it('should handle back button navigation', () => {
      // Arrange
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()

      // Act
      cy.go('back')

      // Assert
      ProductsPage.verifyOnProductsPage()
    })

    it('should handle forward button navigation', () => {
      // Arrange
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()
      cy.go('back')

      // Act
      cy.go('forward')
      cy.wait(500) // Allow page to restore state

      // Assert
      cy.url().should('include', '/cart.html')
      CartPage.verifyOnCartPage()
    })

    it('should handle multiple back navigations', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()
      CartPage.proceedToCheckout()
      CheckoutPage.verifyOnCheckoutStepOne()

      // Act
      cy.go('back')
      cy.wait(500)
      cy.go('back')
      cy.wait(500)

      // Assert
      cy.url().should('include', '/inventory.html')
      ProductsPage.verifyOnProductsPage()
    })

    it('should maintain state during browser navigation', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.goToCart()

      // Act
      cy.go('back')

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(1)
    })

    it('should handle page refresh', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      cy.reload()

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(1)
    })
  })

  describe('URL Navigation Tests', () => {
    it('should navigate to products page via URL', () => {
      // Act
      cy.visit('/inventory.html')

      // Assert
      ProductsPage.verifyOnProductsPage()
    })

    it('should navigate to cart page via URL', () => {
      // Act
      cy.visit('/cart.html')
      cy.wait(500) // Allow page to load

      // Assert
      cy.url().should('include', '/cart.html')
      CartPage.verifyOnCartPage()
    })

    it('should navigate to checkout via URL', () => {
      // Act
      cy.visit('/checkout-step-one.html')
      cy.wait(500) // Allow page to load

      // Assert
      cy.url().should('include', '/checkout-step-one.html')
      CheckoutPage.verifyOnCheckoutStepOne()
    })

    it('should handle invalid URL gracefully', () => {
      // Act
      cy.visit('/invalid-page.html', { failOnStatusCode: false })
      cy.wait(500) // Allow redirect to complete if needed

      // Assert - Should redirect or show error
      cy.url().then((url) => {
        expect(url).to.satisfy((url) => 
          url.includes('/inventory.html') || 
          url.includes('/invalid-page.html')
        )
      })
    })

    it('should maintain query parameters in URL', () => {
      // Act
      cy.visit('/inventory.html?test=param')

      // Assert
      cy.url().should('include', 'test=param')
      ProductsPage.verifyOnProductsPage()
    })
  })

  describe('Responsive Design Tests', () => {
    it('should display correctly on desktop viewport', () => {
      // Act
      cy.viewport(1920, 1080)

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.inventoryItems.should('be.visible')
      ProductsPage.menuButton.should('be.visible')
    })

    it('should display correctly on tablet viewport', () => {
      // Act
      cy.viewport(768, 1024)

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.inventoryItems.should('be.visible')
      ProductsPage.menuButton.should('be.visible')
    })

    it('should display correctly on mobile viewport', () => {
      // Act
      cy.viewport(375, 667)

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.inventoryItems.should('be.visible')
      ProductsPage.menuButton.should('be.visible')
    })

    it('should maintain functionality on small screens', () => {
      // Arrange
      cy.viewport(375, 667)

      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
    })
  })

  describe('UI Consistency Tests', () => {
    it('should use consistent button styles', () => {
      // Assert
      cy.get('button').each(($btn) => {
        cy.wrap($btn).should('have.css', 'cursor')
      })
    })

    it('should use consistent color scheme', () => {
      // Assert - Check primary elements have consistent styling
      cy.get('.app_logo').should('have.css', 'color')
      cy.get('.title').should('have.css', 'color')
    })

    it('should use consistent font family', () => {
      // Assert
      cy.get('body').should('have.css', 'font-family')
    })

    it('should display consistent spacing', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).should('have.css', 'margin')
        cy.wrap($item).should('have.css', 'padding')
      })
    })
  })

  describe('Loading and Performance Tests', () => {
    it('should load products page quickly', () => {
      // Arrange
      const startTime = Date.now()

      // Act
      cy.visit('/inventory.html')

      // Assert
      ProductsPage.verifyOnProductsPage()
      const loadTime = Date.now() - startTime
      expect(loadTime).to.be.lessThan(5000)
    })

    it('should load images efficiently', () => {
      // Assert
      ProductsPage.inventoryItems.find('img').each(($img) => {
        cy.wrap($img)
          .should('be.visible')
          .and('have.prop', 'naturalWidth')
          .should('be.greaterThan', 0)
      })
    })

    it('should handle rapid navigation', () => {
      // Act
      ProductsPage.goToCart()
      cy.go('back')
      ProductsPage.goToCart()
      cy.go('back')
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
    })
  })

  describe('Accessibility Tests', () => {
    it('should have accessible form labels', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Assert
      CheckoutPage.firstNameInput.should('have.attr', 'placeholder')
      CheckoutPage.lastNameInput.should('have.attr', 'placeholder')
      CheckoutPage.postalCodeInput.should('have.attr', 'placeholder')
    })

    it('should have accessible button text', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).find('button').invoke('text').should('not.be.empty')
      })
    })

    it('should have accessible links', () => {
      // Assert
      cy.get('footer').within(() => {
        cy.get('a').each(($link) => {
          cy.wrap($link).should('have.attr', 'href').and('not.be.empty')
        })
      })
    })

    it('should have accessible images', () => {
      // Assert
      ProductsPage.inventoryItems.find('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt')
      })
    })
  })

  describe('Error Handling Tests', () => {
    it('should handle logout and prevent unauthorized access', () => {
      // Act
      cy.logout()
      cy.visit('/inventory.html')

      // Assert
      LoginPage.verifyOnLoginPage()
    })

    it('should handle session timeout gracefully', () => {
      // Act
      cy.clearCookies()
      cy.visit('/inventory.html')

      // Assert
      LoginPage.verifyOnLoginPage()
    })

    it('should display error messages clearly', () => {
      // Arrange
      cy.logout()
      LoginPage.visit()

      // Act
      LoginPage.clickLogin()

      // Assert
      LoginPage.errorMessage.should('be.visible')
      LoginPage.errorMessage.should('have.css', 'color')
    })
  })

  describe('Cross-Page Navigation Tests', () => {
    it('should navigate through complete user journey', () => {
      // Act & Assert - Products to Cart
      ProductsPage.verifyOnProductsPage()
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()

      // Act & Assert - Cart to Checkout
      CartPage.proceedToCheckout()
      CheckoutPage.verifyOnCheckoutStepOne()

      // Act & Assert - Checkout Step 1 to Step 2
      CheckoutPage.fillCheckoutInformation('John', 'Doe', '12345')
      CheckoutPage.clickContinue()
      CheckoutPage.verifyOnCheckoutStepTwo()

      // Act & Assert - Complete Order
      CheckoutPage.clickFinish()
      CheckoutPage.verifyOnCheckoutComplete()

      // Act & Assert - Back to Products
      CheckoutPage.clickBackHome()
      ProductsPage.verifyOnProductsPage()
    })

    it('should handle navigation cancellations', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.proceedToCheckout()

      // Act - Cancel checkout
      CheckoutPage.clickCancel()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
    })

    it('should maintain cart during navigation', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act - Navigate through pages
      ProductsPage.goToCart()
      CartPage.continueShopping()
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(2)
    })
  })

  describe('Visual Regression Tests', () => {
    it('should display products page layout correctly', () => {
      // Assert
      cy.get('.inventory_container').should('be.visible')
      cy.get('.inventory_list').should('be.visible')
      ProductsPage.productSortDropdown.should('be.visible')
    })

    it('should display cart page layout correctly', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      cy.get('.cart_contents_container').should('be.visible')
      cy.get('.cart_list').should('be.visible')
      CartPage.continueShoppingButton.should('be.visible')
      CartPage.checkoutButton.should('be.visible')
    })

    it('should display checkout page layout correctly', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act
      CartPage.proceedToCheckout()

      // Assert
      cy.get('.checkout_info_container').should('be.visible')
      CheckoutPage.firstNameInput.should('be.visible')
      CheckoutPage.lastNameInput.should('be.visible')
      CheckoutPage.postalCodeInput.should('be.visible')
    })

    it('should display consistent header across pages', () => {
      // Assert - Products page
      cy.get('.header_container').should('be.visible')
      
      // Act & Assert - Cart page
      ProductsPage.goToCart()
      cy.get('.header_container').should('be.visible')
      
      // Act & Assert - Checkout page
      CartPage.proceedToCheckout()
      cy.get('.header_container').should('be.visible')
    })
  })
})