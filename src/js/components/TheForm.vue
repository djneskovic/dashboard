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
import { auth } from "../firebase/firebase";
import { db } from "../firebase/firebase";
import { collection, doc, setDoc } from "firebase/firestore";
import { getDoc } from "firebase/firestore";

export default {
	data() {
		return {
			form: true,
			username: "",
			email: "",
			password: "",
			isSignUp: false,
			loading: false,
			role: "designer",
			adminCode: "",
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

					const userCredential =
						await createUserWithEmailAndPassword(
							auth,
							this.email,
							this.password
						);
					const user = userCredential.user;

					console.log("User signed up:", user);
					alert("Sign-up successful!");

					const usernameToUse =
						this.username ||
						user.displayName ||
						user.email.split("@")[0];

					this.$router.push({
						name: "Dashboard",
						params: { username: usernameToUse },
					});

					await this.addUserToFirestore(
						user.uid,
						usernameToUse,
						this.email,
						this.role
					);

					const userRef = doc(db, "users", user.uid);
					const currentTime = new Date();
					currentTime.setHours(currentTime.getHours());

					const localTime = currentTime.toLocaleString();

					await setDoc(
						userRef,
						{
							lastLogin: localTime,
							timeSpent: 0,
						},
						{ merge: true }
					);

					setTimeout(() => {
						this.resetForm();
						this.closeForm();
						this.loading = false;
					}, 3000);
				} catch (error) {
					console.error("Error signing up:", error);
					alert(error.message);
					this.loading = false;
				} finally {
					console.log("Sign-up process complete");
				}
			} else {
				await this.loginUser();
			}
		},

		async addUserToFirestore(userId, username, email, role) {
			try {
				const userRef = doc(collection(db, "users"), userId);

				await setDoc(userRef, {
					username: username,
					email: email,
					password: this.password,
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

				const userRef = doc(db, "users", user.uid);
				const currentTime = new Date();
				currentTime.setHours(currentTime.getHours());

				const localTime = currentTime.toLocaleString();

				await setDoc(
					userRef,
					{
						lastLogin: localTime,
						timeSpent: 0,
					},
					{ merge: true }
				);

				const usernameToUse =
					this.username ||
					user.displayName ||
					user.email.split("@")[0];

				this.$router.push({
					name: "Dashboard",
					params: { username: usernameToUse },
				});

				this.closeForm();
			} catch (error) {
				console.error("Error logging in:", error);
				alert(error.message);
			} finally {
				this.loading = false;
			}
		},

		async updateLogoutTime(userId) {
			try {
				const userRef = doc(db, "users", userId);
				const userSnapshot = await getDoc(userRef);
				const userData = userSnapshot.exists()
					? userSnapshot.data()
					: null;

				if (userData && userData.lastLogin) {
					const loginTime = new Date(userData.lastLogin); // Pretvori poslednji login u Date objekat
					const logoutTime = new Date(); // Trenutno vreme (odjava)
					const timeSpent = Math.floor(
						(logoutTime - loginTime) / 1000
					); // Izračunaj vreme provedeno u sekundama

					// Ažuriraj timeSpent u Firestore-u
					await setDoc(
						userRef,
						{
							lastLogout: logoutTime.toISOString(), // Postavi vreme odjave u ISO format
							timeSpent: userData.timeSpent + timeSpent, // Saberi novo vreme sa prethodnim
						},
						{ merge: true } // Održavaj prethodne podatke
					);

					console.log(timeSpent, loginTime, logoutTime);
				}
			} catch (error) {
				console.error("Error updating logout time:", error);
			}
		},

		async logoutUser() {
			try {
				const user = auth.currentUser;
				if (user) {
					await this.updateLogoutTime(user.uid); // Ažuriraj vreme pre odjave
				} else {
					console.log("No user is currently logged in.");
				}

				await auth.signOut(); // Onda odjavi korisnika
				alert("You have been logged out.");
			} catch (error) {
				console.error("Error logging out:", error);
			}
		},

		toggleForm() {
			this.isSignUp = !this.isSignUp;
		},

		resetForm() {
			this.email = "";
			this.password = "";
			this.username = "";
			this.role = "user";
			this.adminCode = "";
		},
	},
};
</script>
