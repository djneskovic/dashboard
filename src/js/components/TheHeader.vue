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
				<p>
					Welcome <span>{{ username }}</span>
				</p>
				<!-- Display the username here -->
				<li class="first-child">
					<a href="">Overview</a>
				</li>
				<li>
					<a href="">Profile</a>
				</li>
				<li>
					<a href="">Tasks</a>
				</li>
				<li>
					<a href="">Calendar</a>
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
						@click="toggleMenu()"
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

	<the-form v-if="formVisible" @close-form="closeForm()"></the-form>
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
			} else {
				this.isLoggedIn = false;
				this.username = "";
			}
		});
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

		async logout() {
			try {
				await signOut(auth);
				this.isLoggedIn = false;
				this.username = "";
				alert("You are logged out.");
				this.$router.push({ name: "Home" });
			} catch (error) {
				console.error("Error logging out:", error);
				alert("Logout failed. Please try again.");
			}
		},

		toggleMenu() {
			this.isActive = !this.isActive;
		},
	},
};
</script>
