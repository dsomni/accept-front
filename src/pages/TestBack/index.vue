

<template lang="pug">
.fullscreen.bg-secondary.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(style="font-size: 25vh") {{ taskTitle }}
  q-btn(color="primary", icon="check", label="OK", @click="sendRequest")
</template>

<script>
import { defineComponent, ref } from "vue";
import { api } from "boot/axios";

export default defineComponent({
  name: "TestBack",
  setup() {
    const taskTitle = ref(null);

return{
  taskTitle
}
  },
  methods:{
    async sendRequest(){
          await api
      .get("/api/user/admin")
      .then((response) => {
        // console.log(response.data);
        this.taskTitle = response.data.name
      })
      .catch((error) => {
        // console.log("Error");
        // console.log(error.response);
      });
    }
  },
});
</script>
