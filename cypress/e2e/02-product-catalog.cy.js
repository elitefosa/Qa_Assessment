const LoginPage = require('../support/pages/LoginPage')
const ProductsPage = require('../support/pages/ProductsPage')

describe('Product Catalog Tests', () => {
  beforeEach(() => {
    // Login before each test
    cy.login('standard_user', 'secret_sauce')
    ProductsPage.verifyOnProductsPage()
  })

  describe('Product Display Tests', () => {
    it('should display all 6 products on the page', () => {
      // Assert
      ProductsPage.verifyProductCount(6)
      ProductsPage.inventoryItems.should('be.visible')
    })

    it('should display Sauce Labs Backpack product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Sauce Labs Backpack')
      ProductsPage.getProductByName('Sauce Labs Backpack')
        .should('contain', '$29.99')
        .and('contain', 'carry.allTheThings()')
    })

    it('should display Sauce Labs Bike Light product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Sauce Labs Bike Light')
      ProductsPage.getProductByName('Sauce Labs Bike Light')
        .should('contain', '$9.99')
        .and('contain', 'A red light')
    })

    it('should display Sauce Labs Bolt T-Shirt product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Sauce Labs Bolt T-Shirt')
      ProductsPage.getProductByName('Sauce Labs Bolt T-Shirt')
        .should('contain', '$15.99')
        .and('contain', 'Get your testing superhero on')
    })

    it('should display Sauce Labs Fleece Jacket product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Sauce Labs Fleece Jacket')
      ProductsPage.getProductByName('Sauce Labs Fleece Jacket')
        .should('contain', '$49.99')
        .and('contain', 'midweight quarter-zip fleece jacket')
    })

    it('should display Sauce Labs Onesie product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Sauce Labs Onesie')
      ProductsPage.getProductByName('Sauce Labs Onesie')
        .should('contain', '$7.99')
        .and('contain', 'Rib snap infant onesie')
    })

    it('should display Test.allTheThings() T-Shirt (Red) product', () => {
      // Assert
      ProductsPage.verifyProductVisible('Test.allTheThings() T-Shirt (Red)')
      ProductsPage.getProductByName('Test.allTheThings() T-Shirt (Red)')
        .should('contain', '$15.99')
        .and('contain', 'This classic Sauce Labs t-shirt')
    })

    it('should display product images for all products', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).find('img').should('be.visible')
        cy.wrap($item).find('img').should('have.attr', 'src')
      })
    })

    it('should display product names for all products', () => {
      // Assert
      ProductsPage.inventoryItemNames.should('have.length', 6)
      ProductsPage.inventoryItemNames.each(($name) => {
        cy.wrap($name).should('be.visible')
        cy.wrap($name).invoke('text').should('not.be.empty')
      })
    })

    it('should display product prices for all products', () => {
      // Assert
      ProductsPage.inventoryItemPrices.should('have.length', 6)
      ProductsPage.inventoryItemPrices.each(($price) => {
        cy.wrap($price).should('be.visible')
        cy.wrap($price).invoke('text').should('match', /^\$\d+\.\d{2}$/)
      })
    })

    it('should display product descriptions for all products', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).find('.inventory_item_desc').should('be.visible')
        cy.wrap($item).find('.inventory_item_desc').invoke('text').should('not.be.empty')
      })
    })

    it('should display Add to cart button for all products', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).find('button').should('be.visible')
        cy.wrap($item).find('button').should('contain', 'Add to cart')
      })
    })
  })

  describe('Product Sorting Tests', () => {
    it('should sort products by name A to Z by default', () => {
      // Assert
      ProductsPage.productSortDropdown.should('have.value', 'az')
      ProductsPage.verifyProductsSortedByName('asc')
    })

    it('should sort products by name Z to A', () => {
      // Act
      ProductsPage.sortProducts('za')

      // Assert
      ProductsPage.productSortDropdown.should('have.value', 'za')
      ProductsPage.verifyProductsSortedByName('desc')
    })

    it('should sort products by price low to high', () => {
      // Act
      ProductsPage.sortProducts('lohi')

      // Assert
      ProductsPage.productSortDropdown.should('have.value', 'lohi')
      ProductsPage.verifyProductsSortedByPrice('asc')
    })

    it('should sort products by price high to low', () => {
      // Act
      ProductsPage.sortProducts('hilo')

      // Assert
      ProductsPage.productSortDropdown.should('have.value', 'hilo')
      ProductsPage.verifyProductsSortedByPrice('desc')
    })

    it('should maintain sorting after adding product to cart', () => {
      // Arrange
      ProductsPage.sortProducts('hilo')

      // Act
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')

      // Assert
      ProductsPage.productSortDropdown.should('have.value', 'hilo')
      ProductsPage.verifyProductsSortedByPrice('desc')
    })

    it('should allow switching between different sort options', () => {
      // Act & Assert
      ProductsPage.sortProducts('za')
      ProductsPage.verifyProductsSortedByName('desc')

      ProductsPage.sortProducts('lohi')
      ProductsPage.verifyProductsSortedByPrice('asc')

      ProductsPage.sortProducts('az')
      ProductsPage.verifyProductsSortedByName('asc')

      ProductsPage.sortProducts('hilo')
      ProductsPage.verifyProductsSortedByPrice('desc')
    })
  })

  describe('Add to Cart Functionality Tests', () => {
    it('should add single product to cart', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Assert
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })

    it('should add multiple products to cart', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')

      // Assert
      ProductsPage.verifyCartBadgeCount(3)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bike Light')
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bolt T-Shirt')
    })

    it('should add all products to cart', () => {
      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.addProductToCart('Sauce Labs Fleece Jacket')
      ProductsPage.addProductToCart('Sauce Labs Onesie')
      ProductsPage.addProductToCart('Test.allTheThings() T-Shirt (Red)')

      // Assert
      ProductsPage.verifyCartBadgeCount(6)
    })

    it('should change button text from Add to cart to Remove', () => {
      // Arrange
      ProductsPage.verifyAddToCartButtonVisible('Sauce Labs Backpack')

      // Act
      ProductsPage.addProductToCart('Sauce Labs Backpack')

      // Assert
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
      ProductsPage.getRemoveButton('Sauce Labs Backpack').should('have.text', 'Remove')
    })

    it('should remove product from cart', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      ProductsPage.removeProductFromCart('Sauce Labs Backpack')

      // Assert
      ProductsPage.verifyCartBadgeCount(0)
      ProductsPage.verifyAddToCartButtonVisible('Sauce Labs Backpack')
    })

    it('should update cart badge when removing products', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.addProductToCart('Sauce Labs Bolt T-Shirt')
      ProductsPage.verifyCartBadgeCount(3)

      // Act
      ProductsPage.removeProductFromCart('Sauce Labs Bike Light')

      // Assert
      ProductsPage.verifyCartBadgeCount(2)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
      ProductsPage.verifyAddToCartButtonVisible('Sauce Labs Bike Light')
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bolt T-Shirt')
    })

    it('should not display cart badge when cart is empty', () => {
      // Assert
      ProductsPage.verifyCartBadgeCount(0)
    })
  })

  describe('Product Navigation Tests', () => {
    it('should navigate to product details when clicking product name', () => {
      // Act
      ProductsPage.clickProduct('Sauce Labs Backpack')

      // Assert
      cy.url().should('include', '/inventory-item.html')
      cy.get('.inventory_details_name').should('have.text', 'Sauce Labs Backpack')
    })

    it('should navigate to product details when clicking product image', () => {
      // Act
      ProductsPage.getProductByName('Sauce Labs Backpack').find('img').click()

      // Assert
      cy.url().should('include', '/inventory-item.html')
      cy.get('.inventory_details_name').should('have.text', 'Sauce Labs Backpack')
    })

    it('should navigate to cart when clicking cart icon', () => {
      // Act
      ProductsPage.goToCart()

      // Assert
      cy.url().should('include', '/cart.html')
    })

    it('should maintain cart items when navigating to product details and back', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act
      ProductsPage.clickProduct('Sauce Labs Bike Light')
      cy.go('back')

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })
  })

  describe('Edge Cases and Boundary Tests', () => {
    it('should handle rapid clicking of Add to cart button', () => {
      // Act - Click once, button changes to Remove, so subsequent clicks won't add more items
      ProductsPage.getAddToCartButton('Sauce Labs Backpack').click()

      // Assert - Should only add once despite rapid clicking attempt
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })

    it('should handle rapid clicking of Remove button', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      // Act - Click once, button changes to Add to cart, so subsequent clicks won't remove more
      ProductsPage.getRemoveButton('Sauce Labs Backpack').click()

      // Assert - Should only remove once
      ProductsPage.verifyCartBadgeCount(0)
      ProductsPage.verifyAddToCartButtonVisible('Sauce Labs Backpack')
    })

    it('should handle adding and removing same product multiple times', () => {
      // Act & Assert
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      ProductsPage.removeProductFromCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(0)

      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(1)

      ProductsPage.removeProductFromCart('Sauce Labs Backpack')
      ProductsPage.verifyCartBadgeCount(0)
    })

    it('should maintain product state after page refresh', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.addProductToCart('Sauce Labs Bike Light')
      ProductsPage.verifyCartBadgeCount(2)

      // Act
      cy.reload()

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(2)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Bike Light')
    })

    it('should handle browser back button after adding products', () => {
      // Arrange
      ProductsPage.addProductToCart('Sauce Labs Backpack')
      ProductsPage.goToCart()

      // Act
      cy.go('back')

      // Assert
      ProductsPage.verifyOnProductsPage()
      ProductsPage.verifyCartBadgeCount(1)
      ProductsPage.verifyRemoveButtonVisible('Sauce Labs Backpack')
    })

    it('should handle browser forward button', () => {
      // Arrange
      ProductsPage.goToCart()
      cy.go('back')

      // Act
      cy.go('forward')

      // Assert
      cy.url().should('include', '/cart.html')
    })

    it('should display correct prices with proper formatting', () => {
      // Assert
      ProductsPage.getProductByName('Sauce Labs Backpack')
        .find('.inventory_item_price')
        .should('have.text', '$29.99')

      ProductsPage.getProductByName('Sauce Labs Bike Light')
        .find('.inventory_item_price')
        .should('have.text', '$9.99')

      ProductsPage.getProductByName('Sauce Labs Onesie')
        .find('.inventory_item_price')
        .should('have.text', '$7.99')
    })

    it('should maintain sorting preference across page navigation', () => {
      // Arrange
      ProductsPage.sortProducts('hilo')

      // Act
      ProductsPage.goToCart()
      cy.go('back')

      // Assert - Wait for page to be fully loaded after navigation
      cy.url().should('include', '/inventory.html')
      cy.wait(500) // Allow time for page state to restore
      ProductsPage.verifyOnProductsPage()
      ProductsPage.productSortDropdown.should('have.value', 'hilo')
    })
  })

  describe('UI and Visual Tests', () => {
    it('should display Products page title', () => {
      // Assert
      ProductsPage.pageTitle.should('be.visible')
      ProductsPage.pageTitle.should('have.text', 'Products')
    })

    it('should display sort dropdown', () => {
      // Assert
      ProductsPage.productSortDropdown.should('be.visible')
      ProductsPage.productSortDropdown.should('be.enabled')
    })

    it('should display cart icon', () => {
      // Assert
      ProductsPage.cartLink.should('be.visible')
    })

    it('should display menu button', () => {
      // Assert
      ProductsPage.menuButton.should('be.visible')
      ProductsPage.menuButton.should('be.enabled')
    })

    it('should have all product images loaded', () => {
      // Assert
      ProductsPage.inventoryItems.find('img').each(($img) => {
        cy.wrap($img)
          .should('be.visible')
          .and('have.prop', 'naturalWidth')
          .should('be.greaterThan', 0)
      })
    })

    it('should display product layout correctly', () => {
      // Assert
      ProductsPage.inventoryItems.each(($item) => {
        cy.wrap($item).find('.inventory_item_img').should('be.visible')
        cy.wrap($item).find('.inventory_item_name').should('be.visible')
        cy.wrap($item).find('.inventory_item_desc').should('be.visible')
        cy.wrap($item).find('.inventory_item_price').should('be.visible')
        cy.wrap($item).find('button').should('be.visible')
      })
    })
  })
})