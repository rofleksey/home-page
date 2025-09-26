<template>
  <div class="social-links">
    <a
      v-for="link in socialLinks"
      :key="link.name"
      :href="link.url"
      :aria-label="link.name"
      target="_blank"
      rel="noopener noreferrer"
      class="social-link"
    >
      <FontAwesomeIcon :icon="link.icon" class="social-icon" />
    </a>
  </div>
</template>

<script setup lang="ts">
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome'
import { faGithub, faTelegram } from '@fortawesome/free-brands-svg-icons'
import { computed } from 'vue'

interface SocialLink {
  name: string
  url: string
  icon: any
}

const socialLinks = computed<SocialLink[]>(() => [
  {
    name: 'GitHub',
    url: 'https://github.com/rofleksey',
    icon: faGithub
  },
  {
    name: 'Telegram',
    url: 'https://t.me/rofleksey',
    icon: faTelegram
  }
])
</script>

<style scoped>
.social-links {
  display: flex;
  justify-content: center;
  gap: 2rem;
  margin-top: 2rem;
}

.social-link {
  color: #fff;
  font-size: 2rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.social-link:hover {
  color: #ff0033;
  transform: translateY(-5px);
  background: rgba(255, 255, 255, 0.2);
}

.social-icon {
  width: 1em;
  height: 1em;
}
</style>