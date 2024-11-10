import axios from "axios";
import {
	createUserWithEmailAndPassword,
	signInWithEmailAndPassword,
	signOut,
} from "firebase/auth";
import { auth } from "../firebase/firebase"; // Import Firebase auth from your firebase setup

export default {
	state: {
		user: null, // Will store the authenticated user data
		loading: false, // Loading state for async actions
		error: null, // Error state for error handling
	},
	mutations: {
		setUser(state, user) {
			state.user = user;
		},
		setLoading(state, status) {
			state.loading = status;
		},
		setError(state, error) {
			state.error = error;
		},
		clearError(state) {
			state.error = null;
		},
	},
	actions: {
		// Sign up action using Firebase Authentication
		async signUp({ commit }, { email, password, username, role }) {
			commit("setLoading", true);
			try {
				// Firebase Authentication: Create user with email and password
				const userCredential = await createUserWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				// After successful signup, send the user data to the backend
				const response = await axios.post(
					"https://your-backend-api.com/register",
					{
						uid: user.uid,
						username: username,
						email: email,
						role: role,
					}
				);

				// Save user in Vuex store
				commit("setUser", { ...user, ...response.data }); // Store additional backend data if any
				return response.data; // Optionally return the backend response
			} catch (error) {
				console.error("Sign-up error:", error.message);
				commit("setError", error.message); // Set error if any
			} finally {
				commit("setLoading", false);
			}
		},

		// Login action using Firebase Authentication
		async login({ commit }, { email, password }) {
			commit("setLoading", true);
			try {
				// Firebase Authentication: Sign in with email and password
				const userCredential = await signInWithEmailAndPassword(
					auth,
					email,
					password
				);
				const user = userCredential.user;

				// After successful login, send the UID to backend API to get user data (e.g., role)
				const response = await axios.post(
					"https://your-backend-api.com/login",
					{
						uid: user.uid,
					}
				);

				// Save user in Vuex store
				commit("setUser", { ...user, ...response.data });
				return response.data; // Optionally return the backend response
			} catch (error) {
				console.error("Login error:", error.message);
				commit("setError", error.message);
			} finally {
				commit("setLoading", false);
			}
		},

		// Logout action using Firebase Authentication
		async logout({ commit }) {
			try {
				await signOut(auth);
				commit("setUser", null); // Clear user data from store
			} catch (error) {
				console.error("Logout error:", error.message);
				commit("setError", error.message);
			}
		},

		// Clear error message
		clearError({ commit }) {
			commit("clearError");
		},
	},
	getters: {
		user: (state) => state.user,
		loading: (state) => state.loading,
		error: (state) => state.error,
	},
};
