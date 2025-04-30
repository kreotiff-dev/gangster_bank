import type { Card, Transaction, AnalyticsCategory } from '@/types';

/**
 * Преобразует данные карты с сервера в формат, удобный для отображения
 */
export const mapCardForDisplay = (card: Card): Card => {
  // Преобразуем дату из ISO формата в формат "MM/YY"
  const expirationDate = new Date(card.expirationDate);
  const formattedExpirationDate = `${String(expirationDate.getMonth() + 1).padStart(2, '0')}/${String(expirationDate.getFullYear()).slice(-2)}`;
  
  // Маскируем номер карты для отображения
  const maskedNumber = card.cardNumber.slice(0, 4) + ' **** **** ' + card.cardNumber.slice(-4);
  
  // Приводим тип карты к нужному формату
  const cardType = card.cardType.toLowerCase() as 'debit' | 'credit';
  
  return {
    ...card,
    expirationDate: formattedExpirationDate,
    cardNumber: maskedNumber,
    cardType
  };
};

export const mapCardForCardItem = (card: Card) => {
  // Нам нужно сначала распаковать все поля из card, а затем перезаписать только нужные
  return {
    ...card,
    // Добавляем новые поля, не дублируя существующие
    number: card.cardNumber,
    balance: parseFloat(card.cardBalance.toString()),
    type: card.cardType.toLowerCase() as 'debit' | 'credit'
  };
};

/**
 * Преобразует данные транзакции с сервера в формат для компонента TransactionItem
 */
export const mapTransactionForDisplay = (transaction: Transaction) => {
  // Определяем тип транзакции для отображения (доход/расход)
  const isIncome = ['deposit', 'transfer_in', 'refund'].includes(transaction.transactionType.toLowerCase());
  
  // Форматируем дату транзакции
  const date = new Date(transaction.transactionDate);
  const formattedDate = `${String(date.getDate()).padStart(2, '0')} ${getMonthShortName(date.getMonth())} • ${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  
  // Определяем категорию транзакции
  const category = getCategoryByTransactionType(transaction.transactionType);
  
  return {
    id: transaction.id,
    title: getTitleByTransactionType(transaction.transactionType),
    amount: Math.abs(transaction.amount),
    currency: '₽', // Предполагаем, что валюта всегда рубли
    type: isIncome ? 'income' : 'expense',
    date: formattedDate,
    category
  };
};

/**
 * Преобразует коллекцию транзакций для отображения на графике расходов
 */
export const mapTransactionsForAnalytics = (transactions: Transaction[]): AnalyticsCategory[] => {
  // Фильтруем только расходные транзакции
  const expenses = transactions.filter(t => 
    !['deposit', 'transfer_in', 'refund'].includes(t.transactionType.toLowerCase())
  );
  
  // Группируем по категориям
  const categoryMap = expenses.reduce((acc, transaction) => {
    const category = getCategoryByTransactionType(transaction.transactionType);
    
    if (!acc[category]) {
      acc[category] = 0;
    }
    
    acc[category] += Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);
  
  // Преобразуем в массив категорий с суммами
  return Object.entries(categoryMap).map(([name, amount]) => ({
    name,
    amount,
    color: getCategoryColor(name)
  }));
};

// Вспомогательные функции
const getMonthShortName = (month: number): string => {
  const months = ['янв', 'фев', 'мар', 'апр', 'май', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
  return months[month];
};

const getCategoryByTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'payment': 'shopping',
    'withdrawal': 'withdrawal',
    'transfer_out': 'transfer',
    'transfer_in': 'transfer',
    'utility_payment': 'utility',
    'mobile_payment': 'mobile',
    'food_payment': 'food',
    'transport_payment': 'transport',
    'entertainment_payment': 'entertainment'
  };
  
  return typeMap[type.toLowerCase()] || 'other';
};

const getTitleByTransactionType = (type: string): string => {
  const typeMap: Record<string, string> = {
    'payment': 'Оплата',
    'withdrawal': 'Снятие наличных',
    'transfer_out': 'Перевод',
    'transfer_in': 'Поступление',
    'utility_payment': 'Оплата ЖКХ',
    'mobile_payment': 'Оплата связи',
    'food_payment': 'Продукты',
    'transport_payment': 'Транспорт',
    'entertainment_payment': 'Развлечения'
  };
  
  return typeMap[type.toLowerCase()] || 'Операция';
};

const getCategoryColor = (category: string): string => {
  const colorMap: Record<string, string> = {
    'shopping': '#4a6cf7',
    'food': '#f59e0b',
    'entertainment': '#ec4899',
    'transport': '#8b5cf6',
    'utility': '#14b8a6',
    'mobile': '#10b981',
    'transfer': '#6366f1',
    'withdrawal': '#f43f5e',
    'other': '#9ca3af'
  };
  
  return colorMap[category] || '#9ca3af';
};