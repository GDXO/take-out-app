<template>
  <div>
    <div class="goodBox">
      <div class="menuContainer" ref="menuBox">
        <ul class="menuBox">
          <li
            v-for="(menuItem, index) of goods"
            :key="index"
            class="menuItemBox borderOnePx"
            :class="{ current: currentIndex === index }"
            @click="selectMenu(index, $event)"
          >
            <span class="menuText">
              <LeftIcon
                v-show="menuItem.type > 0"
                class="menuIcon"
                :iconType="menuItem.type"
                :imageName="3"
                :imageWidth="12"
                :imageHeight="12"
                :marginRight="2"
              />{{ menuItem.name }}
            </span>
          </li>
        </ul>
      </div>
      <div class="goodsContainer" ref="goodsBox">
        <ul class="goodsBox">
          <li
            class="goodItemBox goodItemHook"
            v-for="(goodItem, goodIndex) of goods"
            :key="goodIndex"
          >
            <h1 class="goodName">{{ goodItem.name }}</h1>
            <ul>
              <li
                class="foodItemBox borderOnePx"
                v-for="(foodItem, foodIndex) of goodItem.foods"
                :key="foodIndex"
                @click.stop="showFoodDetailFn(foodItem, $event)"
              >
                <div class="foodImgBox">
                  <img
                    alt="商品单项图片"
                    width="57"
                    height="57"
                    :src="foodItem.icon"
                  />
                </div>
                <div class="foodItemContent">
                  <h2 class="foodName">{{ foodItem.name }}</h2>
                  <p class="foodDesc">{{ foodItem.description }}</p>
                  <div class="foodExtra">
                    <span>月售{{ foodItem.sellCount }}份</span>
                    <span>好评率{{ foodItem.rating }}%</span>
                  </div>
                  <div class="foodPrice">
                    <span>
                      <span class="priceIcon">￥</span>{{ foodItem.price }}
                    </span>
                    <span v-show="foodItem.oldPrice">
                      <span class="priceIcon">￥</span>{{ foodItem.oldPrice }}
                    </span>
                  </div>
                  <div class="cartControlContainer">
                    <CartControl :food="foodItem" @addCount="dropBall" />
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <ShopCart
        :deliveryPrice="seller.deliveryPrice"
        :minDeliveryPrice="seller.minPrice"
        :foodsList="selectedFoods"
        ref="shopCart"
      ></ShopCart>
    </div>
    <FoodDetail
      :selectedFood="detailFood"
      ref="foodDetailEl"
      @addCount="dropBall"
    />
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from '@better-scroll/core'
import LeftIcon from '@/components/LeftIcon/'
import ShopCart from '@/components/ShopCart/'
import CartControl from '@/components/CartControl/'
import FoodDetail from '@/components/FoodDetail/'

const ERR_CODE = 0

