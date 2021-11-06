<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-06 23:39:25
-->
<template>
	<a-layout>
		<a-layout-header class="header">
			<div class="logo" />
			<a-menu
				v-model:selectedKeys="selectedKeys1"
				theme="dark"
				mode="horizontal"
				:style="{ lineHeight: '64px' }"
			>
				<a-menu-item key="1">nav 1</a-menu-item>
				<a-menu-item key="2">nav 2</a-menu-item>
				<a-menu-item key="3">nav 3</a-menu-item>
			</a-menu>
		</a-layout-header>
		<router-view/>
	</a-layout>
    <a-layout-footer style="text-align: center">
        Blog by ziuch
    </a-layout-footer>
</template>

<style>
#components-layout-demo-top-side-2 .logo {
	float: left;
	width: 120px;
	height: 31px;
	margin: 16px 24px 16px 0;
	background: rgba(255, 255, 255, 0.3);
}

.ant-row-rtl #components-layout-demo-top-side-2 .logo {
	float: right;
	margin: 16px 0 16px 24px;
}

.site-layout-background {
	background: #fff;
}
</style>
