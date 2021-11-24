<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout.main-page-layout(view="hHh lpR lFf")
  q-header.bg-grey-1.text-grey-10(reveal, elevated, bordered)
    q-resize-observer(@resize="onResizeHeader")
    q-toolbar.q-pa-md.vertical-middle
      q-btn(
        v-if="shouldShrinkHeader",
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

      HeaderMenu(:menuList="menuList", v-if="!shouldShrinkHeader")

  q-drawer.bg-grey-1.text-subtitle1(
    v-model="leftDrawerOpen",
    v-if="shouldShrinkHeader",
    v-click-outside="onClickOutsideDrawer",
    side="left",
    bordered,
    overlay,
    :width="200",
    :breakpoint="200"
  )
    q-scroll-area.fit
      DrawerMenu(:menuList="menuList")

  q-page-container.bg-grey-1
    router-view(v-slot="{ Component }")
      component(:is="Component")

  CustomFooter
</template>


<script>
import { defineComponent, ref } from "vue";
import { useQuasar } from "quasar";
import HeaderMenu from "components/HeaderMenu/index";
import DrawerMenu from "components/LeftDrawerMenu/index";
import CustomFooter from "components/CustomFooter/index";

import vClickOutside from "click-outside-vue3";

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
    reference: "/#/tournaments",
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

const limitWidthHeader = 695;

export default defineComponent({
  name: "MainPageLayout",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const shouldShrinkHeader = ref(false);
    const q = useQuasar();
    if (q.screen.width < limitWidthHeader) {
      shouldShrinkHeader.value = true;
    }

    return {
      q,
      shouldShrinkHeader,
      menuList,
      leftDrawerOpen,
      toggleLeftDrawer() {
        leftDrawerOpen.value = !leftDrawerOpen.value;
      },
    };
  },
  computed: {
    getLimitWidth() {
      return 700;
    },
  },
  methods: {
    onResizeHeader(size) {
      if (size.width < limitWidthHeader) {
        this.shouldShrinkHeader = true;
      } else {
        this.shouldShrinkHeader = false;
      }
    },
    onClickOutsideDrawer() {
      this.leftDrawerOpen = false;
    },
  },
  components: {
    HeaderMenu,
    DrawerMenu,
    CustomFooter,
  },
});
</script>
