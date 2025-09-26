<template>
  <div class="nav-links no-select">
    <a href="https://github.com/rofleksey?tab=repositories" target="_blank" class="nav-link">Projects</a>
    <a href="/#/about" class="nav-link">About</a>
  </div>
</template>

<style scoped>
.nav-links {
  display: flex;
  gap: 2rem;
  margin: 3rem 0;
}

.nav-link {
  color: #fff;
  text-decoration: none;
  padding: 0.5rem 1rem;
  border: 1px solid #ff0000;
  transition: all 0.3s ease;
  text-transform: uppercase;
  font-size: 0.9rem;
  letter-spacing: 1px;
  cursor: pointer;
}

.nav-link:hover {
  background: #ff0000;
  box-shadow: 0 0 15px #ff0000;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .nav-links {
    flex-direction: column;
    gap: 1rem;
  }
}
</style>