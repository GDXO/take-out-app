<template>
  <div class="shopCartBox">
    <div class="leftBox">
      <div class="logoContainer">
        <div class="logoBox" :class="{ haveFood: totalCount > 0 }">
          <svg class="icon" aria-hidden="true">
            <use xlink:href="#take-shopping_cart"></use>
          </svg>
        </div>
        <div class="shopCountBox" v-show="totalCount > 0">{{ totalCount }}</div>
      </div>
      <div class="priceBox" :class="{ haveFood: totalCount > 0 }">
        ￥{{ totalPrice }}
      </div>
      <div class="priceDescBox">另需配送费￥{{ deliveryPrice }}元</div>
    </div>
    <div class="rightBox" :class="rightStatusClass">{{ rightStatusHTML }}</div>
  </div>
</template>

<script>
export default {
  name: 'ShopCart',
  props: {
    deliveryPrice: {
      type: Number,
      required: true,
      default: 0
    },
    minDeliveryPrice: {
      type: Number,
      required: true,
      default: 0
    },
    foodsList: {
      type: Array,
      required: true,
      default: () => []
    }
  },
  data () {
    return {}
  },
  computed: {
    totalPrice () {
      let totalPrice = 0
      this.foodsList.forEach(food => {
        totalPrice += food.price * food.count
      })

      return totalPrice
    },
    totalCount () {
      let totalCount = 0
      this.foodsList.forEach(food => {
        totalCount += food.count
      })

      return totalCount
    },
    rightStatusHTML () {
      if (this.totalPrice === 0) return `￥${this.minDeliveryPrice}起送`
      else if (this.totalPrice > 0 && this.totalPrice < this.minDeliveryPrice) return `还差￥${this.minDeliveryPrice - this.totalPrice}元起送`
      else return '去结算'
    },
    rightStatusClass () {
      if (this.totalPrice < this.minDeliveryPrice) return 'initRightBox'
      else return 'finalRightBox'
    }
  }
}
</script>

<style lang="less" scoped>
.shopCartBox {
  display: flex;
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 50;
  width: 100%;
  height: 46px;

  .leftBox {
    flex: 1;
    background: #141d27;
    font-size: 0;

    .logoContainer {
      display: inline-block;
      position: relative;
      top: -12px;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      margin-left: 12px;
      background: #141d27;
      text-align: center;

      .logoBox {
        width: 44px;
        height: 44px;
        border-radius: 50%;
        background: #2b343c;
        line-height: 59px;
        text-align: center;
        margin-top: 6px;
        margin-left: 6px;

        &.haveFood {
          background: rgb(0, 160, 220);

          .icon {
            color: #fff;
          }
        }

        .icon {
          font-size: 24px;
          color: rgba(255, 255, 255, 0.4);
        }
      }

      .shopCountBox {
        position: absolute;
        top: 0;
        right: 0;
        width: 24px;
        height: 16px;
        border-radius: 6px;
        font-size: 9px;
        font-weight: 700;
        color: #fff;
        text-align: center;
        line-height: 16px;
        background: rgb(240, 20, 20);
        box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.4);
      }
    }

    .priceBox {
      display: inline-block;
      vertical-align: top;
      font-size: 16px;
      font-weight: 700;
      color: rgba(255, 255, 255, 0.4);
      padding: 0 12px;
      margin: 12px 0;
      line-height: 24px;
      border-right: 1px solid rgba(255, 255, 255, 0.1);

      &.haveFood {
        color: #fff;
      }
    }

    .priceDescBox {
      display: inline-block;
      vertical-align: top;
      font-size: 10px;
      color: rgba(255, 255, 255, 0.4);
      padding: 0 12px;
      margin: 12px 0;
      line-height: 24px;
    }
  }

  .rightBox {
    width: 105px;
    font-weight: 700;
    line-height: 46px;
    text-align: center;
    padding: 0 8px;
    vertical-align: middle;

    &.initRightBox {
      font-size: 12px;
      background: #2b333b;
      color: rgba(255, 255, 255, 0.4);
    }

    &.finalRightBox {
      font-size: 14px;
      background: #0f9e42;
      color: #fff;
    }
  }
}
</style>
