import Vue from 'vue';
import App from './components/App.vue';

if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('service-worker.js');
}

const vm = new Vue({render: h => h(App)});

vm.$mount('#app');
