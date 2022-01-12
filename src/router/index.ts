/*
 * @Description:
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-12 10:17:49
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import About from "../views/about.vue";
import AdminEbook from "../views/admin/admin-ebook.vue";
import AdminCategory from "../views/admin/admin-category.vue";
import AdminDoc from "../views/admin/admin-doc.vue";
import Doc from "../views/doc.vue";
import AdminUser from "../views/admin/admin-user.vue";

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
	},
	{
		path: "/admin/category",
		name: "AdminCategory",
		component: AdminCategory,
	},
    {
		path: "/admin/doc/:ebookId",
		name: "AdminDoc",
		component: AdminDoc,
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
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
