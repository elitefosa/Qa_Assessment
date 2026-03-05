class ProductsPage {
  // Selectors
  get pageTitle() {
    return cy.get('.title')
  }

  get productSortDropdown() {
    return cy.get('[data-test="product-sort-container"]')
  }

  get inventoryItems() {
    return cy.get('.inventory_item')
  }

  get inventoryItemNames() {
    return cy.get('.inventory_item_name')
  }

  get inventoryItemPrices() {
    return cy.get('.inventory_item_price')
  }

  get cartBadge() {
    return cy.get('.shopping_cart_badge')
  }

  get cartLink() {
    return cy.get('.shopping_cart_link')
  }

  get menuButton() {
    return cy.get('#react-burger-menu-btn')
  }

  getProductByName(productName) {
    return cy.contains('.inventory_item', productName)
  }

  getAddToCartButton(productName) {
    const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    return cy.get(`[data-test="add-to-cart-${productId}"]`)
  }

  getRemoveButton(productName) {
    const productId = productName.toLowerCase().replace(/\s+/g, '-').replace(/[()]/g, '')
    return cy.get(`[data-test="remove-${productId}"]`)
  }

  // Actions
  visit() {
    cy.visit('/inventory.html')
  }

  sortProducts(sortOption) {
    this.productSortDropdown.select(sortOption)
  }

  addProductToCart(productName) {
    this.getAddToCartButton(productName).click()
  }

  removeProductFromCart(productName) {
    this.getRemoveButton(productName).click()
  }

  clickProduct(productName) {
    this.getProductByName(productName).find('.inventory_item_name').click()
  }

  goToCart() {
    this.cartLink.click()
  }

  openMenu() {
    this.menuButton.click()
  }

  // Assertions
  verifyOnProductsPage() {
    cy.url().should('include', '/inventory.html')
    this.pageTitle.should('have.text', 'Products')
  }

  verifyProductCount(expectedCount) {
    this.inventoryItems.should('have.length', expectedCount)
  }

  verifyProductVisible(productName) {
    this.getProductByName(productName).should('be.visible')
  }

  verifyProductNotVisible(productName) {
    this.getProductByName(productName).should('not.exist')
  }

  verifyCartBadgeCount(count) {
    if (count === 0) {
      this.cartBadge.should('not.exist')
    } else {
      this.cartBadge.should('have.text', count.toString())
    }
  }

  verifyProductsSortedByName(order = 'asc') {
    this.inventoryItemNames.then($items => {
      const names = [...$items].map(item => item.innerText)
      const sortedNames = [...names].sort()
      if (order === 'desc') {
        sortedNames.reverse()
      }
      expect(names).to.deep.equal(sortedNames)
    })
  }

  verifyProductsSortedByPrice(order = 'asc') {
    this.inventoryItemPrices.then($prices => {
      const prices = [...$prices].map(price => parseFloat(price.innerText.replace('$', '')))
      const sortedPrices = [...prices].sort((a, b) => a - b)
      if (order === 'desc') {
        sortedPrices.reverse()
      }
      expect(prices).to.deep.equal(sortedPrices)
    })
  }

  verifyAddToCartButtonVisible(productName) {
    this.getAddToCartButton(productName).should('be.visible')
  }

  verifyRemoveButtonVisible(productName) {
    this.getRemoveButton(productName).should('be.visible')
  }
}

module.exports = new ProductsPage()