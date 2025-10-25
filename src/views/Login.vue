<template>
  <Suspense>
    <LoginForm />
    <template #fallback>
      <div>Loading...</div>
    </template>
  </Suspense>
</template>

<script setup>
import LoginForm from '@/components/LoginForm.vue'
</script>
