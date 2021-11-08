<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 23:44:19
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-08 11:41:44
-->

<template>
	<a-layout-header class="header">
		<div class="logo" />
		<a-menu
			v-model:selectedKeys="selectedKeys1"
			theme="dark"
			mode="horizontal"
			:style="{ lineHeight: '64px' }"
		>
			<a-menu-item key="/"><router-link to="/">首页</router-link></a-menu-item>
			<a-menu-item key="/admin/ebook"><router-link to="/admin/ebook">电子书管理</router-link></a-menu-item>
			<a-menu-item key="/about"><router-link to="/about">关于我们</router-link></a-menu-item
			>
		</a-menu>
	</a-layout-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "the-header",
});
</script>
