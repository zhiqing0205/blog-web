<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-23 00:45:56
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
						<a-input v-model:value="search.name" placeholder="用户登录名">
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
				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'action'">
						<span>
							<a-space>
								<a-button type="primary" @click="resetPassword(record)"
									>重置密码</a-button
								>
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
		<a-form :model="user" :label-col="{ span: 4 }">
			<a-form-item label="登录名">
				<a-input v-model:value="user.loginName" :disabled="!!user.id" />
			</a-form-item>
			<a-form-item label="昵称">
				<a-input v-model:value="user.name" />
			</a-form-item>
			<a-form-item label="密码" v-show="!user.id">
				<a-input v-model:value="user.password" />
			</a-form-item>
		</a-form>
	</a-modal>

	<a-modal
		v-model:visible="resetModalVisible"
		title="重置密码表单"
		:confirm-loading="resetModalConfirmLoading"
		@ok="resetModalHandleOk"
	>
		<a-form :model="resetUser" :label-col="{ span: 4 }">
			<a-form-item label="新密码">
				<a-input v-model:value="resetUser.password" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";
declare let hexMd5: any;
declare let KEY: any;

const columns = [
	{
		title: "登陆名",
		key: "login_name",
		dataIndex: "loginName",
	},
	{
		title: "昵称",
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
						LoginName: search.value.name,
					},
				})
				.then((res) => {
					loading.value = false;
					const data = res.data;

					if (data.success) {
						users.value = data.content.list;
						// console.log("data.content.list: " + data.content.list);

						pagination.value.current = params.page;
						pagination.value.total = parseInt(data.content.total);
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
		};

		const modalHandleOk = () => {
			if (Tool.isEmpty(user.value.loginName)) {
				message.error("登录名为空！");
				return;
			}

			if (Tool.isEmpty(user.value.name)) {
				message.error("昵称为空！");
				return;
			}

			if (Tool.isEmpty(user.value.password)) {
				message.error("密码为空！");
				return;
			}

			var reg = new RegExp("^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{6,18}$");
			if (!reg.test(user.value.password)) {
				message.error("密码长度6-18，需包含数字大小字母三种其中两种");
				return;
			}

			modalConfirmLoading.value = true;
			var tempPassword = user.value.password;
			user.value.password = hexMd5(user.value.password + KEY);
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
					user.value.password = tempPassword;
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

		const resetUser = ref();
		resetUser.value = {};
		const resetModalVisible = ref(false);
		const resetModalConfirmLoading = ref(false);
		const resetPassword = (record: any) => {
			resetModalVisible.value = true;
			resetUser.value = Tool.copy(record);
			resetUser.value.password = null;
		};

		const resetModalHandleOk = () => {
			resetModalConfirmLoading.value = true;
			resetUser.value.password = hexMd5(resetUser.value.password + KEY);
			axios.post("/user/resetPassword", resetUser.value).then((res) => {
				const data = res.data;

				resetModalConfirmLoading.value = false;
				if (data.success) {
					resetModalVisible.value = false;

					handleQuery({
						page: pagination.value.current,
						size: pagination.value.pageSize,
					});

					message.success("密码重置成功！");
				} else {
					message.error(data.message);
				}
			});
		};

		onMounted(() => {
			handleQuery({
				page: pagination.value.current,
				size: pagination.value.pageSize,
			});
		});

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

			resetPassword,
			resetModalVisible,
			resetModalConfirmLoading,
			resetUser,
			resetModalHandleOk,
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
