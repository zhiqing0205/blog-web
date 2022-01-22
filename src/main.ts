/*
 * @Description:
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-23 00:45:40
 */
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import Antd from "ant-design-vue";
import "ant-design-vue/dist/antd.css";
import * as Icons from "@ant-design/icons-vue";
import axios from "axios";
import JSONBIG from "json-bigint";
import { Tool } from "./util/tool";

axios.defaults.baseURL = process.env.VUE_APP_SERVER;

// 默认配置  转换响应数据
axios.defaults.transformResponse = [
	(data) => {
		// 对data（后台的原始数据）进行转换
		return JSONBIG.parse(data);
	},
];

/**
 * axios拦截器
 */
axios.interceptors.request.use(
	function (config) {
		const token = store.state.user.token;
		if (Tool.isNotEmpty(token)) {
			console.log("Token:", token);
			if (!config) {
				config = {};
			}
			if (!config.headers) {
				config.headers = {};
			}
			config.headers.token = token;
		}
		console.log("url：", config.url);
		console.log("请求参数：", config);
		return config;
	},
	(error) => {
		return Promise.reject(error);
	}
);
axios.interceptors.response.use(
	function (response) {
		console.log("返回结果：", response);
		return response;
	},
	(error) => {
		console.log("返回错误：", error);
		return Promise.reject(error);
	}
);

const app = createApp(App);
app.use(store).use(router).use(Antd).mount("#app");

//全局使用图标
const icons: any = Icons;
for (const i in icons) {
	app.component(i, icons[i]);
}

console.log(process.env.NODE_ENV);
console.log(process.env.VUE_APP_SERVER);
console.log(process.env.VUE_APP_WS_SERVER);
