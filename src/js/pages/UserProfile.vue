<template>
	<main
		id="profile"
		class="flex flex-col items-center justify-center bg-green-50"
	>
		<div class="container">
			<div
				class="profile-page flex flex-col items-center justify-center"
			>
				<h2 class="text-green-950">Profile</h2>

				<p class="text-green-950 my-4">
					View your profile information here. You can also edit
					or delete your profile as needed.
				</p>

				<div class="profile-img">
					<img
						src="../../../public/images/profile_img.gif"
						alt=""
					/>
				</div>

				<!-- Show loading spinner if still waiting for auth state -->
				<div v-if="isLoading" class="loading-spinner">
					Loading...
				</div>

				<!-- Show user info if user is authenticated and loading is complete -->
				<div v-if="!isLoading && user && !isEditing">
					<div class="user-info">
						<p><strong>Username:</strong> {{ username }}</p>
						<p><strong>Email:</strong> {{ user.email }}</p>
						<p><strong>Role:</strong> {{ userRole }}</p>
						<p><strong>Full Name:</strong> {{ fullName }}</p>
						<p><strong>Biography:</strong> {{ bio }}</p>
						<p><strong>Location:</strong> {{ location }}</p>
						<p><strong>Phone Number:</strong> {{ phone }}</p>
					</div>

					<div class="actions flex">
						<button
							@click="isEditing = true"
							class="btn bg-green-100 text-green-950"
						>
							Edit Profile
						</button>
						<button
							@click="handleDeleteProfile"
							class="btn bg-green-950 text-green-50"
						>
							Delete Profile
						</button>
					</div>
				</div>

				<!-- Show the form for editing profile if isEditing is true -->
				<div v-if="!isLoading && user && isEditing">
					<UserInfoForm
						ref="userInfoForm"
						:username="username"
						:email="user.email"
						:role="userRole"
						:fullName="fullName"
						:bio="bio"
						:location="location"
						:phone="phone"
						@submit="handleProfileUpdate"
						@cancel="handleCancel"
					/>
				</div>

				<!-- Show message if no user is logged in -->
				<div v-if="!isLoading && !user" class="no-user-message">
					<p>You are not logged in.</p>
				</div>
			</div>
		</div>
	</main>
</template>

<script>
import { auth, db } from "../firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import UserInfoForm from "../components/UserInfoForm.vue";

export default {
	components: {
		UserInfoForm,
	},

	data() {
		return {
			isLoading: true,
			isEditing: false,
			user: null,
			userRole: "User",
			username: "",
			email: "",
			fullName: "", // New field for full name
			bio: "", // New field for biography
			location: "", // New field for location
			phone: "", // New field for phone number
		};
	},

	mounted() {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				this.user = user;
				await this.fetchUserData(user.uid);
			} else {
				this.user = null;
				this.userRole = "User";
				this.username = "";
				this.email = "";
				this.fullName = "";
				this.bio = "";
				this.location = "";
				this.phone = "";
			}
			this.isLoading = false;
		});
	},

	methods: {
		async fetchUserData(uid) {
			try {
				const userRef = doc(db, "users", uid);
				const docSnap = await getDoc(userRef);

				if (docSnap.exists()) {
					const userData = docSnap.data();
					this.username =
						userData.username ||
						this.user.email.split("@")[0];
					this.userRole = userData.role || "User";
					this.email = this.user.email;
					this.fullName = userData.fullName || "";
					this.bio = userData.bio || "";
					this.location = userData.location || "";
					this.phone = userData.phone || "";
				} else {
					this.username = this.user.email.split("@")[0];
					this.userRole = "User";
					this.email = this.user.email;
					this.fullName = "";
					this.bio = "";
					this.location = "";
					this.phone = "";
				}
			} catch (error) {
				console.error(
					"Error fetching user data from Firestore:",
					error
				);
			}
		},

		async handleProfileUpdate(updatedData) {
			console.log("Profile updated:", updatedData);

			// Check if all fields are filled
			if (
				!updatedData.username ||
				!updatedData.role ||
				!updatedData.fullName ||
				!updatedData.bio ||
				!updatedData.location ||
				!updatedData.phone
			) {
				alert("All fields must be filled.");
				return;
			}

			try {
				const user = auth.currentUser;

				// Update the username, role, and new fields in Firestore
				const userRef = doc(db, "users", user.uid);
				await updateDoc(userRef, {
					username: updatedData.username,
					role: updatedData.role,
					fullName: updatedData.fullName,
					bio: updatedData.bio,
					location: updatedData.location,
					phone: updatedData.phone,
				});

				// Update local state with the updated data
				this.username = updatedData.username;
				this.userRole = updatedData.role;
				this.fullName = updatedData.fullName;
				this.bio = updatedData.bio;
				this.location = updatedData.location;
				this.phone = updatedData.phone;

				console.log("Profile updated in Firestore.");

				this.isEditing = false;
			} catch (error) {
				console.error("Error updating profile:", error);
			}
		},

		handleDeleteProfile() {
			if (this.user) {
				console.log("Profile deleted:", this.user.uid);
			}
		},

		handleCancel() {
			this.isEditing = false;
		},
	},
};
</script>
