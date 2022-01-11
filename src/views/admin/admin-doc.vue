<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-12 00:49:07
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
			<a-row :gutter="24">
				<a-col :span="8">
					<p>
						<a-form layout="inline" :model="search">
							<a-form-item>
								<a-button type="primary" @click="handleQuery()">
									查询
								</a-button>
							</a-form-item>
							<a-form-item>
								<a-button type="primary" @click="add" size="lager"
									>增加</a-button
								>
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
						<template #bodyCell="{ column, record }">
							<template v-if="column.key === 'action'">
								<span>
									<a-space>
										<a-button type="primary" @click="edit(record)" size="small">
											编辑
										</a-button>
										<a-popconfirm
											title="是否删除，删除后不可恢复"
											ok-text="是"
											cancel-text="否"
											@confirm="handleDelete(record.id)"
										>
											<a-button type="primary" danger size="small">
												删除
											</a-button>
										</a-popconfirm></a-space
									>
								</span>
							</template>

							<template v-else-if="column.key === 'name'">
								{{ record.sort }} {{ record.name }}
							</template>
						</template>
					</a-table>
				</a-col>
				<a-col :span="16">
					<a-form
						:model="doc"
						:label-col="{ span: 4 }"
						:wrapper-col="wrapperCol"
					>
						<p>
							<a-button type="primary" @click="handleSave()"> 保存 </a-button>
						</p>
						<a-form-item>
							<a-input v-model:value="doc.name" placeholder="请输入文档名称"/>
						</a-form-item>
						<a-form-item >
							<a-tree-select
								v-model:value="doc.parent"
								style="width: 100%"
								:dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
								:tree-data="treeSelectData"
								placeholder="请选择父文档"
								tree-default-expand-all
								:replaceFields="{ title: 'name', key: 'id', value: 'id' }"
							>
							</a-tree-select>
						</a-form-item>
						<a-form-item>
							<a-input v-model:value="doc.sort" placeholder="请输入顺序字段"/>
						</a-form-item>

						<a-form-item>
							<div style="border: 1px solid #ccc; z-index: 10000" id="editor">
								
							</div>
						</a-form-item>
					</a-form>
				</a-col>
			</a-row>
		</a-layout-content>
	</a-layout>

	<!-- <a-modal
		v-model:visible="modalVisible"
		title="文档表单"
		:confirm-loading="modalConfirmLoading"
		@ok="modalHandleOk"
	>
		
	</a-modal> -->
</template>

<script lang="ts">
import {
	createVNode,
	defineComponent,
	onMounted,
	ref,
} from "vue";
import axios from "axios";
import { message } from "ant-design-vue";
import { Tool } from "@/util/tool";
import { useRouter } from "vue-router";
import { Modal } from "ant-design-vue";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import E from "wangeditor"
import hljs from 'highlight.js'
import 'highlight.js/styles/monokai-sublime.css'

const columns = [
	{
		title: "名称",
		key: "name",
		slots: { customRender: "bodyCell" },
	},
	{
		title: "操作",
		key: "action",
		slots: { customRender: "bodyCell" },
	},
];

