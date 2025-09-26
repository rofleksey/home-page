<template>
  <div class="about-page cube-content">
    <AboutCV />

    <button class="back-button" @click="goBack">
      ← Back to Home
    </button>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import AboutCV from "../components/AboutCV.vue";

const router = useRouter();
const goBack = () => {
  router.push('/');
};
</script>

<style scoped>
.about-page {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: transparent;
}

.back-button {
  margin-top: 2rem;
  padding: 0.75rem 2rem;
  background: transparent;
  border: 1px solid #ff0000;
  color: #fff;
  text-decoration: none;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
  font-family: 'Courier New', monospace;
}

.back-button:hover {
  background: #ff0000;
  box-shadow: 0 0 15px #ff0000;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .about-page {
    padding: 1rem;
  }
}
</style>