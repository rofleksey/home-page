<template>
  <div id="about-cv-container">
    <div id="about-cv"></div>
  </div>
</template>

<script setup lang="ts">
import * as AsciinemaPlayer from 'asciinema-player';
import "asciinema-player/dist/bundle/asciinema-player.css"
import {onMounted} from "vue";

onMounted(() => {
  AsciinemaPlayer.create('/demos/demo.cast', document.getElementById('about-cv')!, {
    preload: true,
    autoplay: true,
    cols: 50,
    rows: 20,
  });
})
</script>

<style scoped>
#about-cv-container {
  display: flex;
  justify-content: center;
  padding: 10px;
  width: 100%;
  max-width: 800px;
}

#about-cv {
  width: 100%;
  max-width: 100%;
  overflow: auto;
}

@media (max-width: 768px) {
  #about-cv {
    transform: scale(0.95);
    transform-origin: top center;
  }
}

@media (max-width: 480px) {
  #about-cv {
    transform: scale(0.85);
  }

  #about-cv-container {
    padding: 5px;
  }
}
</style>