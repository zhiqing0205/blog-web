/*
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-07 01:39:07
 */
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import Antd from 'ant-design-vue';
import 'ant-design-vue/dist/antd.css';
import * as Icons from '@ant-design/icons-vue'

const app = createApp(App);
app.use(store).use(router).use(Antd).mount('#app');

//全局使用图标
const icons : any = Icons;
for (const i in icons) {
    app.component(i, icons[i]);
}