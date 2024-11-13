<template>
	<form @submit.prevent="submitForm">
		<div class="edit-profile">
			<label for="username">Username</label>
			<input
				v-model="form.username"
				type="text"
				id="username"
				required
			/>
		</div>

		<div class="edit-profile">
			<label for="role">Role</label>
			<select v-model="form.role" id="role" required>
				<option value="admin">Admin</option>
				<option value="user">User</option>
				<option value="manager">Manager</option>
			</select>
		</div>

		<div class="edit-profile">
			<label for="fullName">Full Name</label>
			<input
				v-model="form.fullName"
				type="text"
				id="fullName"
				required
			/>
		</div>

		<div class="edit-profile">
			<label for="bio">Biography</label>
			<textarea v-model="form.bio" id="bio" required></textarea>
		</div>

		<div class="edit-profile">
			<label for="location">Location</label>
			<input
				v-model="form.location"
				type="text"
				id="location"
				required
			/>
		</div>

		<div class="edit-profile">
			<label for="phone">Phone Number</label>
			<input v-model="form.phone" type="text" id="phone" required />
		</div>

		<div class="buttons">
			<button type="submit" class="btn bg-green-100 text-green-950">
				Save Changes
			</button>
			<button
				@click="cancelEdit"
				type="button"
				class="btn bg-green-950 text-green-50"
			>
				Cancel
			</button>
		</div>
	</form>
</template>

<script>
export default {
	props: {
		user: Object,
	},
	data() {
		return {
			form: { ...this.user }, // Initialize form with user data
		};
	},
	methods: {
		submitForm() {
			this.$emit("updateProfile", this.form); // Emit updated data to parent
		},
		cancelEdit() {
			this.$emit("cancel"); // Emit cancel event to parent
		},
	},
};
</script>
