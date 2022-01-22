/*
 * @Description:
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-23 00:45:47
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import About from "../views/about.vue";
import AdminEbook from "../views/admin/admin-ebook.vue";
import AdminCategory from "../views/admin/admin-category.vue";
import AdminDoc from "../views/admin/admin-doc.vue";
import Doc from "../views/doc.vue";
import AdminUser from "../views/admin/admin-user.vue";
import store from "@/store";
import { Tool } from "@/util/tool";
import { message } from "ant-design-vue";

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		component: About,
	},
	{
		path: "/admin/ebook",
		name: "AdminEbook",
		component: AdminEbook,
		meta: {
			loginRequire: true,
		},
	},
	{
		path: "/admin/category",
		name: "AdminCategory",
		component: AdminCategory,
		meta: {
			loginRequire: true,
		},
	},
	{
		path: "/admin/doc/:ebookId",
		name: "AdminDoc",
		component: AdminDoc,
		meta: {
			loginRequire: true,
		},
	},
	{
		path: "/doc/:ebookId",
		name: "Doc",
		component: Doc,
	},
	{
		path: "/admin/user",
		name: "AdminUser",
		component: AdminUser,
		meta: {
			loginRequire: true,
		},
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

// 路由登录拦截
router.beforeEach((to, from, next) => {
	// 要不要对meta.loginRequire属性做监控拦截
	if (
		to.matched.some(function (item) {
			console.log(item, "是否需要登录校验：", item.meta.loginRequire);
			return item.meta.loginRequire;
		})
	) {
		const loginUser = store.state.user;
		if (Tool.isEmpty(loginUser)) {
			console.log("用户未登录！");
			message.error("请登录后访问该页面！");
			next("/");
		} else {
			next();
		}
	} else {
		next();
	}
});

export default router;
