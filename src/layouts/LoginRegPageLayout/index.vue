<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view="hHh lpR fFf")
  router-view(v-slot="{ Component }")
    q-page-container.bg-grey-1
      q-img.fullscreen(
        src="~assets/code2.jpg",
      )
        .z-top.transparent.fullscreen(
          style="  max-height: 100vh;overflow-y: scroll; padding: 0px;"
        )
          component(:is="Component")

</template>


<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "LoginRegPageLayout",
});
</script>
