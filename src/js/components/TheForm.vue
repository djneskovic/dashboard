<template>
	<div class="overlay" v-if="form" @click.self="closeForm()"></div>

	<form @submit.prevent="submitForm()" v-if="form">
		<div
			class="form-container flex flex-col items-center justify-center text-center"
		>
			<!-- Login Form -->
			<div
				v-if="!isSignUp"
				class="login-form flex flex-col items-center justify-center"
			>
				<div class="form-logo">
					<img
						src="../../../public/images/logo_dark.png"
						alt="logo"
					/>
				</div>

				<h2 class="form-title text-green-950">
					Please Log In to access the dashboard
				</h2>

				<input
					v-model="email"
					type="text"
					placeholder="Email"
					class="input"
					required
				/>
				<input
					v-model="password"
					type="password"
					placeholder="Password"
					class="input"
					required
				/>

				<button
					type="button"
					@click="submitForm"
					class="btn log-in_btn text-green-50 bg-green-950"
				>
					Log In
				</button>

				<p class="text-green-950">
					Don't have an account?
					<button
						type="button"
						class="text-green-600 sign-up_btn"
						@click="toggleForm"
					>
						Sign up
					</button>
				</p>
			</div>

			<!-- Sign Up Form -->
			<div
				v-if="isSignUp"
				class="w-full flex flex-col items-center justify-center"
			>
				<div class="form-logo">
					<img
						src="../../../public/images/logo_dark.png"
						alt="logo"
					/>
				</div>

				<h2 class="form-title text-green-950">Sign Up for free!</h2>
				<input
					v-model="username"
					type="text"
					placeholder="Username"
					class="input"
					required
				/>

				<input
					v-model="email"
					type="text"
					placeholder="Email"
					class="input"
					required
				/>
				<input
					v-model="password"
					type="password"
					placeholder="Password"
					class="input"
					required
				/>

				<p class="role text-green-950">Choose Role</p>

				<select v-model="role" class="input">
					<option value="admin">Admin</option>
					<option value="user">User</option>
					<option value="moderator">Moderator</option>
				</select>

				<button
					type="button"
					@click="submitForm"
					class="btn btn_sign-up bg-green-950 text-green-50"
				>
					Sign Up
				</button>

				<p class="text-green-950">
					Already have an account?
					<button
						type="button"
						class="text-green-800"
						@click="toggleForm"
					>
						Log In
					</button>
				</p>
			</div>
			<div v-if="loading" class="loader"></div>
		</div>
	</form>
</template>

<script>
export default {
	data() {
		return {
			form: true,
			username: "",
			email: "",
			password: "",
			isSignUp: false,
			loading: false,
		};
	},

	emits: ["close-form"],

	methods: {
		closeForm() {
			this.$emit("close-form");
		},
		submitForm() {
			this.loading = true;
			console.log("Email:", this.email);
			console.log("Password:", this.password);

			this.email = "";
			this.password = "";

			setTimeout(() => {
				// Close the form after 3 seconds
				this.closeForm();
				// Hide loader
				this.loading = false;
			}, 3000);
		},
		toggleForm() {
			this.isSignUp = !this.isSignUp;
		},
	},
};
</script>

<style scoped>
/* Loader styles */
.loader {
	border: 4px solid #f3f3f3;
	border-top: 4px solid #4caf50;
	border-radius: 50%;
	width: 50px;
	height: 50px;
	animation: spin 2s linear infinite;
	z-index: 4; /* Ensure the loader is above other content */
	position: absolute; /* Required to apply z-index */
	top: 50%;
	transform: translate(-50%, -50%);
}
@keyframes spin {
	0% {
		transform: rotate(0deg);
	}
	100% {
		transform: rotate(360deg);
	}
}
</style>
