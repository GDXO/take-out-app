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
          <div class="ratingMainBox">
            <ul v-if="selectedFood.ratings && selectedFood.ratings.length">
              <li
                class="ratingItemBox borderOnePx"
                v-for="(rating, ratingIndex) of selectedFood.ratings"
                :key="ratingIndex"
                v-show="ratingShow(rating.rateType, rating.text)"
              >
                <p class="ratingItemHeader cleanBoth">
                  <span class="ratingTime">{{
                    rating.rateTime | formateDate
                  }}</span>
                  <span class="ratingUser">
                    {{ rating.username }}
                    <img
                      width="12"
                      height="12"
                      :src="rating.avatar"
                      alt="评论者头像"
                    />
                  </span>
                </p>
                <div class="ratingContentBox">
                  <svg
                    class="icon ratingUpIcon"
                    aria-hidden="true"
                    v-if="rating.rateType === 0"
                  >
                    <use xlink:href="#take-thumb_up"></use>
                  </svg>
                  <svg class="icon ratingDownIcon" aria-hidden="true" v-else>
                    <use xlink:href="#take-thumb_down"></use>
                  </svg>
                  <span>{{ rating.text }}</span>
                </div>
              </li>
            </ul>
            <div class="noRatingBox" v-else>暂无评价内容</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script>
import BScroll from '@better-scroll/core'
import CartControl from '@/components/CartControl/'
import IntervalBox from '@/components/Interval/'
import Rating from '@/components/RatingModule/'
import { timeFormat } from '@/assets/js/utils'

const RATING_ALL = 2
const RATING_POSITIVE = 1
const RATING_NEGATIVE = 0

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
  filters: {
    formateDate (time) {
      return timeFormat(time, '-', true)
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
            click: true,
            probeType: 3
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
    },
    ratingShow (type, text) {
      if (this.showContent && !text) return false
      if (this.selectedType === RATING_ALL) return true
      else if (type * 1 + 1 === RATING_POSITIVE) {
        return this.selectedType === RATING_POSITIVE
      } else if (type * 1 - 1 === RATING_NEGATIVE) {
        return this.selectedType === RATING_NEGATIVE
      }
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

  .ratingContainer {
    padding-top: 18px;

    .ratingTitle {
      font-size: 14px;
      font-weight: 500;
      margin: 0 18px;
      color: rgb(7, 17, 27);
    }

    .ratingItemBox {
      padding: 16px 18px;
      .border-1px(rgba(7, 17, 27, 0.1));

      .ratingItemHeader {
        margin-bottom: 6px;
        color: rgb(147, 153, 159);
        line-height: 12px;
        font-size: 0;
        font-weight: normal;

        & > span {
          font-size: 10px;
        }

        .ratingTime {
          float: left;
        }

        .ratingUser {
          float: right;

          img {
            border-radius: 50%;
            margin-left: 6px;
            vertical-align: top;
          }
        }
      }

      .ratingContentBox {
        font-size: 0;
        font-weight: normal;

        .icon {
          font-size: 12px;
          line-height: 24px;

          &.ratingUpIcon {
            color: rgb(0, 160, 233);
          }

          &.ratingDownIcon {
            color: rgb(147, 153, 159);
          }
        }

        & > span {
          font-size: 12px;
          color: rgb(7, 17, 27);
          margin-left: 4px;
        }
      }
    }

    .noRatingBox {
      padding: 16px 18px;
      font-size: 12px;
      color: rgb(147, 153, 159);
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
