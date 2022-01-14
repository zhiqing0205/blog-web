<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 23:44:19
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-14 13:03:43
-->

<template>
	<a-layout-header class="header">
		<div class="logo" />
		<a-row>
			<a-col :xs="20" :sm="18" :md="16" :lg="14" :xl="12">
				<a-menu theme="dark" mode="horizontal" class="menu">
					<a-menu-item key="/"
						><router-link to="/">首页</router-link></a-menu-item
					>
					<a-menu-item key="/admin/user">
						<router-link to="/admin/user">用户管理</router-link>
					</a-menu-item>
					<a-menu-item key="/admin/ebook">
						<router-link to="/admin/ebook">电子书管理</router-link>
					</a-menu-item>

					<a-menu-item key="/admin/category">
						<router-link to="/admin/category">分类管理</router-link>
					</a-menu-item>
					<a-menu-item key="/about">
						<router-link to="/about">关于我们</router-link>
					</a-menu-item>
				</a-menu></a-col
			>
			<a-col :xs="4" :sm="6" :md="8" :lg="10" :xl="12" v-if="loginUser.id">
				<a-popconfirm
					title="是否退出登录"
					ok-text="是"
					cancel-text="否"
					@confirm="logout()"
				>
					<a class="login-menu">退出登录</a>
				</a-popconfirm>
                <p class="login-menu"> 你好，{{ loginUser.name }} </p>
			</a-col>
			<a-col :xs="4" :sm="6" :md="8" :lg="10" :xl="12" v-else>
				<a class="login-menu" @click="showLoginModal"> 登录 </a>
			</a-col>
		</a-row>
	</a-layout-header>

	<a-modal
		v-model:visible="modalVisible"
		title="登录"
		:confirm-loading="modalConfirmLoading"
		@ok="login"
	>
		<a-form :model="user" :label-col="{ span: 4 }">
			<a-form-item label="登录名">
				<a-input v-model:value="user.loginName" :disabled="!!user.id" />
			</a-form-item>
			<a-form-item label="密码">
				<a-input-password v-model:value="user.password" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts">
import { computed, defineComponent, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";
import store from "@/store";
declare let hexMd5: any;
declare let KEY: any;

export default defineComponent({
	name: "the-header",

	setup() {
		const loginUser = computed(() => store.state.user);

		const user = ref();
		user.value = {};
		const modalVisible = ref<boolean>(false);
		const modalConfirmLoading = ref<boolean>(false);

		const showLoginModal = () => {
			modalVisible.value = true;
		};

		const login = () => {
			if (
				Tool.isEmpty(user.value.loginName) ||
				Tool.isEmpty(user.value.password)
			) {
				message.error("登录名或密码为空！");
				return;
			}
			modalConfirmLoading.value = true;
			user.value.password = hexMd5(user.value.password + KEY);
			axios.post("/user/login", user.value).then((res) => {
				modalConfirmLoading.value = false;
				const data = res.data;

				if (data.success) {
					modalVisible.value = false;
					user.value = {};
					message.success("登录成功！");

					store.commit("setUser", data.content);
				} else {
					user.value.password = null;
					message.error(data.message);
				}
			});
		};

        const logout = () => {
			axios.get("/user/logout/" + loginUser.value.token).then((res) => {
				const data = res.data;

				if (data.success) {
					user.value = {};
					message.success("退出成功！");

					store.commit("setUser", {});
				} else {
					message.error(data.message);
				}
			});
		};

		return {
			user,
			modalVisible,
			modalConfirmLoading,
			showLoginModal,
			login,
			loginUser,
            logout,
		};
	},
});
</script>

<style lang="less">
.login-menu {
	float: right !important;
	padding-left: 10px;
	color: white;
}
</style>
