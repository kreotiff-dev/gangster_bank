<template>
  <div class="app-container">
    <main class="main-content">
      <slot></slot>
    </main>
    
    <!-- Плавающая кнопка действия -->
    <div class="action-button">+</div>
    
    <!-- Нижняя навигация -->
    <div class="bottom-menu">
      <div class="menu-item active">
        <div class="menu-icon">🏠</div>
        <div class="menu-label">Главная</div>
      </div>
      <div class="menu-item">
        <div class="menu-icon">💳</div>
        <div class="menu-label">Карты</div>
      </div>
      <div class="menu-item" style="visibility: hidden;"></div>
      <div class="menu-item">
        <div class="menu-icon">📊</div>
        <div class="menu-label">Финансы</div>
      </div>
      <div class="menu-item">
        <div class="menu-icon">👤</div>
        <div class="menu-label">Профиль</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Здесь может быть дополнительная логика для макета
</script>

<style scoped>
.app-container {
  padding: 20px;
  padding-bottom: 80px; /* Для нижней навигации */
  max-width: 500px;
  margin: 0 auto;
}

.main-content {
  margin-bottom: 40px;
}

.action-button {
  position: fixed;
  bottom: 78px;
  left: 50%;
  transform: translateX(-50%);
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #FF6B6B, #FFD166);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  color: white;
  box-shadow: 0 4px 20px rgba(255, 107, 107, 0.4);
  z-index: 10;
  cursor: pointer;
  transition: transform 0.2s;
}

.action-button:hover {
  transform: translateX(-50%) scale(1.05);
}

.bottom-menu {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: #111111;
  display: flex;
  justify-content: space-between;
  padding: 20px 32px;
  border-top: 1px solid rgba(255,255,255,0.1);
  z-index: 5;
}

.menu-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  cursor: pointer;
}

.menu-icon {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.menu-label {
  font-size: 12px;
  color: rgba(255,255,255,0.6);
  transition: color 0.2s;
}

.menu-item.active .menu-icon,
.menu-item.active .menu-label {
  opacity: 1;
  color: #FFFFFF;
}

.menu-item:hover .menu-icon {
  opacity: 0.8;
}

.menu-item:hover .menu-label {
  color: rgba(255,255,255,0.8);
}
</style>