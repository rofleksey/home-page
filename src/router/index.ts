import { createRouter, createWebHashHistory } from 'vue-router';
import HomePage from '../pages/HomePage.vue';
import AboutPage from '../pages/AboutPage.vue';
import ProjectsPage from '../pages/ProjectsPage.vue';

const routes = [
  { path: '/', component: HomePage, name: 'home' },
  { path: '/about', component: AboutPage, name: 'about' },
  { path: '/projects', component: ProjectsPage, name: 'projects' }
];

const router = createRouter({
  history: createWebHashHistory(),
  routes
});

export default router;