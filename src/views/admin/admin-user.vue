<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-12 11:00:40
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
						<a-input v-model:value="search.name" placeholder="用户名称">
						</a-input>
					</a-form-item>

					<a-form-item>
						<a-button
							type="primary"
							@click="handleQuery({ page: 1, size: pagination.pageSize })"
						>
							查询
						</a-button>
					</a-form-item>
					<a-form-item>
						<a-button type="primary" @click="add" size="lager">增加</a-button>
					</a-form-item>
				</a-form>
			</p>
			<a-table
				:columns="columns"
				:data-source="users"
				:row-key="(record) => record.id"
				:loading="loading"
				:pagination="pagination"
				@change="handleTableChange"
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
							<a-space>
								<a-button type="primary" @click="edit(record)">编辑</a-button>
								<a-popconfirm
									title="是否删除，删除后不可恢复"
									ok-text="是"
									cancel-text="否"
									@confirm="handleDelete(record.id)"
								>
									<a-button type="primary" danger>删除</a-button>
								</a-popconfirm>
							</a-space>
						</span>
					</template>

					<template v-else-if="column.key === 'cover'">
						<img v-if="record.cover" :src="record.cover" alt="avator" />
					</template>

					<template v-else-if="column.key === 'category'">
						<span>
							{{ getCategoryName(record.category1Id) }}/{{
								getCategoryName(record.category2Id)
							}}
						</span>
					</template>
				</template>
			</a-table>
		</a-layout-content>
	</a-layout>

	<a-modal
		v-model:visible="modalVisible"
		title="用户表单"
		:confirm-loading="modalConfirmLoading"
		@ok="modalHandleOk"
	>
		<a-form :model="user" :label-col="{ span: 4 }" :wrapper-col="wrapperCol">
			<a-form-item label="登录名">
				<a-input v-model:value="user.loginName" />
			</a-form-item>
			<a-form-item label="名称">
				<a-input v-model:value="user.name" />
			</a-form-item>
            <a-form-item label="密码">
				<a-input v-model:value="user.password" />
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
		title: "登陆名",
		key: "login_name",
		dataIndex: "loginName",
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "密码",
		key: "password",
		dataIndex: "password",
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
		const users = ref();

		const loading = ref(false);

		const search = ref();
		search.value = {};

		const pagination = ref({
			current: 1,
			pageSize: 6,
			total: 0,
		});

		/**
		 * 数据查询
		 **/
		const handleQuery = (params: any) => {
			loading.value = true;
			users.value = [];
			axios
				.get("/user/list", {
					params: {
						page: params.page,
						size: params.size,
						name: search.value.name,
					},
				})
				.then((res) => {
					loading.value = false;
					const data = res.data;

					if (data.success) {
						users.value = data.content.list;
						// console.log("params: " + params);

						pagination.value.current = params.page;
						pagination.value.total = data.content.total;
					} else {
						message.error(data.message);
					}
				});
		};

		/**
		 * 表格点击页码时触发
		 */
		const handleTableChange = (pagination: any) => {
			// console.log("自带分页参数：" + pagination);
			handleQuery({
				page: pagination.current,
				size: pagination.pageSize,
			});
		};

		const user = ref();
		const modalVisible = ref<boolean>(false);
		const modalConfirmLoading = ref<boolean>(false);

		const edit = (record: any) => {
			modalVisible.value = true;
			user.value = Tool.copy(record);
			categoryId.value = [user.value.category1Id, user.value.category2Id];
		};

		const modalHandleOk = () => {
			modalConfirmLoading.value = true;
			user.value.category1Id = categoryId.value[0];
			user.value.category2Id = categoryId.value[1];
			axios.post("/user/save", user.value).then((res) => {
				const data = res.data;

				modalConfirmLoading.value = false;
				if (data.success) {
					modalVisible.value = false;

					handleQuery({
						page: pagination.value.current,
						size: pagination.value.pageSize,
					});

					message.success("保存成功！");
				} else {
					message.error(data.message);
				}
			});
		};

		const add = () => {
			modalVisible.value = true;
			user.value = {};
		};

		const handleDelete = (id: any) => {
			axios.delete("/user/delete/" + id).then((res) => {
				const data = res.data;

				if (data.success) {
					modalVisible.value = false;
					modalConfirmLoading.value = false;

					handleQuery({
						page: pagination.value.current,
						size: pagination.value.pageSize,
					});
					message.success("删除成功！");
				} else {
					message.error("删除失败！");
				}
			});
		};

		onMounted(() => {
			handleQueryCategory();
		});

		const categoryId = ref();
		categoryId.value = [];

		const level = ref();
		level.value = [];

		let categorys: any;
		/**
		 * 分类数据查询
		 **/
		const handleQueryCategory = () => {
			loading.value = true;
			axios.get("/category/all").then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					categorys = data.content;
					console.log("初始数据: ", data.content);

					// level.value = [];
					level.value = Tool.array2Tree(categorys, "0");

					console.log("树形数据: ", level);

					// 目录查询完成之后再进行用户的渲染
					handleQuery({
						page: 1,
						size: pagination.value.pageSize,
					});
				} else {
					message.error(data.message);
				}
			});
		};

		const getCategoryName = (id: any) => {
			for (var i = 0; i < categorys.length; i++) {
				if (categorys[i].id === id) {
					return categorys[i].name;
				}
			}
		};

		return {
			columns,
			users,
			pagination,
			loading,
			handleTableChange,

			modalVisible,
			edit,
			user,
			modalHandleOk,
			modalConfirmLoading,
			add,
			handleDelete,
			search,
			handleQuery,

			categoryId,
			level,
			handleQueryCategory,
			getCategoryName,
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
