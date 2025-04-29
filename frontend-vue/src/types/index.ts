export interface User {
    id: number;
    phone: string;
    email: string;
    firstName: string;
    lastName: string;
    confirmed: boolean;
  }
  
  export interface Card {
    id: number;
    userId: number;
    cardNumber: string;
    expirationDate: string;
    cvv?: string; // Необязательное поле, обычно не возвращается с сервера
    cardLimit?: number;
    cardBalance: number;
    lastUsageDate?: string;
    cardCategory: string;
    cardStatus: string;
    currency: string;
    securityParams?: string;
    cardholderFirstname: string;
    cardholderLastname: string;
    cardType: 'debit' | 'credit';
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface Transaction {
    id: number;
    cardId: number;
    transactionDate: string;
    amount: number;
    transactionType: string;
    transactionStatus: string;
    createdAt?: string;
    updatedAt?: string;
  }
  
  export interface TransferData {
    fromCardId: number;
    toCardId?: number;
    toCardNumber?: string;
    toPhoneNumber?: string;
    amount: number;
    comment?: string;
  }
  
  export interface AnalyticsCategory {
    name: string;
    amount: number;
    color?: string;
  }
  