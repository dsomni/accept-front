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
    // const $store = useStore();
    // $store.commit("Global/initializeStore");
  },
});
</script>
