<template>
  <div class="intervalBox"></div>
</template>

<script>
export default {
  name: 'CommonInterval'
}
</script>

<style lang='less' scoped>
@import '@/assets/css/mixins.less';

.intervalBox {
    height: 16px;
    width: 100%;
    background: #F3F5F7;
    .border-1px(rgba(7, 17, 27, 0.1));
  }
</style>
