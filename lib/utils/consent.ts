import { ConsentRecord } from '../types';

// Storage key for consent data
const CONSENT_STORAGE_KEY = 'waitly_user_consents';

// Simple consent data interface
export interface UserConsentData {
  email: string;
  consents: {
    terms: boolean;
    privacy: boolean;
    marketing: boolean;
  };
  timestamp: Date;
}

// Simple consent storage utilities
export class ConsentStorage {
  // Get all consent data from localStorage
  static getAllConsents(): UserConsentData[] {
    try {
      const data = localStorage.getItem(CONSENT_STORAGE_KEY);
      if (!data) return [];
      
      const parsed = JSON.parse(data);
      return parsed.map((item: UserConsentData) => ({
        ...item,
        timestamp: new Date(item.timestamp),
      }));
    } catch (error) {
      console.error('Error loading consent data from storage:', error);
      return [];
    }
  }

  // Save all consent data to localStorage
  static saveAllConsents(consents: UserConsentData[]): void {
    try {
      localStorage.setItem(CONSENT_STORAGE_KEY, JSON.stringify(consents));
    } catch (error) {
      console.error('Error saving consent data to storage:', error);
    }
  }

  // Create consent records from form data (for signup)
  static createConsentRecords(
    email: string,
    consents: { terms: boolean; privacy: boolean; marketing: boolean }
  ): ConsentRecord[] {
    // Store the consent data
    this.saveUserConsents(email, consents);

    // Return ConsentRecord format for compatibility with existing user storage
    const timestamp = new Date();
    const mockIpAddress = '127.0.0.1';

    return [
      {
        type: 'terms',
        granted: consents.terms,
        timestamp,
        ipAddress: mockIpAddress,
        version: '1.0',
      },
      {
        type: 'privacy',
        granted: consents.privacy,
        timestamp,
        ipAddress: mockIpAddress,
        version: '1.0',
      },
      {
        type: 'marketing',
        granted: consents.marketing,
        timestamp,
        ipAddress: mockIpAddress,
        version: '1.0',
      },
    ];
  }

  // Save user consent preferences
  static saveUserConsents(
    email: string,
    consents: { terms: boolean; privacy: boolean; marketing: boolean }
  ): void {
    const allConsents = this.getAllConsents();
    const existingIndex = allConsents.findIndex(
      item => item.email.toLowerCase() === email.toLowerCase()
    );

    const consentData: UserConsentData = {
      email: email.toLowerCase(),
      consents,
      timestamp: new Date(),
    };

    if (existingIndex >= 0) {
      // Update existing consent
      allConsents[existingIndex] = consentData;
    } else {
      // Add new consent
      allConsents.push(consentData);
    }

    this.saveAllConsents(allConsents);
  }

  // Get user consent status
  static getUserConsentStatus(email: string): { terms: boolean; privacy: boolean; marketing: boolean } {
    const allConsents = this.getAllConsents();
    const userConsent = allConsents.find(
      item => item.email.toLowerCase() === email.toLowerCase()
    );

    return userConsent?.consents || {
      terms: false,
      privacy: false,
      marketing: false,
    };
  }
}