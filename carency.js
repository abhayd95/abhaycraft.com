document.addEventListener('DOMContentLoaded', () => {
  // DOM Elements
  const amountInput = document.querySelector('.amount input');
  const fromSelect = document.getElementById('from-currency');
  const toSelect = document.getElementById('to-currency');
  const swapBtn = document.getElementById('swap-btn');
  const msgElement = document.querySelector('.msg');
  const convertBtn = document.getElementById('convert-btn');
  const fromFlag = document.getElementById('from-flag');
  const toFlag = document.getElementById('to-flag');
  
  // Currency flags mapping (ISO country codes)
  const currencyFlags = {
    USD: 'https://flagsapi.com/US/flat/64.png',
    EUR: 'https://flagsapi.com/EU/flat/64.png',
    GBP: 'https://flagsapi.com/GB/flat/64.png',
    JPY: 'https://flagsapi.com/JP/flat/64.png',
    AUD: 'https://flagsapi.com/AU/flat/64.png',
    CAD: 'https://flagsapi.com/CA/flat/64.png',
    CHF: 'https://flagsapi.com/CH/flat/64.png',
    CNY: 'https://flagsapi.com/CN/flat/64.png',
    INR: 'https://flagsapi.com/IN/flat/64.png',
    SGD: 'https://flagsapi.com/SG/flat/64.png',
    AED: 'https://flagsapi.com/AE/flat/64.png',
    SAR: 'https://flagsapi.com/SA/flat/64.png',
    MYR: 'https://flagsapi.com/MY/flat/64.png',
    THB: 'https://flagsapi.com/TH/flat/64.png',
    KRW: 'https://flagsapi.com/KR/flat/64.png',
    BRL: 'https://flagsapi.com/BR/flat/64.png',
    MXN: 'https://flagsapi.com/MX/flat/64.png',
    ZAR: 'https://flagsapi.com/ZA/flat/64.png',
    RUB: 'https://flagsapi.com/RU/flat/64.png'
  };
  
  // Exchange rates (initial values - will be updated)
  let exchangeRates = {};
  let lastFetchTime = 0;
  
  // Update flags when currency changes
  function updateFlags() {
    fromFlag.src = currencyFlags[fromSelect.value] || 'https://flagsapi.com/UN/flat/64.png';
    toFlag.src = currencyFlags[toSelect.value] || 'https://flagsapi.com/UN/flat/64.png';
  }
  
  // Fetch exchange rates from API (simulated)
  async function fetchExchangeRates() {
    try {
      // Show loading state
      convertBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Fetching Rates...';
      convertBtn.disabled = true;
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Generate realistic exchange rates with slight fluctuations
      const baseRates = {
        USD: 1,         // Base currency (USD)
        EUR: 0.93,
        GBP: 0.79,
        JPY: 151.50,
        AUD: 1.52,
        CAD: 1.36,
        CHF: 0.90,
        CNY: 7.24,
        INR: 83.50,
        SGD: 1.35,
        AED: 3.67,
        SAR: 3.75,
        MYR: 4.74,
        THB: 36.50,
        KRW: 1342.00,
        BRL: 5.05,
        MXN: 16.83,
        ZAR: 18.90,
        RUB: 92.45
      };
      
      // Apply random fluctuation (-2% to +2%)
      exchangeRates = {};
      for (const [currency, rate] of Object.entries(baseRates)) {
        const fluctuation = 1 + ((Math.random() * 0.04) - 0.02);
        exchangeRates[currency] = parseFloat((rate * fluctuation).toFixed(4));
      }
      
      lastFetchTime = Date.now();
      return exchangeRates;
    } catch (error) {
      console.error('Error fetching exchange rates:', error);
      throw error;
    } finally {
      // Restore button state
      convertBtn.textContent = 'Get Exchange Rate';
      convertBtn.disabled = false;
    }
  }
  
  // Calculate and display conversion
  async function calculateConversion(forceRefresh = false) {
    try {
      // Validate amount input
      const amount = parseFloat(amountInput.value);
      if (isNaN(amount) || amount <= 0) {
        msgElement.textContent = 'Please enter a valid positive amount';
        msgElement.style.color = 'red';
        return;
      }
      
      // If rates are empty or forced refresh or rates are older than 5 minutes
      if (Object.keys(exchangeRates).length === 0 || forceRefresh || (Date.now() - lastFetchTime) > 300000) {
        await fetchExchangeRates();
      }
      
      const fromCurrency = fromSelect.value;
      const toCurrency = toSelect.value;
      
      // Check if currencies are available
      if (!exchangeRates[fromCurrency] || !exchangeRates[toCurrency]) {
        msgElement.textContent = 'Currency not supported';
        msgElement.style.color = 'red';
        return;
      }
      
      // Calculate conversion rate (all rates are relative to USD)
      const rate = exchangeRates[toCurrency] / exchangeRates[fromCurrency];
      const convertedAmount = (amount * rate).toFixed(2);
      const rateDisplay = rate.toFixed(6);
      
      msgElement.innerHTML = `
        <strong>${amount} ${fromCurrency} = ${convertedAmount} ${toCurrency}</strong><br>
        <small>1 ${fromCurrency} = ${rateDisplay} ${toCurrency}</small>
      `;
      msgElement.style.color = '#333';
    } catch (error) {
      msgElement.textContent = 'Error fetching exchange rates. Please try again.';
      msgElement.style.color = 'red';
      console.error('Conversion error:', error);
    }
  }
  
  // Swap currencies
  function swapCurrencies() {
    const temp = fromSelect.value;
    fromSelect.value = toSelect.value;
    toSelect.value = temp;
    updateFlags();
    calculateConversion();
  }
  
  // Event Listeners
  fromSelect.addEventListener('change', updateFlags);
  toSelect.addEventListener('change', updateFlags);
  
  amountInput.addEventListener('input', () => {
    // Only calculate if there's a valid number
    if (amountInput.value && !isNaN(amountInput.value)) {
      calculateConversion();
    }
  });
  
  swapBtn.addEventListener('click', swapCurrencies);
  
  convertBtn.addEventListener('click', async (e) => {
    e.preventDefault();
    await calculateConversion(true); // Force refresh rates
  });
  
  // Initialize
  updateFlags();
  calculateConversion(); // Initial calculation with default values
});