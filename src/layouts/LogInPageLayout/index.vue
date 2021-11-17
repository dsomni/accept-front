<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view="hHh lpR fFf")
  q-header.bg-grey-1.text-grey-10(elevated, bordered)
    q-toolbar.q-pa-md.vertical-middle
      q-toolbar-title.text-h5.text-weight-medium
        q-avatar.q-ml-xs(size="xl", square)
          img(src="~assets/logo.svg")
        span.q-ml-sm Accept

      HeaderMenu(:menuList="menuList")

  q-page-container.bg-grey-1
    router-view

  Footer
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
