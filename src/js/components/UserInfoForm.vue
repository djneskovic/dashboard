<template>
	<form @submit.prevent="handleSubmit" class="w-full">
		<div class="edit-profile">
			<label for="username">New Username:</label>
			<input
				type="text"
				id="username"
				v-model="localUsername"
				required
			/>
		</div>

		<div class="edit-profile">
			<label for="fullName">Full Name:</label>
			<input type="text" id="fullName" v-model="localFullName" />
		</div>

		<div class="edit-profile">
			<label for="bio">Biography:</label>
			<textarea
				id="bio"
				v-model="localBio"
				placeholder="Write something about yourself..."
			></textarea>
		</div>

		<div class="edit-profile">
			<label for="location">Location:</label>
			<input type="text" id="location" v-model="localLocation" />
		</div>

		<div class="edit-profile">
			<label for="phone">Phone Number:</label>
			<input
				type="tel"
				id="phone"
				v-model="localPhone"
				placeholder="e.g. +1234567890"
			/>
		</div>

		<div class="edit-profile">
			<label for="role">New Role:</label>
			<select v-model="localRole">
				<option value="admin">Admin</option>
				<option value="user">User</option>
				<option value="moderator">Moderator</option>
			</select>
		</div>

		<div class="buttons">
			<button type="submit" class="btn bg-green-950 text-green-50">
				Save
			</button>
			<button
				type="button"
				@click="handleCancel"
				class="bg-green-100 text-green-950 btn"
			>
				Cancel
			</button>
		</div>
	</form>
</template>

<script>
export default {
	props: {
		username: String,
		email: String,
		role: String,
	},
	data() {
		return {
			localUsername: this.username,
			localFullName: "", // New field for full name
			localBio: "", // New field for biography
			localLocation: "", // New field for location
			localPhone: "", // New field for phone number
			localRole: this.role,
		};
	},
	methods: {
		handleSubmit() {
			// Emit 'submit' with updated values, including new fields
			this.$emit("submit", {
				username: this.localUsername,
				fullName: this.localFullName,
				bio: this.localBio,
				location: this.localLocation,
				phone: this.localPhone,
				role: this.localRole,
			});
		},
		handleCancel() {
			// Reset the form fields to their original values
			this.localUsername = this.username;
			this.localFullName = "";
			this.localBio = "";
			this.localLocation = "";
			this.localPhone = "";
			this.localRole = this.role;
			// Emit cancel event to parent
			this.$emit("cancel");
		},
	},
};
</script>
