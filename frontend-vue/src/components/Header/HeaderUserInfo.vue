<template>
  <div class="header">
    <div class="header-left">
      <div class="avatar">ЕС</div>
      <div>
        <div class="greeting">Привет,</div>
        <div class="username">Екатерина</div>
      </div>
    </div>
    <div class="header-right">
      <div class="icon-btn">🔍</div>
      <div class="icon-btn">🔔</div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Здесь может быть логика для получения информации о пользователе
// В будущем можно добавить получение аватарки пользователя и т.д.
</script>

<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.avatar {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #FF6B6B, #FFD166);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  color: white;
}

.greeting {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
}

.username {
  font-weight: 600;
  color: white;
}

.header-right {
  display: flex;
  gap: 16px;
}

.icon-btn {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: rgba(255,255,255,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s ease;
}

.icon-btn:hover {
  background-color: rgba(255,255,255,0.15);
}
</style>