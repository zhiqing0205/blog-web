<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-14 11:14:15
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
			<a-form layout="inline" :model="search">
				<a-form-item>
					<a-input v-model:value="search.name" placeholder="电子书名称"> </a-input>
				</a-form-item>

				<a-form-item>
					<a-button type="primary" @click="handleQuery({page: 1, size: pagination.pageSize})"> 查询 </a-button>
				</a-form-item>
				<a-form-item>
					<a-button type="primary" @click="add" size="lager">增加</a-button>
				</a-form-item>
			</a-form>

			<a-table
				:columns="columns"
				:data-source="ebooks"
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
		title="电子书表单"
		:confirm-loading="modalConfirmLoading"
		@ok="modalHandleOk"
	>
		<a-form :model="ebook" :label-col="{ span: 4 }" :wrapper-col="wrapperCol">
			<a-form-item label="封面">
				<a-input v-model:value="ebook.cover" />
			</a-form-item>
			<a-form-item label="名称">
				<a-input v-model:value="ebook.name" />
			</a-form-item>
			<a-form-item label="分类一">
				<a-input v-model:value="ebook.category1Id" />
			</a-form-item>
			<a-form-item label="分类二">
				<a-input v-model:value="ebook.category2Id" />
			</a-form-item>
			<a-form-item label="描述">
				<a-input v-model:value="ebook.description" />
			</a-form-item>
		</a-form>
	</a-modal>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import {Tool} from "@/util/tool"

const columns = [
	{
		dataIndex: "cover",
		key: "cover",
		slots: { title: "headerCellCover", customRender: "bodyCell" },
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
	},
	{
		title: "分类1",
		dataIndex: "category1Id",
		key: "category_1",
	},
	{
		title: "分类2",
		key: "category_2",
		dataIndex: "category2Id",
	},
	{
		title: "文档数",
		key: "doc_count",
		dataIndex: "docCount",
	},
	{
		title: "阅读数",
		key: "view_count",
		dataIndex: "viewCount",
	},
	{
		title: "点赞数",
		key: "vote_count",
		dataIndex: "voteCount",
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
		const ebooks = ref();

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
			axios
				.get("/ebook/list", {
					params: {
						page: params.page,
						size: params.size,
                        name: search.value.name
					},
				})
				.then((res) => {
					loading.value = false;
					const data = res.data;

					if (data.success) {
						ebooks.value = data.content.list;
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

		const ebook = ref({});
		const modalVisible = ref<boolean>(false);
		const modalConfirmLoading = ref<boolean>(false);

		const edit = (record: any) => {
			modalVisible.value = true;
			ebook.value = Tool.copy(record);
		};

		const modalHandleOk = () => {
			modalConfirmLoading.value = true;
			axios.post("/ebook/save", ebook.value).then((res) => {
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
			ebook.value = {};
		};

		const handleDelete = (id: any) => {
			axios.delete("/ebook/delete/" + id).then((res) => {
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
			handleQuery({
				page: 1,
				size: pagination.value.pageSize,
			});
		});

		return {
			columns,
			ebooks,
			pagination,
			loading,
			handleTableChange,

			modalVisible,
			edit,
			ebook,
			modalHandleOk,
			modalConfirmLoading,
			add,
			handleDelete,
            search,
            handleQuery
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
