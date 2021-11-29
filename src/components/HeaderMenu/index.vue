<style lang="sass" src="./style.sass"></style>

<template lang="pug">
.row.q-mx-xl
  q-list.row.q-gutter-x-sm
    template(v-for="(menuItem, index) in menuList", :key="index")
      div(
         v-if="checkPermission(menuItem)"
      )
        RefButton(
          v-if="menuItem.type == 'reference'",
          :reference="menuItem.reference",
          :label="menuItem.label",
          :underline="false"
        )

        DropDown(
          v-if="menuItem.type == 'dropDown'",
          :list="menuItem.list",
          :label="menuItem.label",
          :underline="false"
        )

</template>

<script>
import { defineComponent } from "vue";
import RefButton from "components/DefaultRefBtn/index";
import DropDown from "components/DefaultDropDownBtn/index";

import { useStore } from "vuex";
import { useQuasar } from "quasar";

export default defineComponent({
  name: "HeaderMenu",
  setup() {
    const store = useStore();
    const q = useQuasar();

    return {
      store,
      q,
    };
  },
  props: {
    menuList: Array,
  },
  components: {
    RefButton,
    DropDown,
  },
  computed: {
    isTeacher() {
      const role = this.store.getters["users/role"];
      return role && (role == "teacher" || role == "admin");
    },
  },
  methods: {
    checkPermission(item) {
      if (!item.requiredRole) {
        return true;
      }

      if (item.requiredRole == "teacher" && this.isTeacher) {
        return true;
      } else {
        return false;
      }
    },
  },
});
</script>

