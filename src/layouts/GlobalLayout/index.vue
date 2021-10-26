<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view='hHh lpR fFf')
  q-header.bg-grey-1.text-grey-10(reveal elevated)
    q-toolbar.q-pa-md.vertical-middle
      q-toolbar-title.text-h5.text-weight-medium
        q-avatar(size='xl' square).q-ml-xs
          img(src='~assets/logo.svg')
        span.q-ml-sm Accept
      div.text-subtitle1.row.q-gutter-x-xl.q-mx-xl.text-weight-medium.revs-bar
        a.common-ref(href="dsfdsfd.com") Ещё что-то
        a.common-ref(href="sdfsd.com") О проекте

  q-page-container.bg-grey-1
    router-view

  q-footer.bg-blue-grey-9.text-white

    div.row.justify-center.no-wrap.items-center.q-gutter-x-lg.q-mt-xl
      a(href="https://github.com/dsomni")
        q-icon(size="sm")
          img(src="~assets/github.svg")
      a(href="https://github.com/RetroMeras")
        q-icon(size="sm")
          img(src="~assets/github.svg")
    div.row.justify-center.text-no-wrap.items-center.q-mt-lg.q-mb-xl.text-justify.text-body1
      .copyright-span
      | Copyright © 2020-{{ new Date().getFullYear() }} Blue Crane
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GlobalLayout'
})
</script>
