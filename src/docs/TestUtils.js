
/**
 * This file contains utility functions for testing the Spiritless application.
 * These functions can be used to automate tests specified in the test plan.
 */

/**
 * Login to the application with the specified credentials.
 * @param {string} usernameOrEmail - The username or email to login with
 * @param {string} password - The password to login with
 * @param {string} userType - The type of user (individual, establishment, admin)
 * @returns {Promise<boolean>} - Whether the login was successful
 */
export const login = async (usernameOrEmail, password, userType = 'individual') => {
  // This is a mock implementation
  console.log(`Logging in as ${usernameOrEmail} (${userType})`);
  
  // In a real implementation, this would:
  // 1. Find and fill in the login form
  // 2. Submit the form
  // 3. Wait for redirect or response
  // 4. Return success/failure
  
  // For now, we'll just simulate success by setting localStorage
  localStorage.setItem('user_authenticated', 'true');
  localStorage.setItem('user_type', userType);
  
  if (usernameOrEmail.includes('@')) {
    localStorage.setItem('user_email', usernameOrEmail);
  } else {
    localStorage.setItem('user_username', usernameOrEmail);
  }
  
  return true;
};

/**
 * Logout from the application.
 * @returns {Promise<boolean>} - Whether the logout was successful
 */
export const logout = async () => {
  // Mock implementation
  console.log('Logging out');
  
  // Clear authentication data
  localStorage.removeItem('user_authenticated');
  localStorage.removeItem('admin_authenticated');
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_username');
  localStorage.removeItem('user_type');
  
  return true;
};

/**
 * Navigate to a specific page in the application.
 * @param {string} page - The page to navigate to
 * @returns {Promise<boolean>} - Whether navigation was successful
 */
export const navigateTo = async (page) => {
  // Mock implementation
  console.log(`Navigating to ${page}`);
  
  // In a real implementation, this would use a router or window.location
  window.location.href = page;
  
  return true;
};

/**
 * Add an item to the cart.
 * @param {Object} item - The item to add to the cart
 * @returns {Promise<boolean>} - Whether the item was added successfully
 */
export const addToCart = async (item) => {
  // Mock implementation
  console.log(`Adding ${item.name} to cart`);
  
  // In a real implementation, this would:
  // 1. Find and click the "Add to Cart" button
  // 2. Wait for the cart to update
  // 3. Return success/failure
  
  // For now, we'll just simulate by manipulating the cart directly
  const cart = JSON.parse(localStorage.getItem('cart') || '[]');
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  
  return true;
};

/**
 * Check if an element exists on the page.
 * @param {string} selector - The CSS selector for the element
 * @returns {Promise<boolean>} - Whether the element exists
 */
export const elementExists = async (selector) => {
  // Mock implementation
  console.log(`Checking if ${selector} exists`);
  
  // In a real implementation, this would use document.querySelector
  const element = document.querySelector(selector);
  
  return !!element;
};

/**
 * Fill in a form with the specified data.
 * @param {string} formSelector - The CSS selector for the form
 * @param {Object} data - The data to fill in the form
 * @returns {Promise<boolean>} - Whether the form was filled successfully
 */
export const fillForm = async (formSelector, data) => {
  // Mock implementation
  console.log(`Filling form ${formSelector} with`, data);
  
  // In a real implementation, this would:
  // 1. Find the form
  // 2. Find each input and fill it with the corresponding data
  
  return true;
};

/**
 * Submit a form.
 * @param {string} formSelector - The CSS selector for the form
 * @returns {Promise<boolean>} - Whether the form was submitted successfully
 */
export const submitForm = async (formSelector) => {
  // Mock implementation
  console.log(`Submitting form ${formSelector}`);
  
  // In a real implementation, this would:
  // 1. Find the form
  // 2. Trigger a submit event
  // 3. Wait for response/redirect
  
  return true;
};

/**
 * Wait for an element to appear on the page.
 * @param {string} selector - The CSS selector for the element
 * @param {number} timeout - The maximum time to wait (in ms)
 * @returns {Promise<boolean>} - Whether the element appeared within the timeout
 */
export const waitForElement = async (selector, timeout = 5000) => {
  // Mock implementation
  console.log(`Waiting for ${selector} (timeout: ${timeout}ms)`);
  
  // In a real implementation, this would use a polling mechanism or MutationObserver
  
  return new Promise((resolve) => {
    const checkElement = () => {
      const element = document.querySelector(selector);
      if (element) {
        resolve(true);
        return;
      }
      
      setTimeout(checkElement, 100);
    };
    
    checkElement();
    
    // Set timeout
    setTimeout(() => {
      resolve(false);
    }, timeout);
  });
};
