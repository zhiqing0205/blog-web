<!--
 * @Description: 
 * @Version: 2.0
 * @Author: Zhiqing Zhong
 * @Date: 2021-11-06 19:33:53
 * @LastEditors: Zhiqing Zhong
 * @LastEditTime: 2022-01-23 00:45:50
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
				<div v-if="level.length === 0"><a-empty /></div>
				<a-row v-else :gutter="24">
					<a-col :span="8">
						<a-card size="small" title="大纲">
							<a-tree
								v-if="level.length > 0"
								class="tree"
								block-node
								:tree-data="level"
								@select="onSelect"
								:replaceFields="{ title: 'name', key: 'id', value: 'id' }"
								:defaultExpandAll="true"
								:defaultSelectedKeys="defaultSelectedKeys"
							/>
						</a-card>
					</a-col>
					<a-col :span="16">
						<div style="color: #a7acb5">
							<h1 style="font-size: 28px">{{ doc.name }}</h1>
							<div>
								<span> 点赞数：{{ doc.voteCount }} &nbsp; &nbsp; </span>
								<span> 阅读数：{{ doc.viewCount }} </span>
							</div>

							<a-divider style="height: 2px; background-color: #448ef7" />
						</div>
						<div v-if="html === ''"><a-empty /></div>
						<div v-else class="wangeditor" v-html="html"></div>
						<div style="text-align: center; padding: 15px">
							<a-button
								type="primary"
								shape="round"
								size="large"
								@click="vote()"
							>
								<template #icon><like-outlined /></template>
								点赞 &nbsp; {{ doc.voteCount }}
							</a-button>
						</div>
						<a-back-top />
					</a-col>
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
import { useRouter } from "vue-router";

export default defineComponent({
	components: {},
	setup() {
		const route1 = useRouter();
		const route = route1.currentRoute;

		const doc = ref();
		doc.value = {};

		const loading = ref(false);

		const level = ref();
		level.value = [];

		const html = ref();
		const defaultSelectedKeys = ref();
		/**
		 * 数据查询
		 **/
		const handleQuery = () => {
			loading.value = true;
			axios.get("/doc/all/" + route.value.params.ebookId).then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					console.log("初始数据: ", data.content);

					level.value = [];
					level.value = Tool.array2Tree(data.content, "0");

					if (Tool.isNotEmpty(level)) {
						defaultSelectedKeys.value = [level.value[0].id];
						handleQueryContent(level.value[0].id);
						doc.value = level.value[0];
					}
					console.log("level", level.value);
				} else {
					message.error(data.message);
				}
			});
		};

		/**
		 * 内容数据查询
		 **/
		const handleQueryContent = (id: string) => {
			loading.value = true;
			axios.get("/doc/content/" + id).then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					html.value = data.content;
					console.log(html.value);
				} else {
					message.error(data.message);
				}
			});
		};

		/**
		 * 点赞
		 **/
		const vote = () => {
			loading.value = true;
			axios.get("/doc/vote/" + doc.value.id).then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					doc.value.voteCount++;
					message.success("点赞成功");
				} else {
					message.error(data.message);
				}
			});
		};

		const onSelect = (selectedKeys: any, info: any) => {
			console.log("select", selectedKeys, info);
			if (Tool.isNotEmpty(selectedKeys)) {
				handleQueryContent(selectedKeys[0]);
				doc.value = info.selectedNodes[0].props;
			}
		};

		onMounted(() => {
			handleQuery();
		});

		return {
			loading,
			handleQuery,
			level,
			html,
			onSelect,
			defaultSelectedKeys,
			doc,
			vote,
		};
	},
});
</script>

<style lang="less">
.wangeditor {
	p,
	li,
	td,
	th,
	blockquote {
		white-space: pre-wrap; /* 显示空格 */
	}

	/* 表格 */
	table {
		border-collapse: collapse;
	}
	table th,
	table td {
		border: 1px solid #ccc;
		min-width: 50px;
		height: 20px;
		text-align: left;
	}
	table th {
		background-color: #f1f1f1;
		text-align: center;
	}

	/* 代码块 */
	pre > code {
		display: block;
		border: 1px solid hsl(0, 0%, 91%);
		border-radius: 4px 4px;
		text-indent: 0;
		background-color: #fafafa;
		padding: 10px;
		font-size: 14px;
	}

	/* 引用 */
	blockquote {
		display: block;
		border-left: 8px solid #d0e5f2;
		padding: 10px 10px;
		margin: 10px 0;
		background-color: #f1f1f1;
	}

	/* 列表 */
	ul,
	ol {
		margin: 10px 0 10px 20px;
	}

	/* 分割线 */
	hr {
		display: block;
		width: 90%;
		margin: 20px auto;
		border: 0;
		height: 1px;
		background-color: #ccc;
	}

	img {
		max-width: 100%;
	}
	/* 和antdv p冲突，覆盖掉 */
	blockquote p {
		font-family: "YouYuan";
		margin: 0px !important;
		font-size: 13px !important;
		font-weight: 400;
	}

	/* 和antdv h1冲突，覆盖掉 */
	h1 {
		font-size: 25px !important;
	}
}
</style>
>
