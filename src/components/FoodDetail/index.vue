<template>
  <transition name="detail-show">
    <div v-show="pageShowFlag" class="foodDetailBox" ref="pageContainer">
      <div class="pageContentBox">
        <div class="headerBox">
          <img :src="selectedFood.image" alt="商品详情图片" />
          <svg
            class="icon backIcon"
            aria-hidden="true"
            @click.stop="backGoodPageFn"
          >
            <use xlink:href="#take-arrow_lift"></use>
          </svg>
        </div>
        <div class="titleBox borderOnePx">
          <h2 class="foodName">{{ selectedFood.name }}</h2>
          <div class="foodExtra">
            <span>月售{{ selectedFood.sellCount }}份</span>
            <span>好评率{{ selectedFood.rating }}%</span>
          </div>
          <div class="foodPrice">
            <span>
              <span class="priceIcon">￥</span>{{ selectedFood.price }}
            </span>
            <span v-show="selectedFood.oldPrice">
              <span class="priceIcon">￥</span>{{ selectedFood.oldPrice }}
            </span>
          </div>
          <div
            class="buyBox"
            v-if="!selectedFood.count"
            @click="addFirstFoodFn"
          >
            加入购物车
          </div>
          <div class="cartControlBox" v-else>
            <CartControl
              :food="selectedFood"
              @addCount="emitParentAddCountFn"
            />
          </div>
        </div>
        <IntervalBox />
        <div class="descBox borderOnePx">
          <p class="descTitle">商品介绍</p>
          <p class="descText">{{ selectedFood.description }}</p>
        </div>
        <IntervalBox />
        <div class="ratingContainer">
          <div class="ratingTitle">商品评价</div>
          <Rating
            :desc="desc"
            :selectedType="selectedType"
            :showContent="showContent"
            :ratingsData="selectedFood.ratings"
            @changeSelectedType="changeSelectedTypeFn"
            @toggleShowContent="toggleShowContentFn"
          />
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from '@better-scroll/core'
import CartControl from '@/components/CartControl/'
import IntervalBox from '@/components/Interval/'
import Rating from '@/components/Rating/'

const RATING_ALL = 2
// const RATING_POSITIVE = 1
// const RATING_NEGATIVE = 0

export default {
  name: 'FoodDetail',
  components: {
    CartControl,
    IntervalBox,
    Rating
  },
  props: {
    selectedFood: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  data () {
    return {
      pageShowFlag: false,
      selectedType: RATING_ALL,
      showContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }
    }
  },
  methods: {
    pageShowFn () {
      this.pageShowFlag = true

      // 初始化评论的数据状态
      this.selectedType = RATING_ALL
      this.showContent = false
      this.desc = {
        all: '全部',
        positive: '推荐',
        negative: '吐槽'
      }

      this.$nextTick(() => {
        if (!this.pageContainer) {
          this.pageContainer = new BScroll(this.$refs.pageContainer, {
            click: true
          })
        } else {
          this.pageContainer.refresh()
        }
      })
    },
    backGoodPageFn () {
      this.pageShowFlag = false
    },
    addFirstFoodFn (evt) {
      if (!evt._constructed) return false

      this.$set(this.selectedFood, 'count', 1)

      this.$emit('addCount', evt.target)
    },
    emitParentAddCountFn (target) {
      this.$emit('addCount', target)
    },
    changeSelectedTypeFn (btnType) {
      this.selectedType = btnType
      this.$nextTick(() => {
        this.pageContainer.refresh()
      })
    },
    toggleShowContentFn (contentType) {
      this.showContent = contentType
      this.$nextTick(() => {
        this.pageContainer.refresh()
      })
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.foodDetailBox {
  width: 100%;
  background: #fff;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 46px;

  .headerBox {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 100%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .backIcon {
      position: absolute;
      top: 10px;
      left: 10px;
      font-size: 20px;
      color: #fff;
      padding: 6px;
      border-radius: 5px;
      background: #ccc;
    }
  }

  .titleBox {
    padding: 18px;
    position: relative;
    .border-1px(rgba(7, 17, 27, 0.2));

    .foodName {
      font-size: 14px;
      font-weight: 700;
      color: rgb(7, 17, 27);
      line-height: 14px;
    }

    .foodExtra {
      margin-top: 8px;
      font-size: 0;
      font-weight: normal;

      & > span {
        font-size: 10px;
        color: rgb(147, 153, 159);
        line-height: 10px;

        &:last-child {
          margin-left: 12px;
        }
      }
    }

    .foodPrice {
      margin-top: 18px;
      font-size: 0;

      & > span {
        font-size: 14px;
        font-weight: 700;
        color: rgb(240, 20, 20);
        line-height: 24px;

        & > .priceIcon {
          font-size: 10px;
          font-weight: normal;
        }

        &:last-child {
          margin-left: 12px;
          font-size: 10px;
          font-weight: 700;
          color: rgb(147, 153, 159);
          text-decoration: line-through;

          & > .priceIcon {
            font-weight: normal;
          }
        }
      }
    }

    .buyBox {
      position: absolute;
      right: 18px;
      bottom: 18px;
      padding: 6px 12px;
      border-radius: 12px;
      background: rgb(0, 160, 220);
      font-size: 10px;
      font-weight: normal;
      color: #fff;
      line-height: 12px;
    }

    & > .cartControlBox {
      position: absolute;
      right: 18px;
      bottom: 18px;
      width: 72px;
    }
  }

  .descBox {
    padding: 18px;
    .border-1px(rgba(7, 17, 27, 0.2));

    .descTitle {
      font-size: 14px;
      color: rgb(7, 17, 27);
      font-weight: 500;
      line-height: 24px;
    }

    .descText {
      font-size: 12px;
      font-weight: 400;
      color: rgb(77, 85, 93);
      line-height: 24px;
      margin: 6px 8px;
    }
  }

  .ratingContainer{
    padding-top: 18px;

    .ratingTitle{
      font-size: 14px;
      font-weight: 500;
      margin: 0 18px;
      color: rgb(7, 17, 27);
    }
  }

  &.detail-show-enter-active,
  &.detail-show-leave-active {
    transition: all 0.1s linear;
  }

  &.detail-show-enter,
  &.detail-show-leave-to {
    opacity: 0;
    transform: translate3d(100%, 0, 0);
  }
}
</style>
