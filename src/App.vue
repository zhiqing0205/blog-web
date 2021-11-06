<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-06 23:51:08
-->
<template>
	<a-layout>
        <the-header/>
		<router-view/>
	</a-layout>
    <a-layout-footer style="text-align: center">
        Blog by ziuch
    </a-layout-footer>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import TheHeader from '@/components/the-header.vue'

export default defineComponent({
	name: "app",
	components: {
        TheHeader,
    }
});
</script>

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
