<template>
  <a-config-provider :locale="locale">
    <div id="app">
      <router-view />
    </div>
  </a-config-provider>
</template>
<script>
export default {
  data() {
    return { locale: {} };
  },
  created() {
    this.locale = require('ant-design-vue/es/locale/zh_CN').default;
  }
};
</script>
