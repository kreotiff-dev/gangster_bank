<template>
    <div class="expense-chart-container">
      <div class="chart-header">
        <h3 class="chart-title">Расходы по категориям</h3>
        <div class="period-selector">
          <div 
            v-for="period in periods" 
            :key="period.value" 
            class="period" 
            :class="{ active: selectedPeriod === period.value }"
            @click="selectedPeriod = period.value"
          >
            {{ period.label }}
          </div>
        </div>
      </div>
      
      <div class="chart-content">
        <div class="pie-chart-wrapper">
          <div class="pie-chart">
            <div 
              v-for="(segment, index) in chartSegments" 
              :key="index" 
              class="chart-segment" 
              :style="{
                background: segment.color,
                clipPath: `polygon(50% 50%, ${getSegmentPoints(index)})`
              }"
              @mouseenter="hoveredCategory = segment.name"
              @mouseleave="hoveredCategory = null"
            ></div>
            <div class="total-amount">{{ totalFormatted }}</div>
          </div>
        </div>
        
        <div class="categories-legend">
          <div 
            v-for="category in categories" 
            :key="category.name" 
            class="category-item"
            :class="{ 'category-active': hoveredCategory === category.name }"
            @mouseenter="hoveredCategory = category.name"
            @mouseleave="hoveredCategory = null"
          >
            <div class="category-color" :style="{ backgroundColor: category.color }"></div>
            <div class="category-info">
              <div class="category-name">{{ category.name }}</div>
              <div class="category-amount">{{ formatCurrency(category.amount) }}</div>
            </div>
            <div class="category-percentage">{{ calculatePercentage(category.amount) }}%</div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, watch, onMounted } from 'vue'
  
  // Пропсы
  interface Props {
    cardId?: number | string
  }
  const props = withDefaults(defineProps<Props>(), {
    cardId: undefined
  })
  
  // Периоды для выбора
  const periods = [
    { label: 'Неделя', value: 'week' },
    { label: 'Месяц', value: 'month' },
    { label: '3 месяца', value: 'quarter' },
    { label: 'Год', value: 'year' }
  ]
  
  const selectedPeriod = ref('month')
  const hoveredCategory = ref<string | null>(null)
  
  // Моковые данные для категорий расходов
  // В реальном приложении эти данные будут загружаться из API
  const categories = ref([
    { name: 'Покупки', amount: 12760, color: '#4a6cf7' },
    { name: 'Продукты', amount: 8340, color: '#f59e0b' },
    { name: 'Развлечения', amount: 5200, color: '#ec4899' },
    { name: 'Транспорт', amount: 3800, color: '#8b5cf6' },
    { name: 'ЖКХ', amount: 5240, color: '#14b8a6' },
    { name: 'Связь', amount: 1900, color: '#10b981' }
  ])
  
  // Общая сумма расходов
  const totalAmount = computed(() => {
    return categories.value.reduce((sum, category) => sum + category.amount, 0)
  })
  
  // Форматированная общая сумма
  const totalFormatted = computed(() => {
    return formatCurrency(totalAmount.value)
  })
  
  // Вычисляем сегменты для круговой диаграммы
  const chartSegments = computed(() => {
    let startAngle = 0
    const segments = []
    
    for (const category of categories.value) {
      const percentage = (category.amount / totalAmount.value) * 100
      const angle = (percentage / 100) * 360
      const endAngle = startAngle + angle
      
      segments.push({
        name: category.name,
        startAngle,
        endAngle,
        color: category.color
      })
      
      startAngle = endAngle
    }
    
    return segments
  })
  
  // Получение координат для сегмента круговой диаграммы
  const getSegmentPoints = (index: number) => {
    const segment = chartSegments.value[index]
    if (!segment) return ''
    
    const { startAngle, endAngle } = segment
    
    // Преобразуем углы в радианы и вычисляем точки
    const points = []
    
    // Начальная точка
    const startX = 50 + 50 * Math.cos(degreesToRadians(startAngle))
    const startY = 50 + 50 * Math.sin(degreesToRadians(startAngle))
    points.push(`${startX}% ${startY}%`)
    
    // Добавляем промежуточные точки для скругления
    const steps = Math.ceil((endAngle - startAngle) / 5)
    for (let i = 1; i < steps; i++) {
      const angle = startAngle + (endAngle - startAngle) * (i / steps)
      const x = 50 + 50 * Math.cos(degreesToRadians(angle))
      const y = 50 + 50 * Math.sin(degreesToRadians(angle))
      points.push(`${x}% ${y}%`)
    }
    
    // Конечная точка
    const endX = 50 + 50 * Math.cos(degreesToRadians(endAngle))
    const endY = 50 + 50 * Math.sin(degreesToRadians(endAngle))
    points.push(`${endX}% ${endY}%`)
    
    return points.join(', ')
  }
  
  // Вспомогательные функции
  const degreesToRadians = (degrees: number) => {
    return (degrees - 90) * (Math.PI / 180)
  }
  
  const formatCurrency = (amount: number) => {
    return amount.toLocaleString('ru-RU') + ' ₽'
  }
  
  const calculatePercentage = (amount: number) => {
    return Math.round((amount / totalAmount.value) * 100)
  }
  
  // Загрузка данных при изменении периода или карты
  const fetchExpenseData = async () => {
    // В реальном приложении здесь был бы запрос к API
    // Для демонстрации используем разные моковые данные для разных периодов
    
    let mockData
    
    switch (selectedPeriod.value) {
      case 'week':
        mockData = [
          { name: 'Покупки', amount: 4320, color: '#4a6cf7' },
          { name: 'Продукты', amount: 2150, color: '#f59e0b' },
          { name: 'Развлечения', amount: 1800, color: '#ec4899' },
          { name: 'Транспорт', amount: 850, color: '#8b5cf6' },
          { name: 'ЖКХ', amount: 0, color: '#14b8a6' },
          { name: 'Связь', amount: 0, color: '#10b981' }
        ]
        break
      case 'quarter':
        mockData = [
          { name: 'Покупки', amount: 38280, color: '#4a6cf7' },
          { name: 'Продукты', amount: 25020, color: '#f59e0b' },
          { name: 'Развлечения', amount: 15600, color: '#ec4899' },
          { name: 'Транспорт', amount: 11400, color: '#8b5cf6' },
          { name: 'ЖКХ', amount: 15720, color: '#14b8a6' },
          { name: 'Связь', amount: 5700, color: '#10b981' }
        ]
        break
      case 'year':
        mockData = [
          { name: 'Покупки', amount: 153120, color: '#4a6cf7' },
          { name: 'Продукты', amount: 100080, color: '#f59e0b' },
          { name: 'Развлечения', amount: 62400, color: '#ec4899' },
          { name: 'Транспорт', amount: 45600, color: '#8b5cf6' },
          { name: 'ЖКХ', amount: 62880, color: '#14b8a6' },
          { name: 'Связь', amount: 22800, color: '#10b981' }
        ]
        break
      default: // month
        mockData = [
          { name: 'Покупки', amount: 12760, color: '#4a6cf7' },
          { name: 'Продукты', amount: 8340, color: '#f59e0b' },
          { name: 'Развлечения', amount: 5200, color: '#ec4899' },
          { name: 'Транспорт', amount: 3800, color: '#8b5cf6' },
          { name: 'ЖКХ', amount: 5240, color: '#14b8a6' },
          { name: 'Связь', amount: 1900, color: '#10b981' }
        ]
    }
    
    // Применяем некоторые случайные изменения для разных карт
    if (props.cardId) {
      const cardIdNum = typeof props.cardId === 'string' ? parseInt(props.cardId) : props.cardId
      
      // Применяем небольшую вариацию данных в зависимости от ID карты
      mockData = mockData.map(category => {
        const variationFactor = 0.8 + (cardIdNum % 5) * 0.1
        return {
          ...category,
          amount: Math.round(category.amount * variationFactor)
        }
      })
    }
    
    categories.value = mockData
  }
  
  // Слушаем изменения периода и ID карты
  watch([selectedPeriod, () => props.cardId], () => {
    fetchExpenseData()
  })
  
  // Загрузка данных при монтировании компонента
  onMounted(() => {
    fetchExpenseData()
  })
  </script>
  
  <style scoped>
  .expense-chart-container {
    background-color: rgba(255, 255, 255, 0.05);
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 24px;
  }
  
  .chart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    flex-wrap: wrap;
    gap: 12px;
  }
  
  .chart-title {
    font-size: 18px;
    font-weight: 600;
    color: rgba(255, 255, 255, 0.9);
  }
  
  .period-selector {
    display: flex;
    background-color: rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    padding: 4px;
  }
  
  .period {
    padding: 6px 12px;
    font-size: 12px;
    border-radius: 16px;
    cursor: pointer;
    transition: all 0.2s;
    color: rgba(255, 255, 255, 0.7);
  }
  
  .period.active {
    background-color: rgba(255, 255, 255, 0.15);
    color: white;
  }
  
  .chart-content {
    display: flex;
    gap: 24px;
    flex-wrap: wrap;
  }
  
  .pie-chart-wrapper {
    flex: 1;
    min-width: 200px;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  
  .pie-chart {
    width: 180px;
    height: 180px;
    border-radius: 50%;
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(255, 255, 255, 0.02);
  }
  
  .chart-segment {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    border-radius: 50%;
    transition: transform 0.2s;
  }
  
  .chart-segment:hover {
    transform: scale(1.05);
  }
  
  .total-amount {
    font-size: 16px;
    font-weight: 600;
    color: white;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 8px 16px;
    border-radius: 20px;
    z-index: 2;
  }
  
  .categories-legend {
    flex: 1;
    min-width: 200px;
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
  
  .category-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 10px;
    border-radius: 10px;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .category-item:hover, .category-active {
    background-color: rgba(255, 255, 255, 0.08);
  }
  
  .category-color {
    width: 16px;
    height: 16px;
    border-radius: 4px;
  }
  
  .category-info {
    flex: 1;
  }
  
  .category-name {
    font-size: 14px;
    margin-bottom: 2px;
  }
  
  .category-amount {
    font-size: 12px;
    color: rgba(255, 255, 255, 0.6);
  }
  
  .category-percentage {
    font-weight: 600;
    font-size: 16px;
  }
  
  @media (max-width: 600px) {
    .chart-content {
      flex-direction: column;
    }
    
    .pie-chart-wrapper {
      margin: 0 auto;
    }
  }
  </style>