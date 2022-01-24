<style lang="sass" src="./style.sass"></style>

<template lang="pug">
q-form(
  @submit="onSubmit"
  class="q-ma-md"
)
  q-btn(
    label="Отправить"
    color="primary"
    type="submit"
  )
  q-select(
    v-model="lang"
    :options="languages"
    label="Язык"
  )
  q-input(
    type="textarea"
    v-model="code"
    lazy-rules
    label="Код"
    :rules="[ val => val && val.trim().length > 0 || 'Введите код перед отправкой' ]"
    rows=25
    class="codeInput"
  )
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useQuasar } from 'quasar';

export default defineComponent({
  setup(){
    const q = useQuasar();
    const languages = ['python', 'pypy', 'c++', 'java', 'pascal']
    const code = ref('');
    const lang = ref('python');
    const file = ref(null);
    const accept = ref(false)
    return{
      q,
      code,
      file,
      lang,
      languages,
      accept,
      onSubmit(){
        if(accept){
          q.notify({
            color: 'green-4',
            textColor: 'white',
            icon: 'cloud_done',
            message: 'Submitted'
          })
        }else{
          q.notify({
            color: 'red-5',
            textColor: 'white',
            icon: 'warning',
            message: 'You need to accept the license and terms first'
          })
        }
      }
    }
  }
})
</script>
