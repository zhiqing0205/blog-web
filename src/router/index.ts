/*
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-14 15:35:31
 */
import { createRouter, createWebHistory, RouteRecordRaw } from "vue-router";
import Home from "../views/home.vue";
import About from "../views/about.vue";
import AdminEbook from "../views/admin/admin-ebook.vue"
import AdminCategory from "../views/admin/admin-category.vue"

const routes: Array<RouteRecordRaw> = [
	{
		path: "/",
		name: "Home",
		component: Home,
	},
	{
		path: "/about",
		name: "About",
		component: About
	},
    {
        path: "/admin/ebook",
		name: "AdminEbook",
		component: AdminEbook
    },
    {
        path: "/admin/category",
		name: "AdminCategory",
		component: AdminCategory
    }
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
