# SauceDemo End-to-End Test Automation

Comprehensive test automation suite for [SauceDemo](https://www.saucedemo.com) using Cypress.

## Overview

This project contains a complete end-to-end test automation framework covering all functional aspects of the SauceDemo e-commerce application with extensive positive, negative, and edge case scenarios.

## Test Coverage

### Test Suites (300+ Test Cases)

1. **Authentication Tests** (30+ tests)
   - Valid login with all user types
   - Invalid credentials handling
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

## Project Structure

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

## Test Scenarios

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

## Test Assertions

Comprehensive assertions covering:
- Element visibility and state
- Text content validation
- URL verification
- Data accuracy
- Calculation correctness
- State persistence
- Error message validation

### Test Users

The application provides multiple test users:
- `standard_user` - Normal user with full access
- `locked_out_user` - User that is locked out
- `problem_user` - User with UI issues
- `performance_glitch_user` - User with performance delays
- `error_user` - User that encounters errors
- `visual_user` - User with visual differences

Password for all users: `secret_sauce`
