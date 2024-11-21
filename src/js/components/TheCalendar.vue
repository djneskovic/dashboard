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
			:snap-to-time="15"
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
					placeholder="Unesite naslov"
				/>

				<label for="startDate">Start Date:</label>
				<input
					v-model="newEvent.start"
					id="startDate"
					type="datetime-local"
				/>

				<label for="endDate">End date:</label>
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
import { db } from "../firebase/firebase";
import { collection, addDoc, getDocs } from "firebase/firestore";

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
		};
	},
	mounted() {
		this.loadEvents();
	},
	methods: {
		async loadEvents() {
			try {
				const querySnapshot = await getDocs(
					collection(db, "calendar")
				);
				this.events = [];
				querySnapshot.forEach((doc) => {
					const eventData = doc.data();
					this.events.push({
						title: eventData.title,
						start: eventData.start.toDate(),
						end: eventData.end.toDate(),
						class: "pera",
					});
				});
			} catch (error) {
				console.error("Greška pri učitavanju događaja:", error);
			}
		},

		handleCellDblClick(eventDetails) {
			this.selectedStart = eventDetails;

			// Formatiraj start i end u lokalnu vremensku zonu
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

		// Formatiranje datuma za input u formatu YYYY-MM-DDTHH:MM
		formatDateForInput(date) {
			const localDate = new Date(
				date.getTime() - date.getTimezoneOffset() * 60000
			);
			return localDate.toISOString().slice(0, 16);
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
				await addDoc(collection(db, "calendar"), {
					title: this.newEvent.title,
					start: new Date(this.newEvent.start),
					end: new Date(this.newEvent.end),
				});
				console.log("Događaj uspešno sačuvan u Firestore.");

				this.events.push({
					title: this.newEvent.title,
					start: new Date(this.newEvent.start),
					end: new Date(this.newEvent.end),
					class: "pera",
				});

				this.closeModal();
			} catch (error) {
				console.error(
					"Greška pri čuvanju događaja u Firestore:",
					error
				);
			}
		},
	},
};
</script>

<style>
/* Prilagođavanje stila */
.vuecal__event {
	border-radius: 5px;
	border: none;
}

.pera {
	background: rgb(187, 160, 160);
}
</style>
