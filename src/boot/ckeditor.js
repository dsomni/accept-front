import { boot } from 'quasar/wrappers'
import Vue from 'vue';
import CKEditor from '@ckeditor/ckeditor5-vue';

Vue.use(CKEditor);
// "async" is optional;
// more info on params: https://v2.quasar.dev/quasar-cli/boot-files
export default boot(async (/* { app, router, ... } */) => {
  Vue.use(CKEditor);
})
