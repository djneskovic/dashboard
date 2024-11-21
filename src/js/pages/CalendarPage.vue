<template>
	<main class="calendar-page">
		<div class="container">
			<h2 class="text-green-950">Task Calendar</h2>
			<p class="text-green-950">
				View, add, and organize your tasks on the calendar.
			</p>
			<TheCalendar />
		</div>
	</main>
</template>

<script>
import TheCalendar from "../components/TheCalendar.vue";

export default {
	components: {
		TheCalendar,
	},
};
</script>
