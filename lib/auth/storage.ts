import { UserRegistration, VerificationToken } from '../types';

// Storage keys
const STORAGE_KEYS = {
  USERS: 'waitly_users',
  CURRENT_USER: 'waitly_current_user',
  VERIFICATION_TOKENS: 'waitly_verification_tokens',
  SESSION: 'waitly_session',
} as const;

// Session data interface
export interface SessionData {
  userId: string;
  email: string;
  expiresAt: Date;
}

// User storage utilities
export class UserStorage {
  // Get all users from localStorage
  static getUsers(): UserRegistration[] {
    try {
      const users = localStorage.getItem(STORAGE_KEYS.USERS);
      if (!users) return [];
      
      const parsed = JSON.parse(users);
      return parsed.map((user: any) => ({
        ...user,
        createdAt: new Date(user.createdAt),
        verifiedAt: user.verifiedAt ? new Date(user.verifiedAt) : undefined,
        consents: user.consents.map((consent: any) => ({
          ...consent,
          timestamp: new Date(consent.timestamp),
        })),
      }));
    } catch (error) {
      console.error('Error loading users from storage:', error);
      return [];
    }
  }

  // Save users to localStorage
  static saveUsers(users: UserRegistration[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to storage:', error);
    }
  }

  // Find user by email
  static findUserByEmail(email: string): UserRegistration | null {
    const users = this.getUsers();
    return users.find(user => user.email.toLowerCase() === email.toLowerCase()) || null;
  }

  // Find user by ID
  static findUserById(id: string): UserRegistration | null {
    const users = this.getUsers();
    return users.find(user => user.id === id) || null;
  }

  // Create new user
  static createUser(userData: Omit<UserRegistration, 'id' | 'createdAt'>): UserRegistration {
    const users = this.getUsers();
    
    const newUser: UserRegistration = {
      ...userData,
      id: crypto.randomUUID(),
      createdAt: new Date(),
    };

    users.push(newUser);
    this.saveUsers(users);
    
    return newUser;
  }

  // Update user
  static updateUser(userId: string, updates: Partial<UserRegistration>): UserRegistration | null {
    const users = this.getUsers();
    const userIndex = users.findIndex(user => user.id === userId);
    
    if (userIndex === -1) return null;

    const updatedUser = {
      ...users[userIndex],
      ...updates,
    };

    users[userIndex] = updatedUser;
    this.saveUsers(users);
    
    return updatedUser;
  }

  // Delete user
  static deleteUser(userId: string): boolean {
    const users = this.getUsers();
    const filteredUsers = users.filter(user => user.id !== userId);
    
    if (filteredUsers.length === users.length) return false;
    
    this.saveUsers(filteredUsers);
    return true;
  }
}

// Session storage utilities
export class SessionStorage {
  // Get current session
  static getSession(): SessionData | null {
    try {
      const session = localStorage.getItem(STORAGE_KEYS.SESSION);
      if (!session) return null;
      
      const parsed = JSON.parse(session);
      const sessionData = {
        ...parsed,
        expiresAt: new Date(parsed.expiresAt),
      };

      // Check if session is expired
      if (sessionData.expiresAt < new Date()) {
        this.clearSession();
        return null;
      }

      return sessionData;
    } catch (error) {
      console.error('Error loading session from storage:', error);
      return null;
    }
  }

  // Create new session
  static createSession(userId: string, email: string, durationHours: number = 24): SessionData {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const sessionData: SessionData = {
      userId,
      email,
      expiresAt,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(sessionData));
    } catch (error) {
      console.error('Error saving session to storage:', error);
    }

    return sessionData;
  }

  // Clear current session
  static clearSession(): void {
    try {
      localStorage.removeItem(STORAGE_KEYS.SESSION);
    } catch (error) {
      console.error('Error clearing session from storage:', error);
    }
  }

  // Extend session expiration
  static extendSession(durationHours: number = 24): SessionData | null {
    const currentSession = this.getSession();
    if (!currentSession) return null;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + durationHours);

    const updatedSession = {
      ...currentSession,
      expiresAt,
    };

    try {
      localStorage.setItem(STORAGE_KEYS.SESSION, JSON.stringify(updatedSession));
    } catch (error) {
      console.error('Error extending session:', error);
      return null;
    }

    return updatedSession;
  }
}

// Verification token storage utilities
export class VerificationTokenStorage {
  // Get all verification tokens
  static getTokens(): VerificationToken[] {
    try {
      const tokens = localStorage.getItem(STORAGE_KEYS.VERIFICATION_TOKENS);
      if (!tokens) return [];
      
      const parsed = JSON.parse(tokens);
      return parsed.map((token: any) => ({
        ...token,
        expiresAt: new Date(token.expiresAt),
      }));
    } catch (error) {
      console.error('Error loading verification tokens from storage:', error);
      return [];
    }
  }

  // Save verification tokens
  static saveTokens(tokens: VerificationToken[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.VERIFICATION_TOKENS, JSON.stringify(tokens));
    } catch (error) {
      console.error('Error saving verification tokens to storage:', error);
    }
  }

  // Create verification token
  static createToken(email: string, expirationHours: number = 24): VerificationToken {
    const tokens = this.getTokens();
    
    // Generate a random token
    const token = crypto.randomUUID() + '-' + Date.now().toString(36);
    
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + expirationHours);

    const verificationToken: VerificationToken = {
      token,
      email: email.toLowerCase(),
      expiresAt,
      used: false,
    };

    tokens.push(verificationToken);
    this.saveTokens(tokens);
    
    return verificationToken;
  }

  // Find token by token string
  static findToken(tokenString: string): VerificationToken | null {
    const tokens = this.getTokens();
    return tokens.find(token => token.token === tokenString) || null;
  }

  // Use token (mark as used)
  static useToken(tokenString: string): VerificationToken | null {
    const tokens = this.getTokens();
    const tokenIndex = tokens.findIndex(token => token.token === tokenString);
    
    if (tokenIndex === -1) return null;

    const token = tokens[tokenIndex];
    
    // Check if token is expired
    if (token.expiresAt < new Date()) return null;
    
    // Check if token is already used
    if (token.used) return null;

    // Mark token as used
    tokens[tokenIndex] = { ...token, used: true };
    this.saveTokens(tokens);
    
    return tokens[tokenIndex];
  }

  // Clean up expired tokens
  static cleanupExpiredTokens(): void {
    const tokens = this.getTokens();
    const now = new Date();
    const validTokens = tokens.filter(token => token.expiresAt > now);
    
    if (validTokens.length !== tokens.length) {
      this.saveTokens(validTokens);
    }
  }
}