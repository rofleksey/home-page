<template>
  <div class="projects-page cube-content no-select">
    <div class="projects-container">
      <h1 class="projects-title">Projects</h1>

      <div class="camera-viewport">
        <div class="ground-plane">
          <div
            v-for="(project, index) in projects"
            :key="project.id"
            class="project-card"
            :class="{
              'active': activeIndex === index,
              'prev': index === prevIndex,
              'next': index === nextIndex
            }"
            :style="getCardStyle(index)"
          >
            <div class="card-content">
              <div class="project-image">
                <img :src="project.image" :alt="project.title" />
                <div class="image-overlay"></div>
              </div>
              <div class="project-info">
                <h3 class="project-title">{{ project.title }}</h3>
                <p class="project-description">{{ project.description }}</p>
                <div class="technologies">
                  <span
                    v-for="tech in project.technologies"
                    :key="tech"
                    class="tech-tag"
                  >
                    {{ tech }}
                  </span>
                </div>
                <a
                  :href="project.link"
                  target="_blank"
                  class="project-link"
                  @click.stop
                >
                  View Project →
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="projects-navigation">
        <button class="nav-button prev" @click="navigate(-1)" aria-label="Previous project">
          ←
        </button>
        <div class="project-indicators">
          <button
            v-for="(project, index) in projects"
            :key="project.id"
            class="indicator"
            :class="{ 'active': activeIndex === index }"
            @click="selectProject(index)"
            :aria-label="`Go to ${project.title}`"
          />
        </div>
        <button class="nav-button next" @click="navigate(1)" aria-label="Next project">
          →
        </button>
      </div>
    </div>

    <button class="back-button" @click="goBack">
      ← Back to Home
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();
const activeIndex = ref(0);
const isTransitioning = ref(false);

interface Project {
  id: string;
  title: string;
  description: string;
  image: string;
  link: string;
  technologies: string[];
}

const projects = ref<Project[]>([
  {
    id: '1',
    title: 'Maksakov',
    description: 'Website for an online store of handmade leather goods',
    image: '/images/maksakov.png',
    link: 'https://maksakov.com/',
    technologies: ['NuxtJS', 'Strapi']
  },
  {
    id: '2',
    title: 'Shantaram',
    description: 'Website for a hookah lounge. Menu + order',
    image: '/images/shantaram.jpg',
    link: 'https://shantaram-spb.ru',
    technologies: ['Go', 'NuxtJS']
  },
  {
    id: '3',
    title: 'Fryrate',
    description: 'Personal project for rating restaurants based on the quality of their french fries',
    image: '/images/fryrate.jpg',
    link: 'https://fryrate.ru',
    technologies: ['Go', 'AstroJS']
  }
]);

const totalProjects = projects.value.length;

const prevIndex = computed(() => (activeIndex.value - 1 + totalProjects) % totalProjects);
const nextIndex = computed(() => (activeIndex.value + 1) % totalProjects);

const getCardStyle = (index: number) => {
  const cardSpacing = 400;
  const baseZ = 0;
  const elevatedZ = 100;

  let xPosition = (index - activeIndex.value) * cardSpacing;

  if (index - activeIndex.value > totalProjects / 2) {
    xPosition = (index - activeIndex.value - totalProjects) * cardSpacing;
  } else if (index - activeIndex.value < -totalProjects / 2) {
    xPosition = (index - activeIndex.value + totalProjects) * cardSpacing;
  }

  let zPosition = baseZ;
  let opacity;
  let scale = 1;

  if (isTransitioning.value) {
    if (index === activeIndex.value || index === prevIndex.value || index === nextIndex.value) {
      zPosition = elevatedZ;
      opacity = 1;
    } else {
      opacity = 0;
      scale = 0.8;
    }
  } else {
    if (index === activeIndex.value) {
      zPosition = baseZ;
      opacity = 1;
      scale = 1;
    } else {
      opacity = 0.3;
      scale = 0.9;
      zPosition = baseZ - 50;
    }
  }

  return {
    transform: `translate3d(${xPosition}px, 0, ${zPosition}px) scale(${scale})`,
    opacity: opacity.toString(),
    zIndex: index === activeIndex.value ? 100 :
      (index === prevIndex.value || index === nextIndex.value) ? 50 : 10,
    pointerEvents: isTransitioning.value && index !== activeIndex.value ? 'none' : 'auto'
  };
};

