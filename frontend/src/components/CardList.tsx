import React, { useState, useRef, useEffect } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import styles from '../styles/CardList.module.css';

interface Card {
  cardNumber: string;
  type: string;
  balance: number;
}

interface CardsListProps {
  cards: Card[];
}

const CardsList: React.FC<CardsListProps> = ({ cards }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const carouselRef = useRef<HTMLDivElement | null>(null);

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
  };

  const handleScroll = (direction: 'prev' | 'next') => {
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      const firstChild = carouselElement.firstChild as HTMLElement;
      const cardWidth = firstChild?.getBoundingClientRect().width || 320; // 300 + 20 (margin)
      const scrollAmount = direction === 'prev' ? -cardWidth : cardWidth;
      carouselElement.scrollBy({ left: scrollAmount, behavior: 'smooth' });

      if (direction === 'prev') {
        setActiveIndex((prevIndex) => (prevIndex === 0 ? cards.length - 1 : prevIndex - 1));
      } else {
        setActiveIndex((prevIndex) => (prevIndex === cards.length - 1 ? 0 : prevIndex + 1));
      }
    }
  };

  const handleMouseWheel = (e: React.WheelEvent) => {
    if (carouselRef.current) {
      const carouselElement = carouselRef.current;
      carouselElement.scrollLeft += e.deltaY;
    }
  };

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
              <h3>{card.cardNumber}</h3>
              <div className={styles.cardInfo}>
                <div>Тип: {card.type}</div>
                <div>Баланс: {card.balance} ₽</div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.cardInfo}>
          <div>Номер карты: {cards[activeIndex].cardNumber}</div>
          <div>Тип: {cards[activeIndex].type}</div>
          <div>Баланс: {cards[activeIndex].balance} ₽</div>
        </div>
      </div>
    </div>
  );
};

export default CardsList;
