# Generic Playwright Test Suite Template

A comprehensive Playwright testing template designed for **dual-application testing** with clear separation between main app and admin portal workflows.

## 🏗️ **Architecture Overview**

This template supports testing **two separate applications**:
- **Main App** (`/MyApp/`) - End-user facing application
- **Admin Portal** (`/AdminPortal/`) - Administrative/operator interface

### **Key Features**
- ✅ **Dual-app support** with separate page objects and fixtures
- ✅ **Role-based testing** (systemAdmin, manager, operator, viewer)
- ✅ **Clear test categorization** (smoke, regression, manual)
- ✅ **Resilient locator strategies** for UI framework changes
- ✅ **Environment-based configuration**
- ✅ **Comprehensive test coverage** (positive/negative scenarios)

## 📊 **Test Structure**

### **Test Categories**
- **Smoke Tests** (`@smoke`) - Critical path, fast execution
- **Regression Tests** (`@regression`) - Comprehensive coverage
- **Manual Tests** - Interactive exploration and demos
- **Happy Path** (`@happy`) - Positive scenarios only

### **Test Identification**
Tests use clear prefixes to distinguish between applications:
- `(MyApp)` - Main application tests
- `(AdminPortal)` - Admin portal tests

## 🚀 **Getting Started**

### **1. Installation**
```bash
npm install
npx playwright install --with-deps
```

### **2. Environment Setup**
```bash
cp .env.example .env
# Edit .env with your actual URLs and credentials
```

### **3. Run Tests**
```bash
# Quick smoke tests
npm run test:myapp:smoke

# Full regression suite  
npm run test:myapp:regression

# Main app only
npm run test:myapp:main-app

# Admin portal only
npm run test:myapp:admin-portal

# Happy path scenarios
npm run test:myapp:happy

# Visual debugging (with browser)
npm run test:myapp:smoke -- --headed

# List all test scenarios
npm run ls:tests
```

## 📁 **Project Structure**

```
generic-playwright-template/
├── projects/project-myapp/           # Main test project
│   ├── pages/                        # Page Objects
│   │   ├── login.page.ts            # Admin Portal login
│   │   ├── main-app-login.page.ts   # Main app login (different selectors)
│   │   ├── dashboard.page.ts        # Admin Portal dashboard
│   │   └── main-app-dashboard.page.ts # Main app dashboard
│   ├── fixtures/                     # Test fixtures
│   │   ├── index.ts                 # Admin Portal fixtures
│   │   └── main-app.ts              # Main app fixtures
│   ├── tests/                        # Test specifications
│   │   ├── smoke/                   # Critical path tests
│   │   ├── regression/              # Comprehensive tests
│   │   └── manual/                  # Interactive tests
│   └── config.ts                    # App-specific configuration
├── shared/                          # Shared utilities
│   ├── fixtures/base.ts             # Base test fixtures
│   └── utils/locators.ts            # Resilient locator strategies
├── playwright.config.ts             # Playwright configuration
└── package.json                     # Dependencies and scripts
```

## 🧪 **Available Scripts**

### **Test Execution**
```bash
npm run test:myapp                   # Full test suite
npm run test:myapp:smoke            # Smoke tests only
npm run test:myapp:regression       # Regression tests only
npm run test:myapp:main-app         # Main app tests only
npm run test:myapp:admin-portal     # Admin portal tests only
npm run test:myapp:happy            # Happy path scenarios
npm run test:myapp:negative         # Negative scenarios
npm run test:myapp:manual           # Manual/interactive tests
```

### **Utilities**
```bash
npm run ls:tests                    # List all test scenarios
npm run test:headed                 # Run with visible browsers
npm run test:debug                  # Debug mode
npm run report                      # Show test reports
```

## ⚙️ **Configuration**

### **Environment Variables**
Set these in your `.env` file:

```bash
# Application URLs
MYAPP_APP_URL=https://your-main-app.com/
MYAPP_ADMINPORTAL_URL=https://your-admin.com/

# Test Credentials
MYAPP_ADMIN_USER=your-admin@example.com
MYAPP_ADMIN_PASS=your-password

# Visual Debugging
MYAPP_HOLD_MS=5000  # Hold browser open for 5 seconds after each test
```

### **Role-Based Testing**
Configure test users for different roles:
- `systemAdmin` - Full admin access
- `manager` - Management level access
- `operator` - Operational access
- `viewer` - Read-only access

## 🎯 **Sample Test IDs**
- **TEST-001**: Manual admin portal exploration
- **TEST-002**: (AdminPortal) logout functionality
- **TEST-003-006**: (AdminPortal) login scenarios
- **TEST-007-009**: (AdminPortal) smoke tests
- **TEST-030-037**: (MyApp) main application tests

## 🔍 **Visual Debugging**

Run tests with visible browsers and pauses:
```bash
# 5-second pause after each test
MYAPP_HOLD_MS=5000 npm run test:myapp:smoke -- --headed

# Debug mode (manual stepping)
npm run test:myapp:main-app -- --debug

# Single worker (sequential execution)
npm run test:myapp:smoke -- --headed --workers=1
```

## 🛠️ **Customization Guide**

### **1. Adapt for Your Application**
1. Replace `MyApp` references with your application name
2. Update URLs in `config.ts` to point to your environments
3. Modify page objects to match your application's DOM structure
4. Update test scenarios to reflect your business logic

### **2. Add New Test Categories**
1. Create new folders under `tests/`
2. Add corresponding npm scripts in `package.json`
3. Configure new projects in `playwright.config.ts`

### **3. Extend Page Objects**
Follow the established patterns:
- Use `resilient()` for multiple locator strategies
- Implement `assertLoaded()` methods for page verification
- Separate concerns between admin and main app pages

## 📋 **Best Practices**

### **Locator Strategy**
1. **User-facing first** - `getByRole`, `getByLabel`
2. **Partial attributes** - Framework-safe fallbacks
3. **Resilient chains** - Multiple strategies via `resilient()`

### **Test Organization**
- **Clear naming** - Use descriptive test names with prefixes
- **Logical grouping** - Separate smoke/regression/manual
- **Proper tagging** - Use `@happy`, `@smoke`, `@regression` tags

### **Environment Management**
- **Never commit credentials** - Use `.env` files (gitignored)
- **Environment-specific URLs** - Override via env vars
- **Fallback defaults** - Provide example values in config

## 🤝 **Contributing**

1. Follow existing naming conventions
2. Add new page objects for new UI components
3. Include both positive and negative test scenarios
4. Update documentation for new features
5. Test in both headed and headless modes

## 🎉 **Benefits of This Template**

- **🚀 Fast setup** - Ready-to-use dual-app testing
- **🔧 Flexible** - Easy customization for any application
- **🎯 Comprehensive** - Covers smoke, regression, and manual testing
- **💪 Resilient** - Built-in strategies for UI framework changes
- **📊 Organized** - Clear separation of concerns and test categories
- **🐛 Debuggable** - Multiple debugging and visual inspection options

Perfect for teams needing robust, maintainable end-to-end testing for complex applications! 🎊