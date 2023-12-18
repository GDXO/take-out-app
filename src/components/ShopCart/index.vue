<template>
  <div>
    <div class="shopCartBox">
      <div class="leftBox" @click="toggleShopCartList">
        <div class="logoContainer">
          <div class="logoBox" :class="{ haveFood: totalCount > 0 }">
            <svg class="icon" aria-hidden="true">
              <use xlink:href="#take-shopping_cart"></use>
            </svg>
          </div>
          <div class="shopCountBox" v-show="totalCount > 0">
            {{ totalCount }}
          </div>
        </div>
        <div class="priceBox" :class="{ haveFood: totalCount > 0 }">
          ￥{{ totalPrice }}
        </div>
        <div class="priceDescBox">另需配送费￥{{ deliveryPrice }}元</div>
      </div>
      <div class="rightBox" :class="rightStatusClass" @click="payFn">
        {{ rightStatusHTML }}
      </div>
      <transition-group
        @before-enter="beforeEnter"
        @enter="enter"
        @after-enter="afterEnter"
        name="drop"
      >
        <span
          class="ballItem"
          v-for="(ball, index) of balls"
          :key="index"
          v-show="ball.show"
        ></span>
      </transition-group>
      <transition name="fold-shop-cart">
        <div class="shopCartGoodsListBox" v-show="shopCartListShow">
          <div class="shopCartTitleBox borderOnePx">
            <h1 class="titleText">购物车</h1>
            <span class="clearShopCartBtn" @click="clearShopCartFn">清空</span>
          </div>
          <div class="foodsListContent" ref="foodsListContent">
            <ul class="foodsListBox">
              <li
                class="shopCartFoodItemBox"
                v-for="(shopCartFoodItem, shopCartFoodIndex) of foodsList"
                :key="shopCartFoodIndex"
              >
                <span class="foodName">{{ shopCartFoodItem.name }}</span>
                <div class="priceBox">
                  <span class="priceIcon">￥</span>
                  {{ shopCartFoodItem.price * shopCartFoodItem.count }}
                </div>
                <div class="cartControlContainer">
                  <CartControl
                    :food="shopCartFoodItem"
                    @addCount="dropBallFn"
                  />
                </div>
              </li>
            </ul>
          </div>
        </div>
      </transition>
    </div>
    <transition name="mask">
      <div
        class="maskLayerBox"
        v-show="shopCartListShow"
        @click="hideShopCartFoodsListFn"
      ></div>
    </transition>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import CartControl from '@/components/CartControl/'

export default {
  name: 'ShopCart',
  components: {
    CartControl
  },
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
    return {
      balls: [
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        },
        {
          show: false
        }
      ],
      dropBall: [],
      shopCartListFold: true
    }
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
      else if (this.totalPrice > 0 && this.totalPrice < this.minDeliveryPrice) {
        return `还差￥${this.minDeliveryPrice - this.totalPrice}元起送`
      } else return '去结算'
    },
    rightStatusClass () {
      if (this.totalPrice < this.minDeliveryPrice) return 'initRightBox'
      else return 'finalRightBox'
    },
    shopCartListShow () {
      if (!this.totalCount) {
        // eslint-disable-next-line vue/no-side-effects-in-computed-properties
        this.shopCartListFold = true
        return false
      }

      const show = !this.shopCartListFold

      if (show) {
        if (!this.shopCartListScroll) {
          // eslint-disable-next-line vue/no-async-in-computed-properties
          this.$nextTick(() => {
            this.shopCartListScroll = new BScroll(this.$refs.foodsListContent, {
              click: true
            })
          })
        } else {
          this.shopCartListScroll.refresh()
        }
      }

      return show
    }
  },
  methods: {
    dropBallFn (el) {
      this.balls.forEach(ball => {
        if (!ball.show) {
          ball.show = true
          ball.el = el
          this.dropBall.push(ball)

          return false
        }
      })
    },
    beforeEnter (el) {
      this.balls.forEach(ball => {
        if (ball.show) {
          const rect = ball.el.getBoundingClientRect()
          const x = rect.left - 28
          const y = -1 * (window.innerHeight - rect.top - 40)

          el.style.display = 'inline-block'
          el.style.opacity = 1
          el.style.transform = `translate3d(${x}px,${y}px,0)`
        }
      })
    },
    enter (el) {
      // eslint-disable-next-line no-unused-vars
      const rf = el.offsetHeight

      this.$nextTick(() => {
        el.style.transform = 'translate3d(0,0,0)'
      })
    },
    afterEnter (el) {
      const ball = this.dropBall.shift()

      if (ball) {
        ball.show = false
        el.style.display = 'none'
      }
    },
    toggleShopCartList () {
      if (!this.totalCount) return false
      this.shopCartListFold = !this.shopCartListFold
    },
    clearShopCartFn () {
      this.foodsList.forEach(food => {
        food.count = 0
      })
    },
    hideShopCartFoodsListFn () {
      this.shopCartListFold = true
    },
    payFn () {
      if (this.totalPrice < this.minDeliveryPrice) return false

      alert(`支付${this.totalPrice}元`)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';
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

  .ballItem {
    display: inline-block;
    width: 16px;
    height: 16px;
    position: fixed;
    left: 32px;
    bottom: 22px;
    z-index: 200;
    border-radius: 50%;
    background: rgb(0, 160, 220);

    &.drop-enter-active {
      transition: all 0.4s;
    }
  }

  .shopCartGoodsListBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    transform: translateY(-100%);
    z-index: -1;

    .shopCartTitleBox {
      height: 40px;
      padding: 0 18px;
      background: #f3f5f7;
      line-height: 40px;
      .border-1px(rgba(7, 17, 27, 0.1));

      .titleText {
        font-size: 14px;
        font-weight: 300;
        color: rgb(7, 17, 27);
        float: left;
      }

      .clearShopCartBtn {
        font-size: 12px;
        color: rgb(0, 160, 220);
        float: right;
        font-weight: normal;
      }
    }

    .foodsListContent {
      max-height: 265px;
      overflow: hidden;

      .foodsListBox {
        background: #fff;

        & > .shopCartFoodItemBox:last-child {
          &:after {
            border: none;
          }
        }

        .shopCartFoodItemBox {
          height: 48px;
          padding: 12px 0;
          margin: 0 18px;
          position: relative;
          .border-1px(rgba(7, 17, 27, 0.1));

          .foodName {
            color: #07111b;
            font-size: 14px;
            font-weight: normal;
            line-height: 24px;
          }

          .priceBox {
            position: absolute;
            right: 90px;
            bottom: 12px;
            font-size: 14px;
            font-weight: 700;
            color: rgb(240, 20, 20);
            line-height: 24px;

            .priceIcon {
              font-size: 10px;
              font-weight: normal;
            }
          }

          .cartControlContainer {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }

    &.fold-shop-cart-enter-active,
    &.fold-shop-cart-leave-active {
      transition: all 0.5s linear;
    }

    &.fold-shop-cart-enter,
    &.fold-shop-cart-leave-to {
      opacity: 0;
      transform: translateY(0);
    }
  }
}
.maskLayerBox {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 20;
  background: rgba(7, 17, 27, 0.6);
  backdrop-filter: blur(10px);

  &.mask-enter-active,
  &.mask-leave-active {
    transition: all 0.5s linear;
  }

  &.mask-enter,
  &.mask-leave-to {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>
