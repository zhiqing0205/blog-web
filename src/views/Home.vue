<template>
	<a-layout>
		<a-layout>
			<a-layout-sider width="200" style="background: #fff">
				<a-menu
					v-model:openKeys="openKeys"
					v-model:selectedKeys="selectedKeys"
					mode="inline"
					theme="dark"
					:inline-collapsed="collapsed"
				>
					<a-menu-item key="welcome">
						<router-link :to="'/'">
							<MailOutlined />
							<span>欢迎</span>
						</router-link>
					</a-menu-item>
					<a-sub-menu v-for="item in level" :key="item.id">
						<template v-slot:title>
                            <span><user-outlined /> {{item.name}} </span>
						</template>
						
						<a-menu-item v-for="child in item.children" :key="child.id">
                            <MailOutlined /><span> {{child.name}} </span>
                        </a-menu-item>

					</a-sub-menu>
					<!-- <a-sub-menu key="sub2">
						<template #icon>
							<AppstoreOutlined />
						</template>
						<template #title>Navigation Two</template>
						<a-menu-item key="9">Option 9</a-menu-item>
						<a-menu-item key="10">Option 10</a-menu-item>
						<a-sub-menu key="sub3" title="Submenu">
							<a-menu-item key="11">Option 11</a-menu-item>
							<a-menu-item key="12">Option 12</a-menu-item>
						</a-sub-menu>
					</a-sub-menu> -->
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
				<a-list
					item-layout="vertical"
					size="large"
					:grid="{ gutter: 20, column: 3 }"
					:pagination="pagination"
					:data-source="ebooks"
				>
					<template #renderItem="{ item }">
						<a-list-item key="item.name">
							<template #actions>
								<span v-for="{ type, text } in actions" :key="type">
									<component :is="type" style="margin-right: 8px" />
									{{ text }}
								</span>
							</template>
							<a-list-item-meta :description="item.description">
								<template #title>
									<a :href="item.href">{{ item.name }}</a>
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
		const actions: Record<string, string>[] = [
			{ type: "StarOutlined", text: "156" },
			{ type: "LikeOutlined", text: "156" },
			{ type: "MessageOutlined", text: "2" },
		];

		const level = ref();
		level.value = [];
		/**
		 * 分类数据查询
		 **/
		const handleQueryCategory = () => {
			// loading.value = true;
			axios.get("/category/all").then((res) => {
				// loading.value = false;
				const data = res.data;

				if (data.success) {
					var categorys = data.content;
					console.log("初始数据: ", data.content);

					// level.value = [];
					level.value = Tool.array2Tree(categorys, 0);

					console.log("树形数据: ", level);

					// 目录查询完成之后再进行电子书的渲染
				} else {
					message.error(data.message);
				}
			});
		};

		onMounted(() => {
            handleQueryCategory();
			axios
				.get("/ebook/list", {
					params: {
						page: 1,
						size: 1000,
					},
				})
				.then((res) => {
					console.log("onMounted");
					ebooks.value = res.data.content.list;
				});
		});

		return {
			ebooks,
			pagination,
			actions,

			handleQueryCategory,
			level,
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