const navigate = async (direction: number) => {
  if (isTransitioning.value) return;

  isTransitioning.value = true;
  activeIndex.value = (activeIndex.value + direction + totalProjects) % totalProjects;

  await new Promise(resolve => setTimeout(resolve, 500));

  isTransitioning.value = false;
};

const selectProject = async (index: number) => {
  if (isTransitioning.value || index === activeIndex.value) return;

  isTransitioning.value = true;
  activeIndex.value = index;

  // Camera descends back to ground
  await new Promise(resolve => setTimeout(resolve, 500));

  isTransitioning.value = false;
};

const handleKeydown = (event: KeyboardEvent) => {
  if (isTransitioning.value) return;

  switch (event.key) {
    case 'ArrowLeft':
      event.preventDefault();
      navigate(-1);
      break;
    case 'ArrowRight':
      event.preventDefault();
      navigate(1);
      break;
    case ' ':
    case 'Enter':
      event.preventDefault();
      selectProject((activeIndex.value + 1) % totalProjects);
      break;
  }
};

const goBack = () => {
  router.push('/');
};

onMounted(() => {
  window.addEventListener('keydown', handleKeydown);
});

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown);
});
</script>

<style scoped>
.projects-page {
  position: relative;
  z-index: 10;
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  background: transparent;
  overflow: hidden;
  perspective: 1200px;
}

.projects-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  max-width: 1200px;
}

.projects-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 3rem;
  margin-bottom: 3rem;
  text-shadow: 0 0 10px #ff0000, 0 0 20px #ff0000;
  animation: glitch 3s infinite;
  color: #fff;
}

.camera-viewport {
  position: relative;
  width: 100%;
  height: 70vh;
  perspective: 1200px;
  transform-style: preserve-3d;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-grow: 1;
}

.ground-plane {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  transition: transform 2s cubic-bezier(0.23, 1, 0.32, 1);
}

.project-card {
  position: absolute;
  width: 350px;
  height: 600px;
  top: 50%;
  left: 50%;
  margin-left: -175px;
  margin-top: -300px;
  transition: all 2s cubic-bezier(0.23, 1, 0.32, 1);
  cursor: pointer;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  will-change: transform, opacity;
}

.project-card.active {
  cursor: default;
  z-index: 100;
}

.project-card.prev,
.project-card.next {
  z-index: 50;
}

.card-content {
  position: relative;
  width: 100%;
  height: 100%;
  transform-style: preserve-3d;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}

.project-image {
  position: relative;
  width: 100%;
  height: 250px;
  overflow: hidden;
  border: 1px solid #ff0000;
  background: rgba(0, 0, 0, 0.9);
  transform: translateZ(1px);
}

.project-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  opacity: 0.8;
  transition: opacity 0.3s ease;
}

.project-card.active .project-image img {
  opacity: 1;
}

.image-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    45deg,
    transparent,
    rgba(255, 0, 0, 0.1),
    transparent
  );
  opacity: 0.5;
}

.project-info {
  padding: 2rem;
  height: calc(100% - 250px);
  display: flex;
  flex-direction: column;
  border: 1px solid #ff0000;
  border-top: none;
  background: rgba(0, 0, 0, 0.95);
  transform: translateZ(1px);
}

.project-title {
  font-family: 'Share Tech Mono', monospace;
  font-size: 1.5rem;
  color: #fff;
  margin-bottom: 1rem;
  text-shadow: 0 0 5px #ff0000;
}