export default {
  name: 'PageGoods',
  components: {
    LeftIcon,
    ShopCart,
    CartControl,
    FoodDetail
  },
  props: {
    seller: {
      type: Object,
      required: false
    }
  },
  created () {
    this.getGoodsList()
  },
  data () {
    return {
      goods: [],
      listHeight: [],
      scrollY: 0,
      detailFood: {}
    }
  },
  computed: {
    currentIndex () {
      for (let i = 0; i < this.listHeight.length; i++) {
        const height = this.listHeight[i]
        const heightNext = this.listHeight[i + 1]
        if (
          !heightNext ||
          (this.scrollY >= height && this.scrollY < heightNext)
        ) {
          return i
        }
      }
      return 0
    },
    selectedFoods () {
      const resultFoods = []
      this.goods.forEach(goodsItem => {
        goodsItem.foods.forEach(foodItem => {
          if (foodItem.count) {
            resultFoods.push(foodItem)
          }
        })
      })
      return resultFoods
    }
  },
  methods: {
    async getGoodsList () {
      const { data } = await axios.get('/api/goods')

      if (data.errNo !== ERR_CODE) return false

      this.goods = data.data

      this.$nextTick(() => {
        this._initScroll()

        // 计算右侧的高度块
        this._calculateHeight()
      })
    },
    _initScroll () {
      this.menuScroll = new BScroll(this.$refs.menuBox, {
        click: true
      })

      this.goodsScroll = new BScroll(this.$refs.goodsBox, {
        click: true,
        probeType: 3
      })

      // 监听 goodsScroll 的滚动事件
      this.goodsScroll.on('scroll', position => {
        this.scrollY = Math.abs(Math.round(position.y))
      })
    },
    _calculateHeight () {
      const goodsBox = this.$refs.goodsBox
      const goodItemHook = goodsBox.getElementsByClassName('goodItemHook')
      let height = 0

      this.listHeight.push(height)
      for (let i = 0; i < goodItemHook.length; i++) {
        height += goodItemHook[i].clientHeight
        this.listHeight.push(height)
      }
    },
    selectMenu (index, evt) {
      if (!evt._constructed) return false

      const goodsBox = this.$refs.goodsBox
      const goodItemHook = goodsBox.getElementsByClassName('goodItemHook')
      const el = goodItemHook[index]

      this.goodsScroll.scrollToElement(el, 300)
    },
    dropBall (target) {
      this.shopCartDropFn(target)
    },
    shopCartDropFn (target) {
      // 体验优化, 异步加载下落动画
      this.$nextTick(() => {
        this.$refs.shopCart.dropBallFn(target)
      })
    },
    showFoodDetailFn (foodItem, evt) {
      if (!evt._constructed) return false

      console.log(foodItem)

      this.detailFood = foodItem

      this.$refs.foodDetailEl.pageShowFn()
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.goodBox {
  display: flex;
  position: absolute;
  top: 174px;
  bottom: 46px;
  width: 100%;
  overflow: hidden;

  .menuBox {
    width: 80px;
    background: #f3f5f7;

    .menuItemBox {
      display: table;
      width: 100%;
      height: 54px;
      color: #333;
      padding: 0 12px;

      &.current {
        position: relative;
        top: -1px;
        font-size: 12px;
        color: #20272f;
        background: #fff;

        .menuText {
          font-weight: 700;

          &:after {
            border: none;
          }
        }
      }

      &:last-child {
        .menuText {
          &:after {
            border: none;
          }
        }
      }

      .menuIcon {
        vertical-align: -1px;
      }

      .menuText {
        display: table-cell;
        font-size: 12px;
        line-height: 14px;
        vertical-align: middle;
        .border-1px(rgba(7, 17, 27, 0.1));
        font-weight: normal;

        &.indentText {
          left: -16px;
          text-indent: 16px;
          width: 72px;
        }
      }
    }
  }

  .goodsBox {
    flex: 1;

    .goodName {
      height: 26px;
      color: rgb(147, 153, 159);
      background: #f3f5f7;
      font-size: 12px;
      line-height: 26px;
      padding-left: 14px;
      border-left: 2px solid #d9dde1;
    }

    .foodItemBox {
      display: flex;
      padding: 18px 0;
      margin: 0 18px;
      .border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        &:after {
          border: none;
        }
      }

      .foodImgBox {
        width: 57px;
      }

      .foodItemContent {
        flex: 1;
        padding-left: 10px;

        .foodName {
          font-size: 14px;
          color: rgb(7, 17, 27);
          line-height: 14px;
          font-weight: 400;
        }

        .foodDesc,
        .foodExtra {
          font-size: 10px;
          color: rgb(147, 153, 159);
          line-height: 10px;
          margin-top: 8px;
        }

        .foodDesc {
          line-height: 15px;
          font-weight: normal;
        }

        .foodExtra {
          & > span {
            font-size: 10px;
            font-weight: normal;

            &:last-child {
              margin-left: 6px;
            }
          }
        }

        .foodPrice {
          color: #f01414;
          font-size: 0;
          font-weight: 700;
          margin-top: 8px;

          & > span {
            font-size: 14px;
            line-height: 24px;

            .priceIcon {
              font-size: 10px;
              font-weight: normal;
            }

            &:last-child {
              margin-left: 6px;
              font-size: 10px;
              color: rgb(147, 153, 159);
              text-decoration: line-through;

              .priceIcon {
                font-weight: normal;
              }
            }
          }
        }

        .cartControlContainer {
          position: absolute;
          right: 0;
          bottom: 19px;
        }
      }
    }
  }
}
</style>
