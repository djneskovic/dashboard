import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import TheDashboard from "../pages/TheDashboard.vue";

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
	{
		name: "Dashboard",
		path: "/dashboard/:username",
		component: TheDashboard,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
