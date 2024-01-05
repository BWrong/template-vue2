<template>
  <span>
    <a-input v-if="isEdit" :value="value" v-bind="$attrs" @input="handleInput" v-on="$listeners" />
    <span v-else>{{ value }}</span>
  </span>
</template>

<script>
export default {
  props: {
    value: {
      type: String,
      default: ''
    },
    isEdit: {
      type: Boolean,
      default: true
    }
  },
  methods: {
    handleInput(value) {
      this.$emit('input', value);
    }
  }
};
</script>
