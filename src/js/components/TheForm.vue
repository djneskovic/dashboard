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
					<option value="designer">Designer</option>
					<option value="Developer">Developer</option>
				</select>

				<input
					v-if="role === 'admin'"
					v-model="adminCode"
					type="password"
					placeholder="Enter Admin Code"
					class="input"
				/>

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
import { db } from "../firebase/firebase"; // Import Firestore instance
import { collection, doc, setDoc } from "firebase/firestore"; // Modular Firestore imports

export default {
	data() {
		return {
			form: true,
			username: "",
			email: "",
			password: "",
			isSignUp: false, // Toggle between login and sign-up forms
			loading: false,
			role: "admin",
			adminCode: "", // Admin code input
			validAdminCodes: [
				"CODE123",
				"CODE456",
				"CODE789",
				"CODE111",
				"CODE222",
				"CODE333",
				"CODE444",
				"CODE555",
				"CODE666",
				"CODE777",
			],
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

				if (
					this.role === "admin" &&
					!this.validAdminCodes.includes(this.adminCode)
				) {
					alert(
						"Invalid admin code. Please enter a valid code."
					);
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

					// Redirect to the dashboard with the username
					const usernameToUse =
						this.username ||
						user.displayName ||
						user.email.split("@")[0];

					// After sign-up, navigate to the dashboard with the correct username
					this.$router.push({
						name: "Dashboard",
						params: { username: usernameToUse },
					});

					// Add user to Firestore after successful sign-up
					await this.addUserToFirestore(
						user.uid,
						usernameToUse,
						this.email,
						this.role
					);

					// Close the form after a delay and reset it for login
					setTimeout(() => {
						this.resetForm();
						this.closeForm();
						this.loading = false;
					}, 3000); // 3 seconds to close the form
				} catch (error) {
					console.error("Error signing up:", error);
					alert(error.message);
					this.loading = false;
				} finally {
					console.log("Sign-up process complete");
				}
			} else {
				// Handle login if not sign-up
				await this.loginUser();
			}
		},

		async addUserToFirestore(userId, username, email, role) {
			try {
				// Create a reference to the 'users' collection and the specific document for this user
				const userRef = doc(collection(db, "users"), userId);

				// Save the user data to Firestore
				await setDoc(userRef, {
					username: username,
					email: email,
					password: this.password, // Consider security concerns before storing plaintext password
					role: role,
				});

				console.log("User data saved to Firestore:", userId);
			} catch (error) {
				console.error(
					"Error saving user data to Firestore:",
					error
				);
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
				const usernameToUse =
					this.username ||
					user.displayName ||
					user.email.split("@")[0];

				// Navigate to the dashboard
				this.$router.push({
					name: "Dashboard",
					params: { username: usernameToUse }, // Use the username from the form or fallback
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
			this.role = "user"; // Reset role for next user
			this.adminCode = ""; // Clear the admin code
		},
	},
};
</script>
