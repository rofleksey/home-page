<template>
  <div class="content">
    <HeroTitle />
    <HeroTagline />
    <NavigationLinks />
    <StatusMessage />
    <SocialLinks />
  </div>
</template>

<script setup lang="ts">
import HeroTagline from '../components/HeroTagline.vue';
import NavigationLinks from '../components/NavigationLinks.vue';
import StatusMessage from '../components/StatusMessage.vue';
import SocialLinks from "../components/SocialLinks.vue";
import HeroTitle from "../components/HeroTitle.vue";
</script>

<style scoped>
.content {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  text-align: center;
  padding: 2rem;
}
</style>