<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-expansion-item.expansion-item.text-primary(
  :label="name",
  :content-inset-level="0.2",
)
  q-list.column
    q-item.text-weight-medium.bg-grey-1.sub-level-btn(
      clickable,
      :active="true",
      v-ripple,
      active-class="text-primary",
      tag="a",
      href="/#/myprofile"
    )
      q-item-section.no-wrap.text-grey-10 {{ 'Профиль' }}

    q-item.text-weight-medium.bg-grey-1.sub-level-btn(
      clickable,
      :active="true",
      v-ripple,
      active-class="text-primary",
      @click="onLogOutDialog"
    )
      q-item-section.no-wrap.text-grey-10 {{ 'Выйти' }}
      q-item-section.size-lg(avatar)
        q-avatar(icon="logout")

</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserInfoExpansionItemDrawer",
  props: {
    name: String,
    onLogOutDialog: Function,
  },
});
</script>

