<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 23:44:19
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-06 23:50:16
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
			<a-menu-item key="1">nav 111</a-menu-item>
			<a-menu-item key="2">nav 2</a-menu-item>
			<a-menu-item key="3">nav 3</a-menu-item>
		</a-menu>
	</a-layout-header>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
	name: "the-header",
});
</script>
