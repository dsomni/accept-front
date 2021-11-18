<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view="hHh lpR fFf")

  q-page-container.bg-grey-1
    q-img.fullscreen(
      src="~assets/code2.jpg",
    )
      .z-top.transparent.fullscreen(
        style="  max-height: 100vh;overflow-y: scroll; padding: 0px;"
      )
        router-view

</template>


<script>
import { defineComponent } from "vue";
import HeaderMenu from "components/HeaderMenu/index";

const menuList = [
  {
    type: "reference",
    label: "На главную",
    reference: "/",
    separator: true,
  },
];

export default defineComponent({
  name: "MainPageLayout",
  setup() {
    return {
      menuList,
    };
  },
  components: {
    HeaderMenu,
  },
});
</script>
