# SauceDemo End-to-End Test Automation

Comprehensive test automation suite for [SauceDemo](https://www.saucedemo.com) using Cypress with Page Object Model pattern.

## 📋 Overview

This project contains a complete end-to-end test automation framework covering all functional aspects of the SauceDemo e-commerce application with extensive positive, negative, and edge case scenarios.

## 🎯 Test Coverage

### Test Suites (300+ Test Cases)

1. **Authentication Tests** (30+ tests)
   - Valid login with all user types
   - Invalid credentials handling
   - Security testing (SQL injection, XSS)
   - Edge cases and boundary conditions

2. **Product Catalog Tests** (50+ tests)
   - Product display validation
   - Sorting functionality (A-Z, Z-A, price)
   - Add to cart operations
   - Product navigation
   - Image loading and validation

3. **Shopping Cart Tests** (40+ tests)
   - Cart operations (add, remove, update)
   - Cart persistence across navigation
   - Cart badge validation
   - Empty cart scenarios

4. **Checkout Flow Tests** (60+ tests)
   - Multi-step checkout process
   - Form validation (positive and negative)
   - Order calculation verification
   - Payment and shipping information
   - Order completion

5. **Navigation and UI Tests** (70+ tests)
   - Menu navigation
   - Header and footer consistency
   - Browser navigation (back, forward, refresh)
   - URL navigation
   - Responsive design testing
   - Accessibility validation

6. **Edge Cases and Boundary Tests** (50+ tests)
   - Data boundary testing
   - Special characters and encoding
   - Session management
   - Concurrent actions
   - Extreme load scenarios

## 🏗️ Project Structure

```
automation/
├── cypress/
│   ├── e2e/
│   │   ├── 01-authentication.cy.js
│   │   ├── 02-product-catalog.cy.js
│   │   ├── 03-shopping-cart.cy.js
│   │   ├── 04-checkout-flow.cy.js
│   │   ├── 05-navigation-and-ui.cy.js
│   │   └── 06-edge-cases-and-boundary.cy.js
│   ├── support/
│   │   ├── commands.js          # Custom Cypress commands
│   │   ├── e2e.js                # Support file
│   │   └── pages/                # Page Object Model
│   │       ├── LoginPage.js
│   │       ├── ProductsPage.js
│   │       ├── CartPage.js
│   │       └── CheckoutPage.js
├── cypress.config.js             # Cypress configuration
├── package.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd automation
```

2. Install dependencies:
```bash
npm install
```

## 🧪 Running Tests

### Run all tests (headless mode):
```bash
npm test
```

### Run tests in Chrome browser:
```bash
npm run test:chrome
```

### Run tests in headed mode (visible browser):
```bash
npm run test:headed
```

### Run specific test file:
```bash
npm run test:spec cypress/e2e/01-authentication.cy.js
```

### Open Cypress Test Runner:
```bash
npm run cy:open
```

## 📝 Test Design Patterns

### Page Object Model (POM)

All page interactions are encapsulated in Page Object classes:

```javascript
// Example: LoginPage.js
class LoginPage {
  get usernameInput() { return cy.get('[data-test="username"]') }
  get passwordInput() { return cy.get('[data-test="password"]') }
  
  login(username, password) {
    this.usernameInput.type(username)
    this.passwordInput.type(password)
    this.loginButton.click()
  }
}
```

### Custom Commands

Reusable commands for common operations:

```javascript
// Login command
Cypress.Commands.add('login', (username, password) => {
  cy.visit('/')
  cy.get('[data-test="username"]').type(username)
  cy.get('[data-test="password"]').type(password)
  cy.get('[data-test="login-button"]').click()
})
```

### Test Structure

All tests follow the Arrange-Act-Assert pattern:

```javascript
it('should add product to cart', () => {
  // Arrange
  const productName = 'Sauce Labs Backpack'
  
  // Act
  ProductsPage.addProductToCart(productName)
  
  // Assert
  ProductsPage.verifyCartBadgeCount(1)
})
```

## 🎨 Test Scenarios

### Positive Scenarios
- Valid user workflows
- Successful operations
- Expected behavior validation

### Negative Scenarios
- Invalid inputs
- Error handling
- Validation messages

### Edge Cases
- Boundary values
- Special characters
- Concurrent operations
- Session management
- Data persistence

## 📊 Test Assertions

Comprehensive assertions covering:
- Element visibility and state
- Text content validation
- URL verification
- Data accuracy
- Calculation correctness
- State persistence
- Error message validation

## 🔧 Configuration

### Cypress Configuration (cypress.config.js)

```javascript
{
  e2e: {
    baseUrl: 'https://www.saucedemo.com',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    pageLoadTimeout: 30000
  }
}
```

## 📈 Test Execution

### Test Users

The application provides multiple test users:
- `standard_user` - Normal user with full access
- `locked_out_user` - User that is locked out
- `problem_user` - User with UI issues
- `performance_glitch_user` - User with performance delays
- `error_user` - User that encounters errors
- `visual_user` - User with visual differences

Password for all users: `secret_sauce`

## 🐛 Debugging

### Screenshots
Screenshots are automatically captured on test failures in:
```
cypress/screenshots/
```

### Videos
Test execution videos (if enabled) are saved in:
```
cypress/videos/
```

### Browser Console
Console logs are captured during test execution for debugging.

## 📋 Best Practices

1. **Selector Strategy**
   - Prioritize data-test attributes
   - Use semantic selectors (role, label)
   - Avoid brittle CSS selectors

2. **Test Independence**
   - Each test is self-contained
   - No dependencies between tests
   - Clean state before each test

3. **Assertions**
   - Multiple assertions per test
   - Verify both positive and negative outcomes
   - Check element state and content

4. **Maintainability**
   - Page Object Model for reusability
   - Custom commands for common operations
   - Clear test descriptions

## 🤝 Contributing

1. Follow existing code structure
2. Maintain Page Object Model pattern
3. Add comprehensive assertions
4. Include positive, negative, and edge cases
5. Update documentation

## 📄 License

ISC

## 👥 Author

Test Automation Team

## 📞 Support

For issues or questions, please create an issue in the repository.

---

**Note**: This test suite provides comprehensive coverage of the SauceDemo application with 300+ test cases covering all functional areas, edge cases, and boundary conditions. All tests follow industry best practices and use the Page Object Model pattern for maintainability.