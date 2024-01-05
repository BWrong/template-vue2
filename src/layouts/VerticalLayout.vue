<template>
  <a-layout class="layout">
    <l-header :collapse.sync="collapse" :bread-crumb="parentMenus" class="layout-header-fixed">
      <l-logo slot="logo" style="margin: 0 20px 0 0" />
    </l-header>
    <a-layout class="layout-main" style="padding-top: 64px">
      <a-layout-sider v-model="collapse" :theme="theme" :trigger="null" collapsible breakpoint="lg">
        <l-sider
          :menus="menus"
          :theme="theme"
          :collapse.sync="collapse"
          :open-keys="openeds"
          :selected-keys="curtMenuKey"
        />
      </a-layout-sider>
      <a-layout-content class="app-scroll-wrap">
        <l-bread-crumb :data="parentMenus" :collapse.sync="collapse" />
        <div class="app-main">
          <transition mode="out-in" name="fade-transform">
            <router-view />
          </transition>
        </div>
        <l-footer />
      </a-layout-content>
    </a-layout>
  </a-layout>
</template>
<script>
import layoutMinxin from '@/mixins/layout.mixin';
export default {
  name: 'VerticalLayout',
  mixins: [layoutMinxin()]
};
</script>
<style lang="less" scoped>
@import url('../assets/styles/layout.less');
</style>
