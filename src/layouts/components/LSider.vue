<template>
  <div>
    <div class="x-sider">
      <a-menu
        class="menu-box"
        :theme="theme"
        mode="inline"
        :inline-collapsed="collapse"
        :selected-keys="selectedKeys"
        :open-keys.sync="localOpeneds"
      >
        <template v-for="item in menus">
          <template v-if="!item.hide">
            <a-sub-menu v-if="item.children && item.children.length >= 1" :key="item.url">
              <template slot="title">
                <a-icon v-if="item.icon" :type="item.icon" class="menu-ico" />
                <span>{{ item.name }}</span>
              </template>
              <template v-for="subItem in item.children">
                <a-menu-item v-if="!subItem.hide" :key="subItem.url">
                  <router-link :to="subItem.url">
                    <!-- <a-icon :type="subItem.icon" class="menu-ico" v-if="subItem.icon" /> -->
                    <span>{{ subItem.name }}</span>
                  </router-link>
                </a-menu-item>
              </template>
            </a-sub-menu>
            <a-menu-item v-else :key="item.url">
              <router-link :to="item.url">
                <a-icon v-if="item.icon" :type="item.icon" class="menu-ico" />
                <span>{{ item.name }}</span>
              </router-link>
            </a-menu-item>
          </template>
        </template>
      </a-menu>
    </div>
    <!-- <div class="sider-trigger" @click="handleCollapse"><a-icon :type="collapse ? 'right' : 'left'" /></div> -->
  </div>
</template>
<script>
export default {
  props: {
    collapse: {
      type: Boolean,
      default: false
    },
    menus: {
      type: Array,
      required: true
    },
    openKeys: {
      type: Array,
      default: () => []
    },
    selectedKeys: {
      type: Array,
      default: () => []
    },
    theme: {
      type: String,
      default: 'dark'
    }
  },
  data() {
    return { localOpeneds: [] };
  },
  created() {
    this.$watch(
      'openKeys',
      (newVal) => {
        this.localOpeneds = newVal;
      },
      { immediate: true }
    );
  },
  methods: {
    handleCollapse() {
      this.$emit('update:collapse', !this.collapse);
    }
  }
};
</script>

<style lang="less" scoped>
.x-sider {
  width: 100%;
  /* height: 100vh; */
  overflow: hidden;
}

.menu-box {
  overflow-x: hidden;
  overflow-y: scroll;
  height: calc(100vh - 64px);
  width: calc(100% + 17px);
  // transition: width 0.5s ease;
}
// .menu-ico:not(:empty) {
//   color: $primary-color;
//   border: 1px solid $primary-color;
//   padding: 2px;
//   border-radius: 0 4px 4px 4px;
// }
.sider-trigger {
  position: absolute;
  width: 16px;
  height: 68px;
  line-height: 68px;
  right: -16px;
  top: 50%;
  color: @primary-color;
  background: #e6f7ff;
  cursor: pointer;
  z-index: 1;
}
</style>
<style lang="less">
.ant-menu-sub .ant-menu-item:before {
  content: '';
  display: block;
  width: 4px;
  height: 4px;
  background: #00479d;
  position: absolute;
  top: 50%;
  margin-left: -16px;
  margin-top: -2px;
}
.ant-menu-submenu-popup .ant-menu-item:before {
  display: none;
}
</style>
