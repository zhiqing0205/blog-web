<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-11 19:14:27
-->
<template>
	<a-layout>
		<a-layout>
			<a-layout-content
				:style="{
					background: '#fff',
					padding: '24px',
					margin: 0,
					minHeight: '280px',
				}"
			>
				<a-row :gutter="24">
					<a-col :span="8">
						<a-tree 
                        v-if="level.length > 0" 
                        class="tree" block-node 
                        :tree-data="level"
                        :replaceFields="{ title: 'name', key: 'id', value: 'id' }"
                        :defaultExpandAll= "true" />
					</a-col>
					<a-col :span="16"> </a-col>
				</a-row>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";

export default defineComponent({
	components: {},
	setup() {
		const doc = ref();

		const loading = ref(false);

		const level = ref();
		level.value = [];

		/**
		 * 数据查询
		 **/
		const handleQuery = () => {
			loading.value = true;
			axios.get("/doc/all").then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					console.log("初始数据: ", data.content);

					level.value = [];
					level.value = Tool.array2Tree(data.content, 0);

                    console.log("level", level.value);
				} else {
					message.error(data.message);
				}
			});
		};

		onMounted(() => {
			handleQuery();
		});

		return {
			loading,
			handleQuery,
			level,
		};
	},
});
</script>
