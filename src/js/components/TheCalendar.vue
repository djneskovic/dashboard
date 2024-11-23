<template>
	<div>
		<VueCal
			ref="vuecal"
			:events="events"
			:editable="true"
			:disable-views="['years', 'year', 'month']"
			:time-from="8 * 60"
			:time-to="19 * 60"
			:hide-title-bar="false"
			:hide-weekdays="[6, 7]"
			:editable-events="{
				title: true,
				drag: true,
				resize: true,
				delete: true,
				create: true,
			}"
			@cell-dblclick="handleCellDblClick"
			@event-change="updateEvent"
			@event-delete="deleteEvent"
			@event-click="infoEvent"
			:snap-to-time="15"
			:class="calendarClass"
			class="vuecal--full-height-delete"
		></VueCal>

		<!-- Modal za unos naslova i datuma -->
		<div v-if="isModalVisible" class="modal">
			<div class="modal-content">
				<h2>Enter task</h2>
				<label for="title">Title:</label>
				<input
					v-model="newEvent.title"
					id="title"
					type="text"
					placeholder="Enter title"
				/>

				<label for="startDate">Start Date:</label>
				<input
					v-model="newEvent.start"
					id="startDate"
					type="datetime-local"
				/>

				<label for="endDate">End Date:</label>
				<input
					v-model="newEvent.end"
					id="endDate"
					type="datetime-local"
				/>
				<div class="btns flex gap-4 mt-4 justify-center">
					<button class="btn" @click="saveEvent">OK</button>
					<button class="btn" @click="closeModal">Cancel</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import VueCal from "vue-cal";