export default defineComponent({
	components: { },
	setup() {
		const route1 = useRouter();
		const route = route1.currentRoute;
    
		const docs = ref();

		const loading = ref(false);

		const search = ref();
		search.value = {};

		const level = ref();
		level.value = [];

        let editor : any = null;

		/**
		 * 数据查询
		 **/
		const handleQuery = () => {
			loading.value = true;
			axios.get("/doc/all/" + route.value.params.ebookId).then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					docs.value = data.content;
					console.log("初始数据: ", data.content);

					level.value = [];
					level.value = Tool.array2Tree(docs.value, '0');

					console.log("树形数据: ", level);

					// 父文档下拉框初始化，相当于点击新增
					treeSelectData.value = Tool.copy(level.value) || [];
					// 为选择树添加一个"无"
					treeSelectData.value.unshift({ id: 0, name: "无" });
				} else {
					message.error(data.message);
				}
			});
		};

        /**
		 * 富文本内容查询
		 **/
		const handleQueryContent = () => {
			axios.get("/doc/content/" + doc.value.id).then((res) => {
				const data = res.data;

				if (data.success) {
					editor.txt.html(data.content);
				} else {
					message.error(data.message);
				}
			});
		};

		const doc = ref();
        doc.value = {
            ebookId: route.value.params.ebookId,
        };
		const modalVisible = ref<boolean>(false);
		const modalConfirmLoading = ref<boolean>(false);
		const treeSelectData = ref();
		treeSelectData.value = [];

		const edit = (record: any) => {
			modalVisible.value = true;
			doc.value = Tool.copy(record);
            editor.txt.clear();
            handleQueryContent();
            
			// 不能选择当前节点及其所有子孙节点，作为父节点，会使树断开
			treeSelectData.value = Tool.copy(level.value);
			setDisable(treeSelectData.value, record.id);

			// 为选择树添加一个"无"
			treeSelectData.value.unshift({ id: 0, name: "无" });
		};

		const handleSave = () => {
			modalConfirmLoading.value = true;
            doc.value.content = editor.txt.html();
			axios.post("/doc/save", doc.value).then((res) => {
				const data = res.data;

				modalConfirmLoading.value = false;
				if (data.success) {
					modalVisible.value = false;
                    
					handleQuery();
                    // doc.value.name = doc.value.sort = '';
                    // doc.value.parent = null;
                    // editor.txt.clear();
                    
					message.success("保存成功！");
				} else {
					message.error(data.message);
				}
			});
		};

		const add = () => {
			modalVisible.value = true;
            editor.txt.clear();
            
			doc.value = {
				ebookId: route.value.params.ebookId,
			};

			// 不能选择当前节点及其所有子孙节点，作为父节点，会使树断开
			treeSelectData.value = Tool.copy(level.value);
			// 为选择树添加一个"无"
			treeSelectData.value.unshift({ id: 0, name: "无" });
		};

		/**
		 * 将某节点及其子孙节点全部置为disabled
		 */
		const setDisable = (treeSelectData: any, id: any) => {
			// console.log(treeSelectData, id);
			// 遍历数组，即遍历某一层节点
			for (let i = 0; i < treeSelectData.length; i++) {
				const node = treeSelectData[i];
				if (node.id === id) {
					// 如果当前节点就是目标节点
					console.log("disabled", node);
					// 将目标节点设置为disabled
					node.disabled = true;

					// 遍历所有子节点，将所有子节点全部都加上disabled
					const children = node.children;
					if (Tool.isNotEmpty(children)) {
						for (let j = 0; j < children.length; j++) {
							setDisable(children, children[j].id);
						}
					}
				} else {
					// 如果当前节点不是目标节点，则到其子节点再找找看。
					const children = node.children;
					if (Tool.isNotEmpty(children)) {
						setDisable(children, id);
					}
				}
			}
		};

		const ids: Array<string> = [];
		const deleteDocNames: Array<string> = [];
		/**
		 * 得到某节点及其子孙节点id
		 */
		const getDeleteIds = (treeSelectData: any, id: any) => {
			// console.log(treeSelectData, id);
			// 遍历数组，即遍历某一层节点
			for (let i = 0; i < treeSelectData.length; i++) {
				const node = treeSelectData[i];
				if (node.id === id) {
					// 如果当前节点就是目标节点
					console.log("delete", node);
					// 将目标节点设置为disabled
					ids.push(id);
					deleteDocNames.push(node.name);

					// 遍历所有子节点，将所有子节点全部都加上disabled
					const children = node.children;
					if (Tool.isNotEmpty(children)) {
						for (let j = 0; j < children.length; j++) {
							getDeleteIds(children, children[j].id);
						}
					}
				} else {
					// 如果当前节点不是目标节点，则到其子节点再找找看。
					const children = node.children;
					if (Tool.isNotEmpty(children)) {
						getDeleteIds(children, id);
					}
				}
			}
		};

		const handleDelete = (id: number) => {
			ids.length = 0;
			deleteDocNames.length = 0;
			getDeleteIds(level.value, id);
			Modal.confirm({
				title: "您真的确定要删除吗",
				icon: createVNode(ExclamationCircleOutlined),
				content: createVNode(
					"div",
					{ style: "color:red;" },
					// "Some descriptions"
					"将删除：【" +
						deleteDocNames.join("，") +
						"】删除后不可恢复，确认删除？"
				),
				onOk() {
					console.log("OK");

					console.log(ids);
					axios.delete("/doc/delete/" + ids.join(",")).then((res) => {
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
				},
				onCancel() {
					console.log("Cancel");
				},
				class: "test",
			});
		};

		onMounted(() => {
			handleQuery();
            editor = new E("#editor");
            editor.highlight = hljs;
            editor.create();
		});

		return {
			columns,
			docs,
			loading,

			modalVisible,
			edit,
			doc,
			handleSave,
			modalConfirmLoading,
			add,
			handleDelete,
			search,
			handleQuery,
			level,
			treeSelectData,

		};
	},
});
</script>

<style src="@wangeditor/editor/dist/css/style.css"></style>
<style scoped>
img {
	width: 50px;
	height: 50px;
	line-height: 50px;
	border-radius: 8%;
	margin: 5px 0;
}
</style>
