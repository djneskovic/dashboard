<template>
	<div>
		<h1>Welcome to the dashboard, {{ username }}!</h1>
		<!-- Your dashboard content here -->
	</div>
</template>

<script>
export default {
	props: {
		username: {
			type: String,
			required: true,
		},
	},
	mounted() {
		console.log(`Welcome, ${this.username}`); // Log the username
	},
};
</script>
