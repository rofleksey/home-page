<template>
  <div id="canvas-container" ref="canvasContainer"></div>
</template>

<script setup lang="ts">
import {ref, onMounted, onUnmounted, watch} from "vue";
import * as THREE from 'three';

const BASE_ROTATION_SPEED = 0.001;
const BASE_MOVEMENT_SPEED = 0.005;

const TRANSITION_SPEED = 6.0
const TRANSITION_ROTATION_FACTOR = 20
const TRANSITION_MOVEMENT_FACTOR = 1

interface Props {
  transitionActive?: boolean;
  transitionDirection?: 'left' | 'right';
}

const props = withDefaults(defineProps<Props>(), {
  transitionActive: false,
  transitionDirection: 'right'
});

const canvasContainer = ref<HTMLElement>();

class HexagonParticleSystem {
  private readonly scene: THREE.Scene;
  private readonly camera: THREE.PerspectiveCamera;
  private readonly geometry: THREE.BufferGeometry;
  private readonly material: THREE.PointsMaterial;

  private renderer: THREE.WebGLRenderer;
  private particleSystem: THREE.Points | null;
  private animationId: number;

  private targetRotationSpeed: number;
  private targetMovementSpeed: number;
  private currentRotationSpeed: number;
  private currentMovementSpeed: number;
  private transitionProgress: number;
  private isTransitioning: boolean;

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

    this.targetRotationSpeed = BASE_ROTATION_SPEED;
    this.targetMovementSpeed = BASE_MOVEMENT_SPEED;
    this.currentRotationSpeed = BASE_ROTATION_SPEED;
    this.currentMovementSpeed = BASE_MOVEMENT_SPEED;
    this.transitionProgress = 0;
    this.isTransitioning = false;

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

  public startTransition(): void {
    this.isTransitioning = true;
    this.targetRotationSpeed = BASE_ROTATION_SPEED * TRANSITION_ROTATION_FACTOR;
    this.targetMovementSpeed = BASE_MOVEMENT_SPEED * TRANSITION_MOVEMENT_FACTOR;
    this.transitionProgress = 0;
  }

  public endTransition(): void {
    this.targetRotationSpeed = BASE_ROTATION_SPEED;
    this.targetMovementSpeed = BASE_MOVEMENT_SPEED;
  }

  private updateTransition(deltaTime: number): void {
    if (this.isTransitioning) {
      this.transitionProgress += deltaTime * TRANSITION_SPEED;

      if (this.transitionProgress >= 1) {
        this.transitionProgress = 1;
      }
    } else {
      this.transitionProgress -= deltaTime * TRANSITION_SPEED;

      if (this.transitionProgress <= 0) {
        this.transitionProgress = 0;
      }
    }

    const easedProgress = this.easeInOutCubic(this.transitionProgress);

    this.currentRotationSpeed = THREE.MathUtils.lerp(
      BASE_ROTATION_SPEED,
      this.targetRotationSpeed,
      easedProgress
    );

    this.currentMovementSpeed = THREE.MathUtils.lerp(
      BASE_MOVEMENT_SPEED,
      this.targetMovementSpeed,
      easedProgress
    );
  }

  private easeInOutCubic(t: number): number {
    return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
  }

  private animate(): void {
    const clock = new THREE.Clock();

    const render = () => {
      this.animationId = requestAnimationFrame(render);

      const deltaTime = Math.min(clock.getDelta(), 0.1);

      this.updateTransition(deltaTime);

      if (this.particleSystem) {
        this.particleSystem.rotation.x += this.currentRotationSpeed * 0.5;
        this.particleSystem.rotation.y += this.currentRotationSpeed;

        const positions = this.geometry.attributes.position!.array as Float32Array;
        const time = Date.now() * 0.0005;

        for (let i = 0; i < positions.length; i += 3) {
          positions[i + 2]! += Math.sin(time + positions[i]!) * this.currentMovementSpeed;
          if (positions[i + 2]! > 4) positions[i + 2] = -4;
          if (positions[i + 2]! < -4) positions[i + 2] = 4;
        }

        this.geometry.attributes.position!.needsUpdate = true;
        this.renderer.render(this.scene, this.camera);
      }
    };

    render();
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

watch(() => props.transitionActive, (newVal) => {
  if (particleSystem) {
    if (newVal) {
      particleSystem.startTransition();
    } else {
      particleSystem.endTransition();
    }
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