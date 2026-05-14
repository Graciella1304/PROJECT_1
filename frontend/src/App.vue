<template>
  <RouterView />
  <ToastContainer />
</template>

<script setup>
import { onMounted } from 'vue'
import { useAuthStore } from './stores/auth'
import { useUserStore } from './stores/user'
import ToastContainer from './components/ToastContainer.vue'
const auth = useAuthStore()
const user = useUserStore()
onMounted(() => { auth.initAuth(); user.initUser() })
</script>
