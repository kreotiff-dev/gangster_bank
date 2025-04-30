<template>
  <AppLayout>
    <div class="flex flex-col space-y-6">
      <HeaderUserInfo />
      <BalanceCard />
      <ActionsBanner />
      <CardList />
      <!-- <TransactionList /> -->
    </div>
  </AppLayout>
</template>

<script setup lang="ts">
import AppLayout from '@/components/Layout/AppLayout.vue'
import HeaderUserInfo from '@/components/Header/HeaderUserInfo.vue'
import BalanceCard from '@/components/Balance/BalanceCard.vue'
import ActionsBanner from '@/components/Actions/ActionsBanner.vue'
import CardList from '@/components/Cards/CardList.vue'

</script>
