<template>
    <div class="carousel-container">
      <button
        v-if="cards.length > 0"
        @click="prevCard"
        class="carousel-nav carousel-prev"
        :disabled="currentIndex === 0"
      >
        &larr;
      </button>
      
      <div class="carousel-wrapper" ref="carouselWrapper">
        <div
          class="carousel-slide"
          :style="{ transform: `translateX(${-currentIndex * 100}%)` }"
          @touchstart="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Карты пользователя - ИЗМЕНЕН key для реактивности -->
          <div
            v-for="(card, index) in mappedCards"
            :key="`${card.id}-${card.cardBalance}`"
            class="carousel-item"
            :class="{ 'active': index === currentIndex }"
          >
            <CardItem
              :card="card"
              :isActive="index === currentIndex"
              @click="$emit('card-click', card.id)"
            />
          </div>
          
          <!-- Кнопка "Заказать новую карту" как последний элемент карусели -->
          <div class="carousel-item add-card-item">
            <div class="add-card-btn" @click="$emit('request-new-card')">
              <div class="add-icon">+</div>
              <div>Заказать новую карту</div>
            </div>
          </div>
        </div>
      </div>
      
      <button
        v-if="cards.length > 0"
        @click="nextCard"
        class="carousel-nav carousel-next"
        :disabled="currentIndex === totalSlides - 1"
      >
        &rarr;
      </button>
      
      <!-- Индикаторы карусели -->
      <div class="carousel-indicators" v-if="totalSlides > 1">
        <div
          v-for="index in totalSlides"
          :key="index - 1"
          @click="goToCard(index - 1)"
          class="indicator"
          :class="{ active: currentIndex === index - 1 }"
        ></div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, defineProps, defineEmits, computed } from 'vue';
  import { storeToRefs } from 'pinia';
  import CardItem from './CardItem.vue';
  import { useCardsStore } from '@/stores/CardsStore';
  
  
  interface Card {
    id: number;
    number: string;
    balance: number;
    currency: string;
    type: 'debit' | 'credit';
  }
  
  const cardsStore = useCardsStore()
  const { cards } = storeToRefs(cardsStore)

  const props = defineProps<{
    cards: Card[];
  }>();
  
  defineEmits(['card-click', 'request-new-card']);
  
  const currentIndex = ref(0);
  
  // Computed property to map cards
  const mappedCards = computed(() => {
    return props.cards.map(card => ({
      ...card,
      cardBalance: card.balance // Example mapping, adjust as needed
    }));
  });
  const touchStartX = ref(0);
  const touchEndX = ref(0);
  const carouselWrapper = ref<HTMLElement | null>(null);
  
  // Вычисляем общее количество слайдов (карты + кнопка добавления)
  const totalSlides = computed(() => {
    // +1 для кнопки "Заказать новую карту"
    return props.cards.length + 1;
  });
  
  // Переход к предыдущей карте
  const prevCard = () => {
    if (currentIndex.value > 0) {
      currentIndex.value--;
    }
  };
  
  // Переход к следующей карте
  const nextCard = () => {
    if (currentIndex.value < totalSlides.value - 1) {
      currentIndex.value++;
    }
  };
  
  // Переход к конкретной карте
  const goToCard = (index: number) => {
    currentIndex.value = index;
  };
  
  // Обработчики свайпа
  const onTouchStart = (e: TouchEvent) => {
    touchStartX.value = e.touches[0].clientX;
  };
  
  const onTouchMove = (e: TouchEvent) => {
    touchEndX.value = e.touches[0].clientX;
  };
  
  const onTouchEnd = () => {
    const wrapperWidth = carouselWrapper.value?.offsetWidth || 300;
    const threshold = wrapperWidth * 0.15; // 15% от ширины для определения свайпа
    
    if (touchStartX.value - touchEndX.value > threshold) {
      // Свайп влево
      nextCard();
    } else if (touchEndX.value - touchStartX.value > threshold) {
      // Свайп вправо
      prevCard();
    }
    
    // Сбрасываем значения
    touchStartX.value = 0;
    touchEndX.value = 0;
  };
  </script>
  
  <style scoped>
  .carousel-container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    width: 100%;
    margin-bottom: 20px;
  }
  
  .carousel-wrapper {
    width: 100%;
    overflow: hidden;
    border-radius: 20px;
  }
  
  .carousel-slide {
    display: flex;
    transition: transform 0.3s ease;
    width: 100%;
  }
  
  .carousel-item {
    flex: 0 0 100%;
    padding: 0 5px;
    box-sizing: border-box;
    transition: transform 0.3s ease;
  }
  
  .carousel-item.active {
    transform: scale(1.02);
  }
  
  .add-card-item {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .add-card-btn {
    min-width: 280px;
    height: 170px;
    border: 2px dashed rgba(255, 255, 255, 0.2);
    border-radius: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 12px;
    color: rgba(255, 255, 255, 0.5);
    background-color: rgba(255, 255, 255, 0.03);
    cursor: pointer;
    transition: all 0.3s;
    width: 100%;
    max-width: 320px;
  }
  
  .add-card-btn:hover {
    border-color: rgba(255, 255, 255, 0.3);
    color: rgba(255, 255, 255, 0.7);
    background-color: rgba(255, 255, 255, 0.05);
  }
  
  .add-icon {
    width: 48px;
    height: 48px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.08);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
  }
  
  .carousel-nav {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    background-color: rgba(255, 255, 255, 0.1);
    border-radius: 50%;
    border: none;
    color: white;
    font-size: 18px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    z-index: 2;
    transition: all 0.2s;
  }
  
  .carousel-nav:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
  
  .carousel-nav:disabled {
    opacity: 0.3;
    cursor: not-allowed;
  }
  
  .carousel-prev {
    left: 10px;
  }
  
  .carousel-next {
    right: 10px;
  }
  
  .carousel-indicators {
    display: flex;
    justify-content: center;
    gap: 8px;
    margin-top: 16px;
  }
  
  .indicator {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background-color: rgba(255, 255, 255, 0.2);
    cursor: pointer;
    transition: all 0.2s;
  }
  
  .indicator.active {
    background-color: rgba(255, 255, 255, 0.7);
    width: 24px;
    border-radius: 4px;
  }
  
  @media (max-width: 768px) {
    .carousel-nav {
      width: 36px;
      height: 36px;
      font-size: 16px;
    }
  }
  </style>