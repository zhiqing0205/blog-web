<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-08 11:37:28
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2021-11-08 22:39:18
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
			<a-table :columns="columns" :data-source="ebooks" :row-key="(record) => record.id">

                <template #headerCellCover>
                    <span>
                        <smile-outlined />
                        封面
                    </span>
				</template>

				<template #bodyCell="{ column, record }">
					<template v-if="column.key === 'name'">
						<a>
							{{ record.name }}
						</a>
					</template>

                    <template v-else-if="column.key === 'doc_count'">
						<a>
							{{ record.docCount }}
						</a>
					</template>
					
					<template v-else-if="column.key === 'action'">
						<span>
                            <a-space><a-button type="primary">编辑</a-button>
                            <a-button type="primary" danger>删除</a-button></a-space>
						</span>
					</template>

				</template>
			</a-table>
		</a-layout-content>
	</a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import axios from "axios";

const columns = [

	{
		dataIndex: "cover",
		key: "cover",
        slots: { title: "headerCellCover" },
	},
	{
		title: "名称",
		dataIndex: "name",
		key: "name",
        slots: {customRender: "bodyCell"},
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
	components: {

	},
	setup() {

        const ebooks = ref();

        const pagination = ref({
			current: 1,
			pageSize: 10,
			total: 0,
		});

        onMounted(() => {
			axios.get("/ebook/list").then((res) => {
				console.log("onMounted");
				ebooks.value = res.data.content;
			});
		});

		return {
			columns,
            ebooks,
            pagination,
		};
	},
});
</script>
