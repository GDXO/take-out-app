<template>
  <div id="app">
    <CHeader :seller="seller"></CHeader>
    <div class="tabs borderOnePx">
      <div class="tabItem">
        <router-link to="/goods">商品</router-link>
      </div>
      <div class="tabItem">
        <router-link to="/ratings">评论</router-link>
      </div>
      <div class="tabItem">
        <router-link to="/sellers">商家</router-link>
      </div>
    </div>
    <div class="content"></div>
    <router-view />
  </div>
</template>

<script>
import CHeader from '@/components/Header/'
import axios from 'axios'

const ERR_CODE = 0

export default {
  name: 'App',
  components: {
    CHeader
  },
  data () {
    return {
      seller: {}
    }
  },
  created () {
    this.getSellers()
  },
  methods: {
    async getSellers () {
      const { data } = await axios.get('/api/sellers')

      if (data.errNo !== ERR_CODE) return false

      console.log(data.data)

      this.seller = data.data
    }
  }
}
</script>

<style lang="less">
@import '@/assets/css/mixins.less';

.tabs{
  display: flex;
  width: 100%;
  height: 40px;
  line-height: 40px;
  .border-1px(rgba(7, 17, 27, .1));

  .tabItem{
    flex: 1;
    text-align: center;

    & > a{
      display: block;
      font-size: 14px;
      color: rgb(77, 85, 93);

      &.active{
        color: rgb(240, 20, 20);
      }
    }
  }
}
</style>
