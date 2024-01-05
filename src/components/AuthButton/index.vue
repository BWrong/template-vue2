<template>
  <a-button v-if="hasAuth" v-bind="$attrs" v-on="$listeners">
    <slot />
  </a-button>
</template>

<script>
import { getStorage } from '@/utils/storage';
export default {
  props: {
    auth: {
      type: String,
      default: ''
    }
  },
  // inheritAttrs:false,
  data() {
    return { permissions: Object.freeze(getStorage('permissions')) };
  },
  computed: {
    hasAuth() {
      const permissions = this.permissions || [];
      return !this.auth || permissions.includes(this.auth);
    }
  }
};
</script>
