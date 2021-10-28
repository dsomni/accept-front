<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view="hHh lpR lFf")
  q-header.bg-grey-1.text-grey-10(reveal, elevated, bordered)
    q-toolbar.q-pa-md.vertical-middle
      q-btn(
        v-if="$q.screen.width < getLimitWidth",
        dense,
        flat,
        round,
        icon="menu",
        @click="toggleLeftDrawer"
      )

      q-toolbar-title.text-h5.text-weight-medium
        q-avatar.q-ml-xs(size="xl", square)
          img(src="~assets/logo.svg")
        span.q-ml-sm Accept

      HeaderMenu(:menuList="menuList", v-if="$q.screen.width >= getLimitWidth")

  q-drawer.bg-grey-1.text-subtitle1(
    v-model="leftDrawerOpen",
    v-if="$q.screen.width < getLimitWidth",
    side="left",
    bordered,
    overlay,
    :width="200",
    :breakpoint="200"
  )
    q-scroll-area.fit
      DrawerMenu(:menuList="menuList")

  q-page-container.bg-grey-1
    router-view

  Footer
</template>


<script>
import { defineComponent, ref } from "vue";
import HeaderMenu from "components/HeaderMenu/index";
import DrawerMenu from "components/LeftDrawerMenu/index";
import Footer from "components/Footer/index";

const projectList = [
  {
    type: "reference",
    label: "Образование",
    reference: "/#/edu",
    separator: true,
  },
  {
    type: "reference",
    label: "Турниры",
    reference: "/#/tournament",
    separator: true,
  },
  {
    type: "reference",
    label: "Курсы",
    reference: "/#/courses",
    separator: true,
  },
];

const menuList = [
  {
    type: "reference",
    label: "Главная",
    reference: "/",
    separator: true,
  },
  {
    type: "dropDown",
    label: "Проекты",
    list: projectList,
    separator: true,
  },
  {
    type: "reference",
    label: "О проекте",
    reference: "/#/about",
    separator: true,
  },
];

export default defineComponent({
  name: "GlobalLayout",
  computed: {
    getLimitWidth() {
      return 700;
    },
  },
  setup() {
    const leftDrawerOpen = ref(false);

    return {
      menuList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  components: {
    HeaderMenu,
    DrawerMenu,
    Footer
  },
});
</script>
