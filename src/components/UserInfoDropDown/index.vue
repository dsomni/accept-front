<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-item.q-pa-none(
  clickable,
  :active="true",
  v-ripple,
  active-class="text-primary"
)
  q-btn-dropdown.bg-grey-1.text-weight-medium.header-drop-down.text-primary(
    :label="name",
    no-caps,
    unelevated,
    no-wrap,
    :ripple="false",
    dropdown-icon="arrow_drop_down"
  )
    q-list
      q-item.text-weight-medium.bg-grey-1.header-ref-btn(
        clickable,
        :active="true",
        v-ripple,
        active-class="text-primary",
        tag="a",
        href="/#/myprofile"
      )
        q-item-section.no-wrap.text-grey-10 {{ 'Профиль' }}
      q-separator

      q-item.text-weight-medium.bg-grey-1.header-ref-btn(
        clickable,
        :active="true",
        v-ripple,
        active-class="text-primary",
        @click="onLogOutDialog"
      )
        q-item-section.no-wrap.text-grey-10 {{ 'Выйти' }}
        q-item-section.size-lg(avatar)
          q-avatar(icon="logout")

      q-separator
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "UserInfoDropDown",
  props: {
    name: String,
    onLogOutDialog: Function,
  },
});
</script>

