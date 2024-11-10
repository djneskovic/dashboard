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
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Import Firebase auth instance
// import { doc, setDoc, getDoc } from "firebase/firestore"; // Import Firestore methods
// import { db } from "../firebase/firebase"; // Import Firestore instance

export default {
	data() {
		return {
			form: true,
			username: "",
			email: "",
			password: "",
			isSignUp: false,
			loading: false,
			role: "admin",
		};
	},

	emits: ["close-form"],

	methods: {
		closeForm() {
			this.$emit("close-form");
		},

		async submitForm() {
			if (this.isSignUp) {
				// Validation for sign-up form
				if (
					!this.username ||
					!this.email ||
					!this.password ||
					!this.role
				) {
					alert("Please fill in all required fields.");
					return;
				}

				try {
					this.loading = true;

					// Step 1: Sign up the user with email and password
					const userCredential =
						await createUserWithEmailAndPassword(
							auth,
							this.email,
							this.password
						);
					const user = userCredential.user;

					console.log("User signed up:", user);
					alert("Sign-up successful!");

					// Close the form after 3 seconds and reset the form for login
					setTimeout(() => {
						this.resetForm();
						this.closeForm();
						this.loading = false;
					}, 3000); // 3 seconds to close the form
				} catch (error) {
					console.error("Error signing up:", error);
					alert(error.message);
				} finally {
					console.log("end");
				}
			} else {
				// Handle login if not sign-up
				await this.loginUser();
			}
		},

		async loginUser() {
			// Login the user with email and password
			try {
				this.loading = true;
				const userCredential = await signInWithEmailAndPassword(
					auth,
					this.email,
					this.password
				);
				const user = userCredential.user;

				console.log("User logged in:", user);
				alert("Login successful!");

				// After successful login, navigate to the dashboard with the correct username
				// Check if username is provided or fallback to the username from form
				const usernameToUse =
					this.username ||
					user.displayName ||
					user.email.split("@")[0];

				// After successful login, navigate to the dashboard
				this.$router.push({
					name: "Dashboard",
					params: { username: usernameToUse }, // Use username from form or fallback
				});

				// Optionally, close the form
				this.closeForm();
			} catch (error) {
				console.error("Error logging in:", error);
				alert(error.message);
			} finally {
				this.loading = false;
			}
		},

		toggleForm() {
			this.isSignUp = !this.isSignUp;
		},

		resetForm() {
			this.email = "";
			this.password = "";
			this.username = "";
			this.role = "user"; // Reset role
		},
	},
};
</script>
