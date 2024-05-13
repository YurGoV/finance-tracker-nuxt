<template>
  <UCard>
    <template #header>
      Signing in...
    </template>
    Whait a moment while we signing in...
  </UCard>
</template>

<script setup lang="ts">
useRedirectIfAuthenticated()
</script>
