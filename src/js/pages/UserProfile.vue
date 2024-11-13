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

				<div v-if="isLoading" class="loading-spinner">
					Loading...
				</div>

				<div v-if="!isLoading && user && !isEditing">
					<div class="user-info">
						<p>
							<strong>Username:</strong>
							{{ user.username }}
						</p>
						<p><strong>Email:</strong> {{ user.email }}</p>
						<p><strong>Role:</strong> {{ user.role }}</p>
						<p>
							<strong>Full Name:</strong>
							{{ user.fullName }}
						</p>
						<p><strong>Biography:</strong> {{ user.bio }}</p>
						<p>
							<strong>Location:</strong>
							{{ user.location }}
						</p>
						<p>
							<strong>Phone Number:</strong>
							{{ user.phone }}
						</p>
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

				<div v-if="!isLoading && user && isEditing">
					<UserInfoForm
						:user="user"
						@updateProfile="handleProfileUpdate"
						@cancel="handleCancel"
					/>
				</div>

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
		};
	},

	mounted() {
		onAuthStateChanged(auth, async (user) => {
			if (user) {
				this.user = await this.fetchUserData(user.uid);
			} else {
				this.user = null;
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
					return docSnap.data();
				} else {
					return {
						username: this.user.email.split("@")[0],
						role: "User",
						fullName: "",
						bio: "",
						location: "",
						phone: "",
					};
				}
			} catch (error) {
				console.error(
					"Error fetching user data from Firestore:",
					error
				);
			}
		},

		async handleProfileUpdate(updatedData) {
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
				const userRef = doc(db, "users", user.uid);
				await updateDoc(userRef, updatedData);

				this.user = updatedData; // Update local state with the updated data
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
