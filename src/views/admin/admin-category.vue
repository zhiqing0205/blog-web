<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-16 00:19:17
-->

<template>
	<a-layout>
		<a-layout-content
			:style="{
				background: '#fff',
				padding: '24px',
				margin: 0,
				minHeight: '280px',
			}"
		>
			<p>
				<a-form layout="inline" :model="search">
					<a-form-item>
						<a-button type="primary" @click="handleQuery()"> 查询 </a-button>
					</a-form-item>
					<a-form-item>
						<a-button type="primary" @click="add" size="lager">增加</a-button>
					</a-form-item>
				</a-form>
			</p>
			<a-table
				v-if="level.length > 0"
				:columns="columns"
				:data-source="level"
				:row-key="(record) => record.id"
				:loading="loading"
				:pagination="false"
				:defaultExpandAllRows="true"
			>
				<template #headerCellCover>
					<span>
						<smile-outlined />
						封面
					</span>
				</template>

				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<span>
							<a-space
								><a-button type="primary" @click="edit(record)">编辑</a-button>
								<a-popconfirm
									title="是否删除，删除后不可恢复"
									ok-text="是"
									cancel-text="否"
									@confirm="handleDelete(record.id)"
								>
									<a-button type="primary" danger>删除</a-button>
								</a-popconfirm></a-space
							>
						</span>
					</template>

					<template v-else-if="column.key === 'cover'">
						<img v-if="record.cover" :src="record.cover" alt="avator" />
					</template>
				</template>
			</a-table>
		</a-layout-content>
	</a-layout>

	<a-modal
		v-model:visible="modalVisible"
		title="分类表单"
		:confirm-loading="modalConfirmLoading"
		@ok="modalHandleOk"
	>
		<a-form :model="category" :label-col="{ span: 4 }">
			<a-form-item label="名称">
				<a-input v-model:value="category.name" />
			</a-form-item>
			<a-form-item label="父分类">
				<!-- <a-input v-model:value="category.parent" /> -->
				<a-select v-model:value="category.parent">
					<a-select-option :value="0">无</a-select-option>
					<a-select-option
						v-for="c in level"
						:value="jack"
						:key="c.id"
						:disabled="c.name === category.name"
					>
						{{ c.name }}
					</a-select-option>
				</a-select>

				<a-cascader
					v-model:value="category.parent"
					:options="level"
					:display-render="displayRender"
					expand-trigger="hover"
					placeholder="Please select"
				/>
			</a-form-item>
			<a-form-item label="顺序">
				<a-input v-model:value="category.sort" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";

const columns = [
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "顺序",
		key: "sort",
		dataIndex: "sort",
	},
	{
		title: "操作",
		key: "action",
		slots: { customRender: "bodyCell" },
	},
];

export default defineComponent({
	components: {},
	setup() {
		const categorys = ref();

		const loading = ref(false);

		const search = ref();
		search.value = {};

		const level = ref({});

		/**
		 * 数据查询
		 **/
		const handleQuery = () => {
			loading.value = true;
			axios.get("/category/all").then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					categorys.value = data.content;
					console.log("初始数据: ", data.content);

					level.value = [];
					level.value = Tool.array2Tree(categorys.value, "0");

					console.log("树形数据: ", level);
				} else {
					message.error(data.message);
				}
			});
		};

		const category = ref({});
		const modalVisible = ref<boolean>(false);
		const modalConfirmLoading = ref<boolean>(false);

		const edit = (record: any) => {
			modalVisible.value = true;
			category.value = Tool.copy(record);
		};

		const modalHandleOk = () => {
			modalConfirmLoading.value = true;
			axios.post("/category/save", category.value).then((res) => {
				const data = res.data;

				modalConfirmLoading.value = false;
				if (data.success) {
					modalVisible.value = false;

					handleQuery();

					message.success("保存成功！");
				} else {
					message.error(data.message);
				}
			});
		};

		const add = () => {
			modalVisible.value = true;
			category.value = {};
		};

		const handleDelete = (id: any) => {
			axios.delete("/category/delete/" + id).then((res) => {
				const data = res.data;

				if (data.success) {
					modalVisible.value = false;
					modalConfirmLoading.value = false;

					handleQuery();
					message.success("删除成功！");
				} else {
					message.error("删除失败！");
				}
			});
		};

		onMounted(() => {
			handleQuery();
		});

		return {
			columns,
			categorys,
			loading,

			modalVisible,
			edit,
			category,
			modalHandleOk,
			modalConfirmLoading,
			add,
			handleDelete,
			search,
			handleQuery,
			level,
		};
	},
});
</script>

<style scoped>
img {
	width: 50px;
	height: 50px;
	line-height: 50px;
	border-radius: 8%;
	margin: 5px 0;
}
</style>
