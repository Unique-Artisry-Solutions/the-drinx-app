// Enhanced Payment Method Validation with BIN and Country Restrictions
// Level 3: Advanced Security Measures

export interface BinInfo {
  bin: string;
  brand: string;
  type: string;
  issuingBank: string;
  countryCode: string;
  countryName: string;
  isRestricted: boolean;
  riskLevel: 'low' | 'medium' | 'high';
}

export interface CountryRestriction {
  countryCode: string;
  countryName: string;
  restrictionType: 'blocked' | 'restricted' | 'allowed';
  restrictionReason?: string;
  isActive: boolean;
}

export interface PaymentMethodValidationResult {
  isValid: boolean;
  binInfo?: BinInfo;
  countryRestriction?: CountryRestriction;
  riskAssessment: {
    score: number;
    level: 'low' | 'medium' | 'high';
    factors: string[];
  };
  errors: string[];
  warnings: string[];
}

class PaymentMethodValidator {
  private readonly BIN_CACHE = new Map<string, BinInfo>();
  private readonly CACHE_EXPIRY = 24 * 60 * 60 * 1000; // 24 hours

  // Comprehensive BIN ranges for major card networks
  private readonly BIN_RANGES = {
    visa: [
      { start: 4000000, end: 4999999 }
    ],
    mastercard: [
      { start: 5100000, end: 5599999 },
      { start: 2200000, end: 2720999 }
    ],
    amex: [
      { start: 340000, end: 349999 },
      { start: 370000, end: 379999 }
    ],
    discover: [
      { start: 6011000, end: 6011999 },
      { start: 6440000, end: 6499999 },
      { start: 6500000, end: 6599999 }
    ],
    dinersclub: [
      { start: 300000, end: 305999 },
      { start: 360000, end: 369999 },
      { start: 380000, end: 399999 }
    ],
    jcb: [
      { start: 3528000, end: 3589999 }
    ]
  };

  // High-risk countries (example list)
  private readonly HIGH_RISK_COUNTRIES = [
    'AF', 'BY', 'CD', 'CF', 'CU', 'ER', 'GN', 'GW', 'HT', 'IR', 
    'IQ', 'KP', 'LB', 'LR', 'LY', 'MM', 'NI', 'PK', 'RU', 'SO', 
    'SS', 'SD', 'SY', 'UA', 'VE', 'YE', 'ZW'
  ];

  /**
   * Validates payment method with BIN lookup and country restrictions
   */
  public async validatePaymentMethod(
    cardNumber: string,
    clientCountry?: string
  ): Promise<PaymentMethodValidationResult> {
    const errors: string[] = [];
    const warnings: string[] = [];
    const riskFactors: string[] = [];
    let riskScore = 0;

    // Basic card number validation
    const cardValidation = this.validateCardNumber(cardNumber);
    if (!cardValidation.isValid) {
      errors.push(...cardValidation.errors);
    }

    // Extract BIN (first 6-8 digits)
    const bin = this.extractBin(cardNumber);
    let binInfo: BinInfo | undefined;
    let countryRestriction: CountryRestriction | undefined;

    if (bin) {
      // BIN lookup
      binInfo = await this.lookupBin(bin);
      
      if (binInfo) {
        // Country restriction check
        countryRestriction = await this.checkCountryRestriction(binInfo.countryCode);
        
        if (countryRestriction) {
          switch (countryRestriction.restrictionType) {
            case 'blocked':
              errors.push(`Payments from ${countryRestriction.countryName} are not permitted`);
              riskScore += 100;
              break;
            case 'restricted':
              warnings.push(`Payments from ${countryRestriction.countryName} require additional verification`);
              riskScore += 30;
              riskFactors.push('restricted_country');
              break;
          }
        }

        // Risk assessment based on BIN info
        if (this.HIGH_RISK_COUNTRIES.includes(binInfo.countryCode)) {
          riskScore += 40;
          riskFactors.push('high_risk_country');
        }

        if (binInfo.riskLevel === 'high') {
          riskScore += 30;
          riskFactors.push('high_risk_issuer');
        } else if (binInfo.riskLevel === 'medium') {
          riskScore += 15;
          riskFactors.push('medium_risk_issuer');
        }

        // Check for prepaid cards (higher risk)
        if (binInfo.type.toLowerCase().includes('prepaid')) {
          riskScore += 20;
          riskFactors.push('prepaid_card');
        }

        // Check for virtual/online-only cards
        if (binInfo.type.toLowerCase().includes('virtual')) {
          riskScore += 25;
          riskFactors.push('virtual_card');
        }
      } else {
        warnings.push('Could not verify card issuer information');
        riskScore += 10;
        riskFactors.push('unknown_issuer');
      }
    }

    // Geographic risk assessment (if client country differs from card country)
    if (clientCountry && binInfo && clientCountry !== binInfo.countryCode) {
      const distance = this.getCountryDistance(clientCountry, binInfo.countryCode);
      if (distance > 5000) { // More than 5000km apart
        riskScore += 15;
        riskFactors.push('geographic_anomaly');
        warnings.push('Card issued in a different region than transaction location');
      }
    }

    // Determine risk level
    let riskLevel: 'low' | 'medium' | 'high' = 'low';
    if (riskScore >= 70) riskLevel = 'high';
    else if (riskScore >= 30) riskLevel = 'medium';

    return {
      isValid: errors.length === 0,
      binInfo,
      countryRestriction,
      riskAssessment: {
        score: Math.min(100, riskScore),
        level: riskLevel,
        factors: riskFactors
      },
      errors,
      warnings
    };
  }

