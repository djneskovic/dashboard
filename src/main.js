import { createApp } from "vue";

import App from "./App.vue";
import router from "./js/router";
import store from "./js/store";

createApp(App).use(store).use(router).mount("#app");
