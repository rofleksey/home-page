<template>
  <h1 class="hero-title no-select">rofleksey</h1>
</template>

<style scoped>
.hero-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 4rem;
  margin-bottom: 1rem;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  animation: glitch 3s infinite;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@media (max-width: 768px) {
  .hero-title {
    font-size: 2.5rem;
  }
}
</style>