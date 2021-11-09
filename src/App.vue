<template>
  <router-view />
</template>
<script>
import { defineComponent } from "vue";
import { api } from "boot/axios";
import { useStore } from "vuex";

export default defineComponent({
  name: "App",
  setup() {},
  beforeCreate() {
    const $store = useStore();
    $store.commit("Global/initializeStore");

    const token = $store.state.Global.token;
    if (token) {
      api.defaults.headers.common["Authorization"] = "Token " + token;
    } else {
      api.defaults.headers.common["Authorization"] = "";
    }
  },
});
</script>