import "vue-cal/dist/vuecal.css";
import { db, auth } from "../firebase/firebase";
import {
	collection,
	addDoc,
	getDocs,
	updateDoc,
	doc,
	deleteDoc,
	getDoc,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";

export default {
	components: { VueCal },
	data() {
		return {
			events: [],
			isModalVisible: false,
			newEvent: {
				title: "",
				start: null,
				end: null,
			},
			selectedStart: null,
			userRole: "",
		};
	},
	computed: {
		calendarClass() {
			switch (this.userRole) {
				case "admin":
					return "admin-calendar";
				case "designer":
					return "designer-calendar";
				case "Developer":
					return "developer-calendar";
				default:
					return "";
			}
		},
	},
	mounted() {
		this.loadEvents();
		this.fetchUserRole();
	},
	methods: {
		async fetchUserRole() {
			onAuthStateChanged(auth, async (user) => {
				if (user) {
					const userDocRef = doc(db, "users", user.uid);
					const userDoc = await getDoc(userDocRef);
					if (userDoc.exists()) {
						const userData = userDoc.data();
						this.userRole = userData.role || "";
						console.log(this.userRole);
					} else {
						console.log("Korisnički dokument nije pronađen!");
					}
				} else {
					this.userRole = "guest";
				}
			});
		},

		async loadEvents() {
			try {
				const querySnapshot = await getDocs(
					collection(db, "calendar")
				);
				this.events = [];
				querySnapshot.forEach((doc) => {
					const eventData = doc.data();
					this.events.push({
						id: doc.id,
						title: eventData.title,
						start: eventData.start.toDate(),
						end: eventData.end.toDate(),
						class: this.getEventClass(eventData),
						role: eventData.role || "unknown",
					});
				});
				console.log("Task loaded");
			} catch (error) {
				console.error("Greška pri učitavanju događaja:", error);
			}
		},

		getEventClass(eventData) {
			switch (eventData.role) {
				case "admin":
					return "vuecal__event--admin-event";
				case "designer":
					return "vuecal__event--designer-event";
				case "Developer":
					return "vuecal__event--developer-event";
				default:
					return "";
			}
		},

		async saveEvent() {
			if (
				!this.newEvent.title ||
				!this.newEvent.start ||
				!this.newEvent.end
			) {
				alert("Morate uneti sve podatke.");
				return;
			}

			try {
				const user = auth.currentUser;
				if (!user) {
					alert(
						"Morate biti prijavljeni da biste dodali događaj."
					);
					return;
				}

				// Dohvati username korisnika
				const userDocRef = doc(db, "users", user.uid);
				const userDoc = await getDoc(userDocRef);
				const username = userDoc.exists()
					? userDoc.data().username
					: "Nepoznati korisnik";

				// Dodavanje događaja u Firestore
				const docRef = await addDoc(collection(db, "calendar"), {
					title: this.newEvent.title,
					start: new Date(this.newEvent.start),
					end: new Date(this.newEvent.end),
					role: this.userRole,
					createdBy: username, // Dodavanje korisničkog imena
				});

				console.log("Task saved");

				// Dodavanje događaja u lokalnu listu
				this.events.push({
					id: docRef.id,
					title: this.newEvent.title,
					start: new Date(this.newEvent.start),
					end: new Date(this.newEvent.end),
					class: this.getEventClass({
						role: this.userRole,
					}),
					role: this.userRole,
				});

				this.closeModal();
			} catch (error) {
				console.error(
					"Greška pri čuvanju događaja u Firestore:",
					error
				);
			}
		},

		async updateEvent(eventDetails) {
			try {
				const event = eventDetails.event;
				console.log("Updating task");

				if (!event.id) {
					console.error("Greška: Događaj nema ID.");
					return;
				}

				const docRef = doc(db, "calendar", event.id);
				const eventDoc = await getDoc(docRef);

				// Provera vlasništva
				if (
					eventDoc.exists() &&
					eventDoc.data().role === this.userRole
				) {
					await updateDoc(docRef, {
						title: event.title,
						start: new Date(event.start),
						end: new Date(event.end),
					});
					console.log("Task updated");
				} else {
					alert("Nemate dozvolu da ažurirate ovaj događaj.");
					window.location.reload();
				}
			} catch (error) {
				console.error("Greška pri ažuriranju događaja:", error);
			}
		},

		async deleteEvent(eventDetails) {
			try {
				const event = eventDetails?.event || eventDetails;

				if (!event) {
					console.error("Greška: Nema dostupnog događaja.");
					return;
				}

				const eventId = event.id || event._eid;

				if (!eventId) {
					console.error("Greška: Događaj nema validan ID.");
					return;
				}

				const docRef = doc(db, "calendar", eventId);
				const eventDoc = await getDoc(docRef);

				// Provera vlasništva
				if (
					eventDoc.exists() &&
					eventDoc.data().role === this.userRole
				) {
					await deleteDoc(docRef);
					console.log("Događaj uspešno obrisan iz Firestore.");
					this.events = this.events.filter(
						(e) => e.id !== eventId
					);
				} else {
					alert("Nemate dozvolu da obrišete ovaj događaj.");
					window.location.reload();
				}
			} catch (error) {
				console.error("Greška pri brisanju događaja:", error);
			}
		},

		infoEvent() {
			console.log("cao");
		},

		handleCellDblClick(eventDetails) {
			this.selectedStart = eventDetails;

			this.newEvent.start = this.formatDateForInput(
				this.selectedStart
			);
			const end = new Date(
				this.selectedStart.getTime() + 2 * 60 * 60 * 1000
			);
			this.newEvent.end = this.formatDateForInput(end);

			this.isModalVisible = true;
		},

		closeModal() {
			this.isModalVisible = false;
		},

		formatDateForInput(date) {
			const localDate = new Date(
				date.getTime() - date.getTimezoneOffset() * 60000
			);
			return localDate.toISOString().slice(0, 16);
		},
	},
};
</script>

<style>
.vuecal__event {
	border-radius: 5px;
	border: 2px solid rgba(0, 0, 0, 0.2);
	padding: 5px;
}

.vuecal__event--admin-event {
	background: linear-gradient(135deg, #b71c1c, #d32f2f);
	color: #fff;
}

.vuecal__event--designer-event {
	background: linear-gradient(135deg, #512da8, #673ab7);
	color: #fff;
}

.vuecal__event--developer-event {
	background: linear-gradient(135deg, #00796b, #00897b);
	color: #fff;
}
</style>
