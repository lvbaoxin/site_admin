import { createApp } from 'vue';
import pinia from '/@/stores/index';
import App from './App.vue';
import router from './router';
import { directive } from '/@/utils/directive';
import { i18n } from '/@/i18n/index';
import other from '/@/utils/other';
import API from '/@/api/api'
import ElementPlus from 'element-plus';
import request from '/@/utils/manage'
import 'element-plus/dist/index.css';
import '/@/theme/index.scss';
import VueGridLayout from 'vue-grid-layout';


const app = createApp(App);

directive(app);
other.elSvg(app);
app.config.globalProperties.$api = API
app.config.globalProperties.$request = request
app.use(pinia).use(router).use(ElementPlus, { i18n: i18n.global.t }).use(i18n).use(VueGridLayout).mount('#app');
