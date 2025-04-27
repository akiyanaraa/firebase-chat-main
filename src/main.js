import { createApp } from 'vue';
import './style.css';

import App from './App.vue';
import naive from 'naive-ui';
// General Font
import 'vfonts/Lato.css';
// Monospace Font
import 'vfonts/FiraCode.css';

// 🆕 Импортируем Toastification
import Toast from 'vue-toastification';
import 'vue-toastification/dist/index.css'; // Стили уведомлений

// main.js
if (localStorage.getItem('theme') === 'dark') {
    document.documentElement.classList.add('dark');
}

const app = createApp(App);

app.use(naive);


app.mount('#app');
