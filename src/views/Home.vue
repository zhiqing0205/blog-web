<template>
	<a-layout>
		<a-layout>
			<a-layout-sider width="200" style="background: #fff">
				<a-menu
					mode="inline"
					:theme="theme"
					:openKeys="openKeys"
					@click="handleClick"
					:selectedKeys="current"
				>
					<a-menu-item key="welcome">
						<MailOutlined />
						<span>欢迎</span>
					</a-menu-item>
					<a-sub-menu v-for="item in level" :key="item.id">
						<template v-slot:title>
							<span><user-outlined /> {{ item.name }} </span>
						</template>

						<a-menu-item v-for="child in item.children" :key="child.id">
							<MailOutlined /><span> {{ child.name }} </span>
						</a-menu-item>
					</a-sub-menu>
				</a-menu>
			</a-layout-sider>
			<a-layout-content
				:style="{
					background: '#fff',
					padding: '24px',
					margin: 0,
					minHeight: '280px',
				}"
			>
				<div class="welcome" v-show="isShowWelcome">
					<h1>欢迎来到ziuch Blog</h1>
				</div>

				<a-list
					item-layout="vertical"
					size="large"
					:grid="{ gutter: 20, column: 3 }"
					:pagination="pagination"
					:data-source="ebooks"
					:loading="loading"
					v-show="!isShowWelcome"
				>
					<template #renderItem="{ item }">
						<a-list-item key="item.name">
							<template #actions>
								<span>
									<component
										v-bind:is="'FileOutlined'"
										style="margin-right: 8px"
									/>
									{{ item.docCount }}
								</span>
								<span>
									<component
										v-bind:is="'UserOutlined'"
										style="margin-right: 8px"
									/>
									{{ item.viewCount }}
								</span>
								<span>
									<component
										v-bind:is="'LikeOutlined'"
										style="margin-right: 8px"
									/>
									{{ item.voteCount }}
								</span>
							</template>
							<a-list-item-meta :description="item.description">
								<template #title>
									<router-link :to="'/doc/' + item.id">
										{{ item.name }}
									</router-link>
								</template>
								<template #avatar><a-avatar :src="item.cover" /></template>
							</a-list-item-meta>
						</a-list-item>
					</template>
				</a-list>
			</a-layout-content>
		</a-layout>
	</a-layout>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue"; // @ is an alias to /src
import axios from "axios";
import { Tool } from "@/util/tool";
import { message } from "ant-design-vue";

export default defineComponent({
	name: "Home",

	setup() {
		console.log("setup");
		const ebooks = ref();

		const pagination = {
			onChange: (page: number) => {
				console.log(page);
			},
			pageSize: 6,
		};

		const isShowWelcome = ref(true);
		let category2Id = 0;
		const handleClick = (value: any) => {
			console.log("click", value);

			var key = value.key;
			current.value = [key];
			if (key === "welcome") {
				isShowWelcome.value = true;
			} else {
				isShowWelcome.value = false;
				category2Id = key;
				handleQueryEbookByCategoryId();
			}
		};

		const level = ref();
		level.value = [];
		const loading = ref(false);
		const openKeys = ref();
		const current = ref<string[]>(["welcome"]);
		/**
		 * 分类数据查询
		 **/
		const handleQueryCategory = () => {
			loading.value = true;
			axios.get("/category/all").then((res) => {
				loading.value = false;
				const data = res.data;

				if (data.success) {
					var categorys = data.content;
					console.log("初始数据: ", data.content);

					// level.value = [];
					level.value = Tool.array2Tree(categorys, "0");

					console.log("树形数据: ", level);

					if (level.value.length > 2)
						openKeys.value = [
							level.value[0].id,
							level.value[1].id,
							level.value[2].id,
						];
					else if (level.value.length > 1)
						openKeys.value = [level.value[0].id, level.value[1].id];
					else if (level.value.length > 0) openKeys.value = [level.value[0].id];

					// 目录查询完成之后再进行电子书的渲染
				} else {
					message.error(data.message);
				}
			});
		};

		// 根据分类id查询书籍
		const handleQueryEbookByCategoryId = () => {
			axios
				.get("/ebook/list", {
					params: {
						page: 1,
						size: 1000,
						category2Id: category2Id,
					},
				})
				.then((res) => {
					console.log("onMounted");
					ebooks.value = res.data.content.list;
				});
		};

		// 自动设置黑夜模式
		const theme = ref("");
		const handleTheme = () => {
			var d = new Date();
			var hour = d.getHours(); //得到小时数
			// var hour = 18;
			theme.value = hour >= 18 || hour <= 6 ? "dark" : "";
		};

		onMounted(() => {
			handleQueryCategory();
			handleTheme();
		});

		return {
			ebooks,
			pagination,

			handleQueryCategory,
			level,

			openKeys,
			handleClick,
			isShowWelcome,
			handleQueryEbookByCategoryId,

			loading,
			theme,
			current,
		};
	},
});
</script>

<style scoped>
.ant-avatar {
	width: 50px;
	height: 50px;
	line-height: 50px;
	border-radius: 8%;
	margin: 5px 0;
}
</style>
