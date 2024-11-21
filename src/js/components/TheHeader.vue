<template>
	<nav id="navigation" class="bg-green-950">
		<!-- Only show nav-list if user is logged in -->
		<div v-if="isLoggedIn" class="nav-list" :class="{ active: isActive }">
			<ul>
				<div class="logo">
					<img
						src="../../../public/images/logo_white.png"
						alt=""
					/>
				</div>
				<li>
					<router-link
						:to="{
							name: 'Dashboard',
							params: { username: username },
						}"
						@click="closeMenu()"
					>
						Welcome <span>{{ username }}</span>
					</router-link>
				</li>
				<li class="first-child">
					<a href="">Overview</a>
				</li>
				<li>
					<router-link
						:to="{
							name: 'Profile',
							params: { username: username },
						}"
						@click="closeMenu()"
					>
						Profile
					</router-link>
				</li>
				<li>
					<a href="">Tasks</a>
				</li>
				<li>
					<router-link
						:to="{
							name: 'Calendar',
							params: { username: username },
						}"
						@click="closeMenu()"
						>Calendar</router-link
					>
				</li>
				<li>
					<a href="">Activity Log</a>
				</li>
				<li>
					<a href="">Reports</a>
				</li>
			</ul>
		</div>
		<div class="container">
			<div class="navigation flex justify-between items-center">
				<div class="hamburger" v-if="isLoggedIn">
					<button
						class="hamburger hamburger--elastic"
						:class="{ 'is-active': isActive }"
						type="button"
						@click="toggleMenu"
					>
						<span class="hamburger-box">
							<span class="hamburger-inner"></span>
						</span>
					</button>
				</div>
				<div class="logo">
					<img
						src="../../../public/images/logo_white.png"
						alt=""
					/>
				</div>
				<div
					v-if="isLoggedIn"
					class="logout-btn btn bg-green-50 text-green-950"
					@click="logout"
				>
					<button>Log Out</button>
				</div>
				<div
					v-else
					class="login-btn btn bg-green-50 text-green-950"
					@click="openForm"
				>
					<button>Log In</button>
				</div>
			</div>
		</div>
	</nav>

	<the-form v-if="formVisible" @close-form="closeForm"></the-form>
</template>

<script>
import TheForm from "./TheForm.vue";
import { auth } from "../firebase/firebase";
import { signOut, onAuthStateChanged } from "firebase/auth";

export default {
	components: {
		TheForm,
	},

	data() {
		return {
			formVisible: false,
			isLoggedIn: false,
			isActive: false,
			username: "",
			inactivityTimeout: null, // Timer reference
		};
	},

	created() {
		onAuthStateChanged(auth, (user) => {
			if (user) {
				this.isLoggedIn = true;
				this.username =
					user.displayName ||
					this.capitalizeFirstLetter(
						this.extractUsernameFromEmail(user.email)
					) ||
					"User";
				this.startInactivityTimer(); // Start the inactivity timer on login
				this.setupActivityListeners(); // Set up activity listeners
			} else {
				this.isLoggedIn = false;
				this.username = "";
				this.clearInactivityTimer(); // Clear timer on logout
				this.removeActivityListeners(); // Remove listeners on logout
			}
		});
	},

	beforeUnmount() {
		this.clearInactivityTimer();
		this.removeActivityListeners();
	},

	methods: {
		extractUsernameFromEmail(email) {
			return email.split("@")[0];
		},

		capitalizeFirstLetter(str) {
			if (!str) return str;
			return str.charAt(0).toUpperCase() + str.slice(1);
		},

		openForm() {
			this.formVisible = true;
		},

		closeForm() {
			this.formVisible = false;
		},

		closeMenu() {
			this.isActive = false;
		},

		async logout() {
			try {
				await signOut(auth);
				this.isLoggedIn = false;
				this.username = "";
				alert("You have been logged out.");
				this.$router.push({ name: "Home" });
			} catch (error) {
				console.error("Error logging out:", error);
				alert("Logout failed. Please try again.");
			}
		},

		toggleMenu() {
			this.isActive = !this.isActive;
		},

		startInactivityTimer() {
			this.clearInactivityTimer();
			this.inactivityTimeout = setTimeout(this.logout, 300000);
		},

		clearInactivityTimer() {
			if (this.inactivityTimeout) {
				clearTimeout(this.inactivityTimeout);
				this.inactivityTimeout = null;
			}
		},

		resetInactivityTimer() {
			this.startInactivityTimer();
		},

		setupActivityListeners() {
			window.addEventListener("mousemove", this.resetInactivityTimer);
			window.addEventListener("keydown", this.resetInactivityTimer);
			window.addEventListener("click", this.resetInactivityTimer);
		},

		removeActivityListeners() {
			window.removeEventListener(
				"mousemove",
				this.resetInactivityTimer
			);
			window.removeEventListener("keydown", this.resetInactivityTimer);
			window.removeEventListener("click", this.resetInactivityTimer);
		},
	},
};
</script>

<style scoped>
/* Add your scoped CSS here */
</style>
