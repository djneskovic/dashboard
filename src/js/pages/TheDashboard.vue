<template>
	<main class="dashboard flex flex-col items-center justify-center">
		<div class="container">
			<div
				class="dashboard-items flex flex-col items-center justify-center"
			>
				<div class="dashboard-content">
					<h2 class="text-green-950">
						Welcome,
						<span class="text-green-600">
							{{ capitalizeFirstLetter(username) }}!</span
						>
					</h2>
					<p class="text-green-950">
						We're glad to have you here. Here's a quick
						overview of what you can do:
					</p>
				</div>

				<div class="dashboard-features">
					<div class="feature-item">
						<h3>Overview</h3>
						<p>
							Get a quick snapshot of your tasks, calendar,
							and recent activities.
						</p>
					</div>

					<div class="feature-item">
						<h3>Profile</h3>
						<p>
							Edit your personal information and customize
							your dashboard settings.
						</p>
					</div>

					<div class="feature-item">
						<h3>Tasks</h3>
						<p>
							Manage your tasks, assign deadlines, and
							track your progress.
						</p>
					</div>

					<div class="feature-item">
						<h3>Calendar</h3>
						<p>
							Plan and organize your events, meetings, and
							deadlines.
						</p>
					</div>

					<div class="feature-item">
						<h3>Activity Log</h3>
						<p>
							Track your actions and see what you’ve been
							up to.
						</p>
					</div>

					<div class="feature-item">
						<h3>Reports</h3>
						<p>
							Generate reports based on your tasks,
							progress, and activities.
						</p>
					</div>
				</div>

				<div class="dashboard-image">
					<img
						src="../../../public/images/dashboard_img.gif"
						alt=""
					/>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
export default {
	data() {
		return {
			username: this.$route.params.username || "User",
		};
	},

	methods: {
		capitalizeFirstLetter(str) {
			if (!str) return str;
			return str.charAt(0).toUpperCase() + str.slice(1);
		},
	},
};
</script>
