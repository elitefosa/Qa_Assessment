const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')
const CartPage = require('../support/pages/CartPage')

describe('Shopping Cart Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('standard_user', 'secret_sauce')
    ProductsPage.verifyOnProductsPage()
  })

  describe('Cart Navigation Tests', () => {
    it('should navigate to cart from products page', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      cy.url().should('include', '/cart.html')
    })

    it('should display empty cart when no items added', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(0)
      CartPage.checkoutButton.should('be.visible')
      CartPage.continueShoppingButton.should('be.visible')
    })

    it('should navigate back to products page from cart', () => {
      // Arrange
      ProductsPage.goToCart()
      CartPage.verifyOnCartPage()

      // Act
      CartPage.continueShopping()

      // Assert
      ProductsPage.verifyOnProductsPage()
      cy.url().should('include', '/inventory.html')
    })
  })

  describe('Add Items to Cart Tests', () => {
    it('should display single item in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductPrice('Sauce Labs Backpack', '$29.99')
      CartPage.verifyProductQuantity('Sauce Labs Backpack', 1)
    })

    it('should display multiple items in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(3)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
      CartPage.verifyProductInCart('Sauce Labs Bolt T-Shirt')
    })

    it('should display all 6 items in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')
      
      // Verify all items added before navigating
      ProductsPage.verifyCartBadgeCount(6)

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(6)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
      CartPage.verifyProductInCart('Sauce Labs Bolt T-Shirt')
      CartPage.verifyProductInCart('Sauce Labs Fleece Jacket')
      CartPage.verifyProductInCart('Sauce Labs Onesie')
      CartPage.verifyProductInCart('Test.allTheThings() T-Shirt (Red)')
    })

    it('should display correct product details in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyProductInCart('Sauce Labs Fleece Jacket')
      CartPage.verifyProductPrice('Sauce Labs Fleece Jacket', '$49.99')
      CartPage.getCartItemByName('Sauce Labs Fleece Jacket')
        .should('contain', 'midweight quarter-zip fleece jacket')
    })

    it('should display correct quantities for all items', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyProductQuantity('Sauce Labs Backpack', 1)
      CartPage.verifyProductQuantity('Sauce Labs Bike Light', 1)
    })
  })

  describe('Remove Items from Cart Tests', () => {
    it('should remove single item from cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(1)

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')

      // Assert
      CartPage.verifyCartItemCount(0)
      CartPage.verifyProductNotInCart('Sauce Labs Backpack')
      CartPage.verifyCartBadgeCount(0)
    })

    it('should remove specific item from multiple items', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(3)

      // Act
      CartPage.removeProduct('Sauce Labs Bike Light')

      // Assert
      CartPage.verifyCartItemCount(2)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductNotInCart('Sauce Labs Bike Light')
      CartPage.verifyProductInCart('Sauce Labs Bolt T-Shirt')
      CartPage.verifyCartBadgeCount(2)
    })

    it('should remove all items from cart one by one', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(3)

      // Act & Assert
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.verifyCartItemCount(2)
      CartPage.verifyCartBadgeCount(2)

      CartPage.removeProduct('Sauce Labs Bike Light')
      CartPage.verifyCartItemCount(1)
      CartPage.verifyCartBadgeCount(1)

      CartPage.removeProduct('Sauce Labs Bolt T-Shirt')
      CartPage.verifyCartItemCount(0)
      CartPage.verifyCartBadgeCount(0)
    })

    it('should update cart badge after removing items', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()
      CartPage.verifyCartBadgeCount(2)

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')

      // Assert
      CartPage.verifyCartBadgeCount(1)
    })
  })

  describe('Cart Persistence Tests', () => {
    it('should maintain cart items after page refresh', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(2)

      // Act
      cy.reload()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(2)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
      CartPage.verifyCartBadgeCount(2)
    })

    it('should maintain cart items when navigating between pages', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(1)

      // Act
      CartPage.continueShopping()
      ProductsPage.verifyOnProductsPage()
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })

    it('should maintain cart items after browser back button', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(1)

      // Act
      cy.go('back')
      ProductsPage.verifyOnProductsPage()
      cy.go('forward')

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })

    it('should persist removed items state', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.verifyCartItemCount(1)

      // Act
      cy.reload()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductNotInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
    })
  })

  describe('Cart Badge Tests', () => {
    it('should not display badge when cart is empty', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartBadgeCount(0)
    })

    it('should display correct badge count with one item', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartBadgeCount(1)
    })

    it('should display correct badge count with multiple items', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartBadgeCount(3)
    })

    it('should update badge count when removing items from cart page', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()
      CartPage.verifyCartBadgeCount(2)

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')

      // Assert
      CartPage.verifyCartBadgeCount(1)
    })

    it('should remove badge when last item is removed', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyCartBadgeCount(1)

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')

      // Assert
      CartPage.verifyCartBadgeCount(0)
    })
  })

  describe('Checkout Button Tests', () => {
    it('should display checkout button in empty cart', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCheckoutButtonVisible()
      CartPage.verifyCheckoutButtonEnabled()
    })

    it('should display checkout button with items in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCheckoutButtonVisible()
      CartPage.verifyCheckoutButtonEnabled()
    })

    it('should navigate to checkout when clicking checkout button', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act
      CartPage.proceedToCheckout()

      // Assert
      cy.url().should('include', '/checkout-step-one.html')
    })
  })

  describe('Edge Cases and Boundary Tests', () => {
    it('should handle rapid add and remove operations', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.continueShopping()
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })

    it('should handle removing same item multiple times', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act
      CartPage.removeProduct('Sauce Labs Backpack')
      CartPage.getRemoveButton('Sauce Labs Backpack').should('not.exist')

      // Assert
      CartPage.verifyCartItemCount(0)
    })

    it('should handle adding items from cart page via continue shopping', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.verifyCartItemCount(1)

      // Act
      CartPage.continueShopping()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(2)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
    })

    it('should handle maximum cart capacity (all 6 items)', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')
      
      // Verify all items added before navigating
      ProductsPage.verifyCartBadgeCount(6)

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(6)
      CartPage.verifyCartBadgeCount(6)
    })

    it('should handle direct URL navigation to cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      cy.visit('/cart.html')
      cy.wait(500) // Allow page to fully load

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.verifyCartItemCount(1)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
    })

    it('should maintain cart state across multiple page navigations', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()
      CartPage.continueShopping()
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act
      ProductsPage.goToCart()
      CartPage.continueShopping()
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyCartItemCount(2)
      CartPage.verifyProductInCart('Sauce Labs Backpack')
      CartPage.verifyProductInCart('Sauce Labs Bike Light')
    })
  })

  describe('UI and Visual Tests', () => {
    it('should display cart page title', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.pageTitle.should('be.visible')
      CartPage.pageTitle.should('have.text', 'Your Cart')
    })

    it('should display QTY and Description headers', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      cy.contains('.cart_quantity_label', 'QTY').should('be.visible')
      cy.contains('.cart_desc_label', 'Description').should('be.visible')
    })

    it('should display Continue Shopping button', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.continueShoppingButton.should('be.visible')
      CartPage.continueShoppingButton.should('contain', 'Continue Shopping')
    })

    it('should display Checkout button', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.checkoutButton.should('be.visible')
      CartPage.checkoutButton.should('contain', 'Checkout')
    })

    it('should display product images in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.getCartItemByName('Sauce Labs Backpack')
        .find('img')
        .should('exist')
        .and('be.visible')
        .and('have.attr', 'src')
        .and('not.be.empty')
    })

    it('should display product names as links', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.verifyOnCartPage()
      CartPage.getCartItemByName('Sauce Labs Backpack')
        .find('.inventory_item_name')
        .should('be.visible')
        .and('have.prop', 'tagName')
        .and('equal', 'A')
    })

    it('should display Remove button for each item', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.getRemoveButton('Sauce Labs Backpack').should('be.visible')
      CartPage.getRemoveButton('Sauce Labs Bike Light').should('be.visible')
    })

    it('should display product descriptions in cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Act
      ProductsPage.goToCart()

      // Assert
      CartPage.getCartItemByName('Sauce Labs Backpack')
        .find('.inventory_item_desc')
        .should('be.visible')
        .and('contain', 'carry.allTheThings()')
    })
  })
})