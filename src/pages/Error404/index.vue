

<template lang="pug">
.fullscreen.bg-secondary.text-white.text-center.q-pa-md.flex.flex-center
  div
    div(style="font-size: 25vh")
      | 404

    .text-h4(style="opacity: 0.7")
      | Ой. Кажется, такой страницы не существует
    .row.justify-center
      RefButton.q-mt-xl(reference="/", label="На главную", :underline="false")
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";
export default defineComponent({
  name: "Error404",
  components: {
    RefButton,
  },
  mounted() {
    document.title = "Not Found | Accept";
  },
});
</script>
