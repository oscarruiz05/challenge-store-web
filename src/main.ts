import { createApp } from "vue";
import "./style.css";
import "primeicons/primeicons.css";
import App from "./App.vue";
import router from "./router";
import PrimeVue from "primevue/config";
import Aura from "@primeuix/themes/aura";
import Card from "primevue/card";
import Dialog from 'primevue/dialog';
import Skeleton from 'primevue/skeleton';
import InputNumber from 'primevue/inputnumber';
import FloatLabel from 'primevue/floatlabel';
import { Button } from "primevue";
import { definePreset } from "@primeuix/themes";

const MyPreset = definePreset(Aura, {
  semantic: {
    primary: {
      50: "{blue.50}",
      100: "{blue.100}",
      200: "{blue.200}",
      300: "{blue.300}",
      400: "{blue.400}",
      500: "{blue.500}",
      600: "{blue.600}",
      700: "{blue.700}",
      800: "{blue.800}",
      900: "{blue.900}",
      950: "{blue.950}",
    },
  },
});

const app = createApp(App);
app.use(router);
app.use(PrimeVue, {
  theme: {
    preset: MyPreset,
  },
});
app.component("Card", Card);
app.component("Button", Button);
app.component("Dialog", Dialog);
app.component("Skeleton", Skeleton);
app.component("InputNumber", InputNumber);
app.component("FloatLabel", FloatLabel);
app.mount("#app");
