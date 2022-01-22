<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 23:54:06
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-23 00:45:43
-->

<template>
	<a-layout-footer style="text-align: center">
		Blog by ziuch 2021
		{{ user.loginName }}
	</a-layout-footer>
</template>

<script lang="ts">
import store from "@/store";
import { computed, defineComponent } from "vue";

export default defineComponent({
	name: "the-footer",

	setup() {
		const user = computed(() => store.state.user);

		return {
			user,
		};
	},
});
</script>