  /**
   * Basic Luhn algorithm validation
   */
  private validateCardNumber(cardNumber: string): { isValid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (!cardNumber) {
      errors.push('Card number is required');
      return { isValid: false, errors };
    }

    // Remove spaces and non-digit characters
    const cleaned = cardNumber.replace(/\D/g, '');
    
    if (cleaned.length < 13 || cleaned.length > 19) {
      errors.push('Card number must be between 13 and 19 digits');
    }

    // Luhn algorithm
    if (!this.luhnCheck(cleaned)) {
      errors.push('Invalid card number');
    }

    // Check for test card numbers in production
    if (this.isTestCardNumber(cleaned)) {
      errors.push('Test card numbers are not allowed');
    }

    return { isValid: errors.length === 0, errors };
  }

  /**
   * Luhn algorithm implementation
   */
  private luhnCheck(cardNumber: string): boolean {
    let sum = 0;
    let isEven = false;

    for (let i = cardNumber.length - 1; i >= 0; i--) {
      let digit = parseInt(cardNumber[i]);

      if (isEven) {
        digit *= 2;
        if (digit > 9) {
          digit = digit % 10 + 1;
        }
      }

      sum += digit;
      isEven = !isEven;
    }

    return sum % 10 === 0;
  }

  /**
   * Extract BIN from card number
   */
  private extractBin(cardNumber: string): string | null {
    const cleaned = cardNumber.replace(/\D/g, '');
    if (cleaned.length < 6) return null;
    
    // Use first 8 digits for better accuracy, fallback to 6
    return cleaned.length >= 8 ? cleaned.substring(0, 8) : cleaned.substring(0, 6);
  }

  /**
   * Lookup BIN information (in production, this would query the database)
   */
  private async lookupBin(bin: string): Promise<BinInfo | null> {
    // Check cache first
    const cached = this.BIN_CACHE.get(bin);
    if (cached) return cached;

    try {
      // In production, this would query the bin_database table
      // For now, we'll simulate BIN lookup
      const brand = this.identifyCardBrand(bin);
      const mockBinInfo: BinInfo = {
        bin,
        brand,
        type: 'credit',
        issuingBank: 'Unknown Bank',
        countryCode: 'US', // This would come from actual BIN database
        countryName: 'United States',
        isRestricted: false,
        riskLevel: 'low'
      };

      // Cache the result
      this.BIN_CACHE.set(bin, mockBinInfo);
      
      return mockBinInfo;
    } catch (error) {
      console.error('BIN lookup failed:', error);
      return null;
    }
  }

  /**
   * Identify card brand from BIN
   */
  private identifyCardBrand(bin: string): string {
    const binNumber = parseInt(bin);

    for (const [brand, ranges] of Object.entries(this.BIN_RANGES)) {
      for (const range of ranges) {
        if (binNumber >= range.start && binNumber <= range.end) {
          return brand;
        }
      }
    }

    return 'unknown';
  }

  /**
   * Check country restrictions (would query payment_country_restrictions table)
   */
  private async checkCountryRestriction(countryCode: string): Promise<CountryRestriction | null> {
    try {
      // In production, this would query the database
      // For now, simulate with HIGH_RISK_COUNTRIES
      if (this.HIGH_RISK_COUNTRIES.includes(countryCode)) {
        return {
          countryCode,
          countryName: this.getCountryName(countryCode),
          restrictionType: 'restricted',
          restrictionReason: 'High-risk country',
          isActive: true
        };
      }

      return null;
    } catch (error) {
      console.error('Country restriction check failed:', error);
      return null;
    }
  }

  /**
   * Check if card number is a known test number
   */
  private isTestCardNumber(cardNumber: string): boolean {
    const testNumbers = [
      '4242424242424242', // Visa test
      '4000000000000002', // Visa test
      '5555555555554444', // Mastercard test
      '378282246310005',  // Amex test
      '30569309025904',   // Diners test
      '6011111111111117'  // Discover test
    ];

    return testNumbers.includes(cardNumber);
  }

  /**
   * Get country name from code (simplified)
   */
  private getCountryName(countryCode: string): string {
    const countries: Record<string, string> = {
      'US': 'United States',
      'CA': 'Canada',
      'GB': 'United Kingdom',
      'FR': 'France',
      'DE': 'Germany',
      'RU': 'Russia',
      'CN': 'China',
      // Add more as needed
    };

    return countries[countryCode] || 'Unknown Country';
  }

  /**
   * Simplified distance calculation between countries
   */
  private getCountryDistance(country1: string, country2: string): number {
    // In production, this would use actual geographic data
    // For now, return a mock distance
    if (country1 === country2) return 0;
    
    // Different continents = high distance
    const continents: Record<string, string> = {
      'US': 'NA', 'CA': 'NA', 'MX': 'NA',
      'GB': 'EU', 'FR': 'EU', 'DE': 'EU',
      'RU': 'AS', 'CN': 'AS', 'JP': 'AS',
      'AU': 'OC', 'NZ': 'OC'
    };

    const continent1 = continents[country1] || 'Unknown';
    const continent2 = continents[country2] || 'Unknown';

    return continent1 !== continent2 ? 8000 : 2000;
  }
}

export const paymentMethodValidator = new PaymentMethodValidator();

/**
 * Utility function for quick payment method validation
 */
export async function validatePaymentMethodQuick(
  cardNumber: string,
  clientCountry?: string
): Promise<{ isValid: boolean; errors: string[]; riskLevel: string }> {
  const result = await paymentMethodValidator.validatePaymentMethod(cardNumber, clientCountry);
  
  return {
    isValid: result.isValid,
    errors: result.errors,
    riskLevel: result.riskAssessment.level
  };
}