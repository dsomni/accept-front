<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.row.q-mx-xl
  q-list.row.q-gutter-x-sm
    template(v-for="(menuItem, index) in menuList", :key="index")

      RefButton(
        v-if="menuItem.type == 'reference'",
        :reference="menuItem.reference",
        :label="menuItem.label"
      )

      q-item.q-pa-none(
        v-if="menuItem.type == 'dropDown'",
        clickable,
        :active="true",
        v-ripple,
        active-class="text-primary"
      )
        q-btn.fit.bg-grey-1.text-subtitle1.text-weight-medium.text-grey-10(
          color="primary",
          :label="menuItem.label",
          type="a",
          no-caps,
          unelevated
        )
          q-menu.text-subtitle1.text-weight-medium(
            fit,
            anchor="bottom start",
            self="top left"
          )
            template(v-for="(listItem, index) in menuItem.list", :key="index")
              q-item.nav-ref(
                clickable,
                :active="true",
                v-ripple,
                active-class="text-primary"
              )
                q-item-section.no-wrap.text-grey-10 {{ listItem.label }}
              q-separator(:key="'sep' + index", v-if="listItem.separator")

      q-separator(:key="'sep' + index", v-if="menuItem.separator")
</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/HeaderMenuRefBtn/index";

export default defineComponent({
  name: "HeaderMenu",
  setup() {},
  props: {
    menuList: Array,
  },
  components:{
    RefButton
  }
});
</script>

