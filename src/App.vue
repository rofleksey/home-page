<template>
  <AppBackground :transition-active="isTransitioning" :transition-direction="transitionDirection"/>
  <div class="cube-container" :class="{ 'transitioning': isTransitioning }">
    <RouterView v-slot="{ Component, route }">
      <Transition
        :name="`cube-${transitionDirection}`"
        @enter="onTransitionEnter"
        @after-enter="onTransitionAfterEnter"
        @leave="onTransitionLeave"
        @after-leave="onTransitionAfterLeave"
        :css="false"
      >
        <component
          :is="Component"
          :key="route.path"
          class="cube-face"
          :class="getFaceClass(route)"
        />
      </Transition>
    </RouterView>
  </div>
</template>

<script setup lang="ts">
import {ref} from 'vue';
import {RouterView, useRouter} from 'vue-router';
import AppBackground from './components/AppBackground.vue';

const router = useRouter();
const isTransitioning = ref(false);
const transitionDirection = ref<'left' | 'right'>('right');

const navigationHistory = ref<string[]>(['/']);

const getFaceClass = (route: any) => {
  return route.path === '/' ? 'front-face' : 'right-face';
};

const onTransitionEnter = (el: Element, done: () => void) => {
  isTransitioning.value = true;

  requestAnimationFrame(() => {
    (el as HTMLElement).style.transform = 'translateZ(0) rotateY(0deg)';
    (el as HTMLElement).style.opacity = '1';
    setTimeout(done, 500);
  });
};

const onTransitionAfterEnter = () => {
  isTransitioning.value = false;
};

const onTransitionLeave = (el: Element, done: () => void) => {
  const direction = transitionDirection.value;
  const rotateY = direction === 'right' ? -90 : 90;

  requestAnimationFrame(() => {
    (el as HTMLElement).style.transform = `translateZ(-200px) rotateY(${rotateY}deg)`;
    (el as HTMLElement).style.opacity = '0';
    setTimeout(done, 500);
  });
};

const onTransitionAfterLeave = () => {
  // Cleanup
};

router.beforeEach((to, from, next) => {
  const currentIndex = navigationHistory.value.indexOf(from.path);
  const toIndex = navigationHistory.value.indexOf(to.path);

  if (toIndex === -1) {
    navigationHistory.value.push(to.path);
    transitionDirection.value = 'right';
  } else if (toIndex < currentIndex) {
    transitionDirection.value = 'left';
  } else {
    transitionDirection.value = 'right';
  }

  next();
});
</script>

<style scoped>
.cube-container {
  position: relative;
  width: 100%;
  height: 100vh;
  perspective: 1200px;
  transform-style: preserve-3d;
}

.cube-face {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  backface-visibility: hidden;
  transform-style: preserve-3d;
  transition: transform 0.5s cubic-bezier(0.645, 0.045, 0.355, 1), opacity 0.5s cubic-bezier(0.645, 0.045, 0.355, 1);
}

.front-face {
  transform: translateZ(0) rotateY(0deg);
}

.right-face {
  transform: translateZ(0) rotateY(0deg);
}

/* Enter transitions */
.cube-right-enter-from {
  transform: translateZ(-200px) rotateY(90deg);
  opacity: 0;
}

.cube-right-enter-to {
  transform: translateZ(0) rotateY(0deg);
  opacity: 1;
}

.cube-left-enter-from {
  transform: translateZ(-200px) rotateY(-90deg);
  opacity: 0;
}

.cube-left-enter-to {
  transform: translateZ(0) rotateY(0deg);
  opacity: 1;
}

.cube-right-leave-from {
  transform: translateZ(0) rotateY(0deg);
  opacity: 1;
}

.cube-right-leave-to {
  transform: translateZ(-200px) rotateY(-90deg);
  opacity: 0;
}

.cube-left-leave-from {
  transform: translateZ(0) rotateY(0deg);
  opacity: 1;
}

.cube-left-leave-to {
  transform: translateZ(-200px) rotateY(90deg);
  opacity: 0;
}
</style>