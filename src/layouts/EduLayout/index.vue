<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout.main-page-layout(view="hHh lpR lFf")
  div(v-click-outside="onClickOutsideDrawer")
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
          q-avatar.q-ml-xs(
            size="xl",
            square,
            style="cursor: pointer",
            @click="goToMainPage"
          )
            img(src="~assets/logo.svg")
          span.q-ml-sm.q-py-sm.q-pr-md(style="cursor: pointer", @click="goToMainPage") Образование

        HeaderMenu(:menuList="menuList", v-if="!shouldShrinkHeader")

    q-drawer.bg-grey-1.text-subtitle1(
      v-model="leftDrawerOpen",
      v-if="shouldShrinkHeader",
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
import { useRouter } from "vue-router";


import HeaderMenu from "components/HeaderMenu/index";
import DrawerMenu from "components/LeftDrawerMenu/index";
import CustomFooter from "components/CustomFooter/index";

import vClickOutside from "click-outside-vue3";

const menuList = [
  {
    type: "reference",
    label: "Все задачи",
    reference: "/#/edu",
    separator: true,
  },
  {
    type: "reference",
    label: "Задания",
    reference: "/#/edu/assignments",
    separator: true,
  },
  {
    type: "reference",
    label: "Ученики",
    reference: "/#/edu/students",
    separator: true,
    requiredRole: "teacher"
  },
];

const limitWidthHeader = 900;

export default defineComponent({
  name: "EduLayout",
  directives: {
    clickOutside: vClickOutside.directive,
  },
  setup() {
    const leftDrawerOpen = ref(false);
    const shouldShrinkHeader = ref(false);
    const q = useQuasar();
    const router = useRouter();


    if (q.screen.width < limitWidthHeader) {
      shouldShrinkHeader.value = true;
    }

    return {
      q,
      router,

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
    goToMainPage() {
      this.router.push({ path: "/" });
    },
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
