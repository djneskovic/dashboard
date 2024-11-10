<template>
	<TheHeader />

	<router-view> </router-view>
</template>

<script>
import TheHeader from "./js/components/TheHeader.vue";
import "../public/css/style.css";
import "../public/css/hamburgers.css";
export default {
	components: {
		TheHeader,
	},
};
</script>

<style></style>