.project-description {
  color: #ccc;
  font-size: 1rem;
  line-height: 1.5;
  flex-grow: 1;
  margin-bottom: 1.5rem;
}

.technologies {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
}

.tech-tag {
  background: rgba(255, 0, 0, 0.2);
  color: #ff6b6b;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.8rem;
  border: 1px solid rgba(255, 0, 0, 0.3);
}

.project-link {
  color: #ff0000;
  text-decoration: none;
  font-size: 0.9rem;
  font-weight: bold;
  text-transform: uppercase;
  letter-spacing: 1px;
  transition: all 0.3s ease;
  align-self: flex-start;
}

.project-link:hover {
  color: #fff;
  text-shadow: 0 0 10px #ff0000;
}

.projects-navigation {
  display: flex;
  align-items: center;
  gap: 2rem;
  margin-top: 3rem;
}

.nav-button {
  background: transparent;
  border: 1px solid #ff0000;
  color: #fff;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  cursor: pointer;
  font-size: 1.5rem;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-button:hover:not(:disabled) {
  background: #ff0000;
  box-shadow: 0 0 15px #ff0000;
  transform: scale(1.1);
}

.nav-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.project-indicators {
  display: flex;
  gap: 0.75rem;
}

.indicator {
  width: 15px;
  height: 15px;
  border-radius: 50%;
  border: 1px solid #ff0000;
  background: transparent;
  cursor: pointer;
  transition: all 0.3s ease;
}

.indicator.active {
  background: #ff0000;
  box-shadow: 0 0 10px #ff0000;
}

.indicator:hover {
  transform: scale(1.2);
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

/* Ground effect */
.ground-plane::before {
  content: '';
  position: absolute;
  top: 60%;
  left: -50%;
  width: 200%;
  height: 200px;
  background: linear-gradient(
    to bottom,
    transparent,
    rgba(255, 0, 0, 0.1)
  );
  transform: translateZ(-100px);
  pointer-events: none;
}

@keyframes glitch {
  0%, 100% { transform: translate(0); }
  20% { transform: translate(-2px, 2px); }
  40% { transform: translate(-2px, -2px); }
  60% { transform: translate(2px, 2px); }
  80% { transform: translate(2px, -2px); }
}

@media (max-width: 1024px) {
  .camera-viewport {
    height: 60vh;
  }

  .project-card {
    width: 320px;
    height: 450px;
    margin-left: -160px;
    margin-top: -225px;
  }
}

@media (max-width: 768px) {
  .projects-page {
    padding: 1rem;
  }

  .projects-title {
    font-size: 2rem;
    margin-bottom: 2rem;
  }

  .camera-viewport {
    height: 50vh;
  }

  .project-card {
    width: 280px;
    height: 400px;
    margin-left: -140px;
    margin-top: -200px;
  }

  .project-info {
    padding: 1.5rem;
  }

  .project-title {
    font-size: 1.3rem;
  }

  .project-description {
    font-size: 0.9rem;
  }

  .projects-navigation {
    gap: 1.5rem;
  }

  .nav-button {
    width: 50px;
    height: 50px;
    font-size: 1.3rem;
  }
}

@media (max-width: 480px) {
  .projects-title {
    font-size: 1.5rem;
  }

  .camera-viewport {
    height: 45vh;
  }

  .project-card {
    width: 250px;
    height: 350px;
    margin-left: -125px;
    margin-top: -175px;
  }

  .project-image {
    height: 150px;
  }

  .project-info {
    height: calc(100% - 150px);
    padding: 1rem;
  }

  .project-title {
    font-size: 1.1rem;
  }

  .project-description {
    font-size: 0.8rem;
  }

  .technologies {
    gap: 0.3rem;
  }

  .tech-tag {
    font-size: 0.7rem;
    padding: 0.2rem 0.5rem;
  }
}
</style>