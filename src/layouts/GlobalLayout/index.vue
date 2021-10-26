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
      .text-subtitle1.text-weight-medium.row.q-gutter-x-md.q-mx-xl.revs-bar(
        v-if="$q.screen.width >= getLimitWidth"
      )
        template(v-for="(menuItem, index) in menuList", :key="index")
          q-item.nav-ref(
            clickable,
            :active="true",
            v-ripple,
            active-class="text-primary",
            tag="a",
            :href="menuItem.reference"
          )
            q-item-section.no-wrap.text-grey-10 {{ menuItem.label }}
          q-separator(:key="'sep' + index", v-if="menuItem.separator")

  q-drawer.bg-grey-2.text-subtitle1(
    v-model="leftDrawerOpen",
    v-if="$q.screen.width < getLimitWidth",
    side="left",
    bordered,
    overlay,
    :width="200",
    :breakpoint="200"
  )
    q-scroll-area.fit
      q-list
        template(v-for="(menuItem, index) in menuList", :key="index")
          q-item(
            clickable,
            :active="true",
            v-ripple,
            active-class="text-primary",
            tag="a",
            :href="menuItem.reference"
          )
            q-item-section.no-wrap.text-grey-10 {{ menuItem.label }}
          q-separator(:key="'sep' + index", v-if="menuItem.separator")

  q-page-container.bg-grey-1
    router-view

  q-footer.bg-blue-grey-9.text-white
    .row.justify-center.no-wrap.items-center.q-gutter-x-lg.q-mt-xl
      a(href="https://github.com/dsomni")
        q-icon(size="sm")
          img(src="~assets/github.svg")
      a(href="https://github.com/RetroMeras")
        q-icon(size="sm")
          img(src="~assets/github.svg")
    .row.justify-center.text-no-wrap.items-center.q-mt-lg.q-mb-xl.text-justify.text-body1
      .copyright-span
      | Copyright © 2020-{{ new Date().getFullYear() }} Blue Crane
</template>
<script>
import { defineComponent, ref } from "vue";

const menuList = [
  {
    label: "Главная",
    reference: "/",
    separator: true,
  },
  {
    label: "Разное",
    reference: "/stuff",
    separator: true,
  },
  {
    label: "О проекте",
    reference: "/about",
    separator: true,
  },
];

export default defineComponent({
  name: "GlobalLayout",
  computed:{
    getLimitWidth(){
      return 700;
    }
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
});
</script>
