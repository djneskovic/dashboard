import { createRouter, createWebHashHistory } from "vue-router";

import HomePage from "../pages/HomePage.vue";

const routes = [
	{
		path: "/",
		redirect: "/home",
	},
	{
		name: "Home",
		path: "/home",
		component: HomePage,
	},
];

const router = createRouter({
	history: createWebHashHistory(),
	routes,
});

export default router;
