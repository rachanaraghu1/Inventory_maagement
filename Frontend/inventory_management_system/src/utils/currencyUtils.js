// Currency conversion utilities

// Default exchange rate (USD to INR)
const DEFAULT_EXCHANGE_RATE = 83.0;

/**
 * Convert USD to INR
 * @param {number} usdAmount - Amount in US Dollars
 * @param {number} exchangeRate - Exchange rate (default: 83.0)
 * @returns {number} Amount in Indian Rupees
 */
export const convertUSDToINR = (usdAmount, exchangeRate = DEFAULT_EXCHANGE_RATE) => {
  if (!usdAmount || isNaN(usdAmount)) return 0;
  return parseFloat((usdAmount * exchangeRate).toFixed(2));
};

/**
 * Convert INR to USD
 * @param {number} inrAmount - Amount in Indian Rupees
 * @param {number} exchangeRate - Exchange rate (default: 83.0)
 * @returns {number} Amount in US Dollars
 */
export const convertINRToUSD = (inrAmount, exchangeRate = DEFAULT_EXCHANGE_RATE) => {
  if (!inrAmount || isNaN(inrAmount)) return 0;
  return parseFloat((inrAmount / exchangeRate).toFixed(2));
};

/**
 * Format currency for display
 * @param {number} amount - Amount to format
 * @param {string} currency - Currency code ('USD' or 'INR')
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currency = 'USD') => {
  if (!amount || isNaN(amount)) return '0';
  
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  
  return formatter.format(amount);
};

/**
 * Get current exchange rate (placeholder for API integration)
 * @returns {Promise<number>} Current exchange rate
 */
export const getCurrentExchangeRate = async () => {
  // This is a placeholder. In a real app, you would fetch from an API
  // Example: https://api.exchangerate-api.com/v4/latest/USD
  try {
    // Simulate API call
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve(DEFAULT_EXCHANGE_RATE);
      }, 100);
    });
  } catch (error) {
    console.error('Error fetching exchange rate:', error);
    return DEFAULT_EXCHANGE_RATE;
  }
};

/**
 * Convert product prices in bulk
 * @param {Array} products - Array of products with price field
 * @param {string} targetCurrency - Target currency ('USD' or 'INR')
 * @param {number} exchangeRate - Exchange rate
 * @returns {Array} Products with converted prices
 */
export const convertProductPrices = (products, targetCurrency = 'INR', exchangeRate = DEFAULT_EXCHANGE_RATE) => {
  return products.map(product => ({
    ...product,
    price: targetCurrency === 'INR' 
      ? convertUSDToINR(product.price, exchangeRate)
      : convertINRToUSD(product.price, exchangeRate),
    originalPrice: product.price,
    displayCurrency: targetCurrency
  }));
};

// Common conversion examples
export const CONVERSION_EXAMPLES = [
  { usd: 1, inr: 83 },
  { usd: 10, inr: 830 },
  { usd: 50, inr: 4150 },
  { usd: 100, inr: 8300 },
  { usd: 1000, inr: 83000 }
]; 