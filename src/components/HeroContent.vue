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
import HeroTitle from './HeroTitle.vue';
import HeroTagline from './HeroTagline.vue';
import NavigationLinks from './NavigationLinks.vue';
import StatusMessage from './StatusMessage.vue';
import SocialLinks from "./SocialLinks.vue";
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