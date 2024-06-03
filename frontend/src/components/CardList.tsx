import React, { useState, useRef, useEffect, useContext } from 'react';
import { FaChevronLeft, FaChevronRight, FaPlus } from 'react-icons/fa';
import styles from '../styles/CardList.module.css';
import { fetchUserCards } from '../api/cards';
import { Context } from '../index';
import TransactionList from './TransactionList';

interface Card {
  id: number;
  cardNumber: string;
  cardType: string;
  cardBalance: number;
  currency: string;
  expirationDate: string;
  cardholderFirstname: string;
  cardholderLastname: string;
}

const currencySymbols: { [key: string]: string } = {
  USD: '$',
  RUB: '₽',
  EUR: '€',
  // Добавьте другие валюты по мере необходимости
};

const currencyPositions: { [key: string]: 'before' | 'after' } = {
  USD: 'before',
  RUB: 'after',
  EUR: 'before',
  // Добавьте другие валюты по мере необходимости
};

const formatCardNumber = (cardNumber: string) => {
  return cardNumber.replace(/(\d{4})(?=\d)/g, '$1 ');
};

const formatExpirationDate = (expirationDate: string) => {
  const [year, month] = expirationDate.split('-');
  return `${month}/${year.slice(2)}`;
};

const getCardImage = (cardType: string) => {
  switch (cardType) {
    case 'MasterCard':
      return '/images/masterCard.png';
    case 'Visa':
      return '/images/visaCard.png';
    case 'МИР':
      return '/images/mirCard.png';
    case 'UnionPay':
      return '/images/UnionPayCard.png';
    default:
      return '/images/defaultCard.png';
  }
};

const CardsList: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showDetails, setShowDetails] = useState(false);
  const [showTransactions, setShowTransactions] = useState(false);
  const { store } = useContext(Context);
  const carouselRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const loadCards = async () => {
      try {
        if (!store.user || !store.user.id) {
          console.error('User ID is missing');
          setLoading(false);
          return;
        }
        const cardsData = await fetchUserCards(store.user.id);
        setCards(cardsData);
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch cards:', error);
        setLoading(false);
      }
    };

    loadCards();
  }, [store.user, store.user.id]);

  useEffect(() => {
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      const firstChild = carouselElement.firstChild as HTMLElement;
      const cardWidth = firstChild?.getBoundingClientRect().width || 320; // 300 + 20 (margin)
      carouselElement.scrollLeft = activeIndex * cardWidth;
    }
  }, [activeIndex]);

  const handleCardChange = (index: number) => {
    setActiveIndex(index);
    setShowDetails(false);
    setShowTransactions(false);
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      const firstChild = carouselElement.firstChild as HTMLElement;
      const cardWidth = firstChild?.getBoundingClientRect().width || 320; // 300 + 20 (margin)
      carouselElement.scrollLeft = index * cardWidth;
    }
  };

  const handleScroll = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      setActiveIndex((prevIndex) => (prevIndex === 0 ? cards.length : prevIndex - 1));
    } else {
      setActiveIndex((prevIndex) => (prevIndex === cards.length ? 0 : prevIndex + 1));
    }
  };

  const handleMouseWheel = (e: React.WheelEvent) => {
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      carouselElement.scrollLeft += e.deltaY;
    }
  };

  const toggleDetails = () => {
    setShowDetails(!showDetails);
    setShowTransactions(false);
  };

  const navigateToForm = () => {
    console.log('Navigate to form');
  };

  const showTransactionHistory = () => {
    setShowTransactions(true);
    setShowDetails(false);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!cards.length) {
    return <div>No cards available.</div>;
  }

  return (
    <div className={styles.cardsList}>
      <div className={styles.cardsContainer}>
        <h2>Ваши карты</h2>
        <button className={`${styles.navigationButton} ${styles.prevButton}`} onClick={() => handleScroll('prev')}><FaChevronLeft /></button>
        <button className={`${styles.navigationButton} ${styles.nextButton}`} onClick={() => handleScroll('next')}><FaChevronRight /></button>
        <div className={styles.cardCarousel} ref={carouselRef} onWheel={handleMouseWheel}>
          {cards.map((card, index) => (
            <div
              key={index}
              className={styles.cardItem}
              onClick={() => handleCardChange(index)}
              style={{
                opacity: index === activeIndex ? 1 : 0.5
              }}
            >
              <div className={styles.cardContent}>
                <img src={getCardImage(card.cardType)} alt={card.cardType} className={styles.cardImage} />
                <h3 className={styles.cardNumber}>{formatCardNumber(card.cardNumber)}</h3>
                <div className={styles.cardExpiration}>{formatExpirationDate(card.expirationDate)}</div>
                <div className={styles.cardholderName}>{card.cardholderFirstname.toUpperCase()} {card.cardholderLastname.toUpperCase()}</div>
              </div>
              <div className={styles.cardInfo}>
                <div>Тип: {card.cardType}</div>
                <div>Баланс: {currencyPositions[card.currency] === 'before' ? `${currencySymbols[card.currency]}${card.cardBalance}` : `${card.cardBalance}${currencySymbols[card.currency]}`}</div>
              </div>
            </div>
          ))}
          <div className={styles.cardItem} onClick={() => console.log('Заказать карту')}>
            <FaPlus size={48} />
            <div className={styles.orderCardText}>Заказать карту</div>
          </div>
        </div>
      </div>
      {cards[activeIndex] && (
        <div className={styles.activeCardInfo}>
          <div className={styles.cardActions}>
            <button onClick={toggleDetails} className={styles.actionButton}>
              О карте
            </button>
            <button onClick={navigateToForm} className={styles.actionButton}>
              Пополнить
            </button>
            <button onClick={showTransactionHistory} className={styles.actionButton}>
              История
            </button>
          </div>
        </div>
      )}
      {showDetails && (
        <div className={styles.cardDetails}>
          <div>Номер карты: {formatCardNumber(cards[activeIndex].cardNumber)}</div>
          <div>Тип: {cards[activeIndex].cardType}</div>
          <div>Баланс: {currencyPositions[cards[activeIndex].currency] === 'before' ? `${currencySymbols[cards[activeIndex].currency]}${cards[activeIndex].cardBalance}` : `${cards[activeIndex].cardBalance}${currencySymbols[cards[activeIndex].currency]}`}</div>
        </div>
      )}
      {showTransactions && (
        <TransactionList cardId={cards[activeIndex].id} />
      )}
    </div>
  );
};

export default CardsList;
