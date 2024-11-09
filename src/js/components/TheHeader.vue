<template>
	<nav id="navigation" class="bg-green-950">
		<div class="container">
			<div class="navigation flex justify-between items-center">
				<div class="menu">meni</div>
				<div class="logo">
					<img
						src="../../../public/images/logo_white.png"
						alt=""
					/>
				</div>
				<div
					class="login-btn btn bg-green-50 text-green-950"
					@click="openForm()"
				>
					<button>LogIn</button>
				</div>
			</div>
		</div>
	</nav>
	<the-form v-if="formVisible" @close-form="closeForm()"></the-form>
</template>

<script>
import TheForm from "./TheForm.vue";
export default {
	components: {
		TheForm,
	},

	data() {
		return {
			formVisible: false,
		};
	},

	methods: {
		openForm() {
			this.formVisible = true;
			console.log("radi");
		},

		closeForm() {
			this.formVisible = false;
		},
	},
};
</script>
