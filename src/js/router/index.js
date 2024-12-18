import { createRouter, createWebHistory } from "vue-router";
import HomePage from "../pages/HomePage.vue";
import TheDashboard from "../pages/TheDashboard.vue";
import UserProfile from "../pages/UserProfile.vue";
import CalendarPage from "../pages/CalendarPage.vue";
import TasksPage from "../pages/TasksPage.vue";

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
	{
		name: "Profile",
		path: "/dashboard/:username/profile",
		component: UserProfile,
		props: true,
	},
	{
		name: "Calendar",
		path: "/dashboard/:username/calendar",
		component: CalendarPage,
		props: true,
	},
	{
		name: "Tasks",
		path: "/dashboard/:username/tasks",
		component: TasksPage,
		props: true,
	},
];

const router = createRouter({
	history: createWebHistory(),
	routes,
});

export default router;
