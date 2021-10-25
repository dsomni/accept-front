<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-layout(view='hHh lpR fFf')
  q-header.bg-grey-1.text-grey-10(reveal elevated)
    q-toolbar.q-pa-md.vertical-middle
      q-toolbar-title.text-h4
        q-avatar(size='xl' square)
          img(src='~assets/logo.svg')
        span.q-ml-sm Accept

  q-page-container.bg-grey-1
    router-view
  q-footer.bg-grey-8.text-white
    q-toolbar
      q-toolbar-title
        div Title
</template>

<script>
import { defineComponent } from 'vue';

export default defineComponent({
  name: 'GlobalLayout'
})
</script>
