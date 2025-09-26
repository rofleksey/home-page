<template>
  <div id="canvas-container" ref="canvasContainer"></div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from "vue";
import * as THREE from 'three';

const canvasContainer = ref<HTMLElement>();

class HexagonParticleSystem {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.PointsMaterial;

  private renderer: THREE.WebGLRenderer;
  private particleSystem: THREE.Points | null;
  private animationId: number;

  constructor(container: HTMLElement) {
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: "high-performance"
    });

    this.geometry = new THREE.BufferGeometry();
    this.material = new THREE.PointsMaterial({
      size: 0.03,
      vertexColors: true,
      transparent: true,
      opacity: 0.6
    });

    this.particleSystem = null;
    this.animationId = 0;

    this.init(container);
  }

  private init(container: HTMLElement): void {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setClearColor(0x000000, 0);

    container.appendChild(this.renderer.domElement);
    this.camera.position.z = 5;

    this.createParticles();
    this.animate();

    window.addEventListener('resize', () => this.onWindowResize());
  }

  private createParticles(): void {
    const positions: number[] = [];
    const colors: number[] = [];
    const colorPalette: number[] = [0xff3333, 0xffffff, 0x660000];

    for (let i = 0; i < 1500; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = 2 + Math.random() * 3;
      const height = (Math.random() - 0.5) * 8;

      const x = Math.cos(angle) * radius;
      const y = Math.sin(angle) * radius;
      const z = height;

      positions.push(x, y, z);

      const color = colorPalette[Math.floor(Math.random() * colorPalette.length)]!;
      const r = ((color >> 16) & 255) / 255;
      const g = ((color >> 8) & 255) / 255;
      const b = (color & 255) / 255;

      colors.push(r, g, b);
    }

    this.geometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
    this.geometry.setAttribute('color', new THREE.Float32BufferAttribute(colors, 3));

    this.particleSystem = new THREE.Points(this.geometry, this.material);
    this.scene.add(this.particleSystem);
  }

  private animate(): void {
    this.animationId = requestAnimationFrame(() => this.animate());

    if (this.particleSystem) {
      this.particleSystem.rotation.x += 0.0005;
      this.particleSystem.rotation.y += 0.001;

      const positions = this.geometry.attributes.position!.array as Float32Array;
      const time = Date.now() * 0.0005;

      for (let i = 0; i < positions.length; i += 3) {
        positions[i + 2]! += Math.sin(time + positions[i]!) * 0.005;
        if (positions[i + 2]! > 4) positions[i + 2] = -4;
      }

      this.geometry.attributes.position!.needsUpdate = true;
      this.renderer.render(this.scene, this.camera);
    }
  }

  private onWindowResize(): void {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }

  public dispose(): void {
    cancelAnimationFrame(this.animationId);
    window.removeEventListener('resize', () => this.onWindowResize());
    this.renderer.dispose();
    this.geometry.dispose();
    this.material.dispose();
  }
}

let particleSystem: HexagonParticleSystem | null = null;

onMounted(() => {
  if (canvasContainer.value) {
    particleSystem = new HexagonParticleSystem(canvasContainer.value);
  }
});

onUnmounted(() => {
  if (particleSystem) {
    particleSystem.dispose();
  }
});
</script>

<style scoped>
#canvas-container {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -2;
}
</style>