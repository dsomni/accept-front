<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.bg-blue-grey-9.text-white(style="height: 15vh; min-height:200px;").q-pa-md
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
import { defineComponent } from "vue";

export default defineComponent({
  name: "Footer",
});
</script>

