<template>
  <div class="ratingPageBox" ref="ratingPageContainer">
    <div class="ratingMain">
      <div class="comprehensiveRatingBox borderOnePx">
        <div class="gradeRatingBox">
          <p class="gradeBox">{{ seller.score }}</p>
          <p class="gradeTitle">综合评分</p>
          <p class="gradeCompare">高于周边商家{{ seller.rankRate }}%</p>
        </div>
        <div class="starRatingBox">
          <div class="serviceAttitudeBox">
            <span class="starRatingTitle">服务态度</span>
            <Star :size="36" :score="seller.serviceScore" />
            <span class="starGrade">{{ seller.serviceScore }}</span>
          </div>
          <div class="productRatingsBox">
            <span class="starRatingTitle">商品评分</span>
            <Star :size="36" :score="seller.foodScore" />
            <span class="starGrade">{{ seller.foodScore }}</span>
          </div>
          <div class="deliveryTimeBox">
            <span class="starRatingTitle">送达时间</span>
            <span class="starGrade deliveryTime"
              >{{ seller.deliveryTime }}分钟</span
            >
          </div>
        </div>
      </div>
      <Interval />
      <RatingModule
        :desc="desc"
        :selectedType="selectedType"
        :showContent="showContent"
        :ratingsData="ratingsData"
        @changeSelectedType="changeSelectedTypeFn"
        @toggleShowContent="toggleShowContentFn"
      />
      <ul v-if="ratingsData && ratingsData.length">
        <li
          class="ratingItemBox borderOnePx"
          v-for="(rating, ratingIndex) of ratingsData"
          :key="ratingIndex"
          v-show="ratingShow(rating.rateType, rating.text)"
        >
          <p class="ratingItemHeader cleanBoth">
            <img width="28" height="28" :src="rating.avatar" alt="评论者头像" />
            <span class="ratingUserBox">
              {{ rating.username }}
              <span class="starBox">
                <Star :size="24" :score="rating.score" />
                <span class="deliveryTimeText">
                  {{ rating.deliveryTime }}分钟送达
                </span>
              </span>
            </span>
            <span class="ratingTimeBox">{{
              rating.rateTime | formateDate
            }}</span>
          </p>
          <p class="ratingContentBox">{{ rating.text }}</p>
          <div
            class="recommendBox"
            v-show="rating.recommend && rating.recommend.length"
          >
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
            <span
              class="recommendItem"
              v-for="(recommendItem, recommendIndex) of rating.recommend"
              :key="recommendIndex"
            >
              {{ recommendItem }}
            </span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import axios from 'axios'
import BScroll from '@better-scroll/core'
import Star from '@/components/Star/'
import Interval from '@/components/Interval/'
import RatingModule from '@/components/RatingModule/'
import { timeFormat } from '@/assets/js/utils'

const ERR_CODE = 0
const RATING_ALL = 2
const RATING_POSITIVE = 1
const RATING_NEGATIVE = 0

export default {
  name: 'PageRatings',
  components: {
    Star,
    Interval,
    RatingModule
  },
  props: {
    seller: {
      type: Object,
      required: false
    }
  },
  created () {
    this.getRatingsData()
  },
  data () {
    return {
      ratingsData: [],
      selectedType: RATING_ALL,
      showContent: false,
      desc: {
        all: '全部',
        positive: '推荐',
        negative: '不满意'
      }
    }
  },
  filters: {
    formateDate (time) {
      return timeFormat(time, '-', true)
    }
  },
  methods: {
    async getRatingsData () {
      const { data } = await axios.get('/api/ratings')

      if (data.err_code === ERR_CODE) return false

      console.log(data.data)

      this.ratingsData = data.data

      this.$nextTick(() => {
        if (!this.ratingPageContainer) {
          this.ratingPageContainer = new BScroll(
            this.$refs.ratingPageContainer,
            {
              click: true,
              probeType: 3
            }
          )
        } else {
          this.ratingPageContainer.refresh()
        }
      })
    },
    changeSelectedTypeFn (btnType) {
      this.selectedType = btnType
      this.$nextTick(() => {
        this.ratingPageContainer.refresh()
      })
    },
    toggleShowContentFn (contentType) {
      this.showContent = contentType
      this.$nextTick(() => {
        this.ratingPageContainer.refresh()
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

.ratingPageBox {
  background: #fff;
  height: calc(100% - 174px);
  overflow: hidden;

  .comprehensiveRatingBox {
    padding: 18px 0;
    overflow: hidden;
    .border-1px(rgba(7, 17, 27, 0.2));

    .gradeRatingBox {
      font-size: 0;
      display: inline-block;
      width: 36%;
      text-align: center;
      border-right: 1px solid rgba(7, 17, 27, 0.1);

      .gradeBox {
        font-size: 24px;
        color: rgb(255, 153, 0);
        line-height: 28px;
        font-weight: normal;
        margin-bottom: 6px;
      }

      .gradeTitle {
        font-size: 12px;
        font-weight: normal;
        color: rgb(7, 17, 27);
        line-height: 12px;
        margin-bottom: 8px;
      }

      .gradeCompare {
        font-size: 10px;
        color: rgb(147, 153, 159);
        line-height: 10px;
        margin-bottom: 6px;
        font-weight: normal;
      }
    }

    .starRatingBox {
      display: inline-block;
      width: 64%;

      & > div {
        margin: 8px auto 0;
        font-size: 0;
        width: 185px;

        &:first-child {
          margin-top: 0;
        }

        &:last-child {
          margin-bottom: 6px;
        }

        .starRatingTitle {
          font-size: 12px;
          color: rgb(7, 17, 27);
          font-weight: normal;
          line-height: 18px;
        }

        .starBox {
          display: inline-block;
          margin-left: 10px;
          vertical-align: -3px;
        }

        .starGrade {
          font-size: 12px;
          color: rgb(255, 153, 0);
          line-height: 18px;
          font-weight: normal;
          margin-left: 10px;

          &.deliveryTime {
            color: rgb(147, 153, 159);
          }
        }
      }
    }
  }

  .ratingItemBox {
    padding: 18px;
    .border-1px(rgba(7, 17, 27, 0.1));

    .ratingItemHeader {
      display: flex;
      font-weight: normal;

      img {
        border-radius: 50%;
        width: 28px;
      }

      .ratingUserBox {
        display: flex;
        flex: 1;
        font-size: 10px;
        color: rgb(7, 17, 27);
        line-height: 12px;
        flex-direction: column;
        margin: 0 0 6px 12px;

        .starBox {
          display: flex;
          margin-top: 4px;
          align-items: baseline;

          .deliveryTimeText {
            font-size: 10px;
            font-weight: 200;
            color: rgb(147, 153, 159);
            line-height: 12px;
            margin-left: 6px;
          }
        }
      }

      .ratingTimeBox {
        font-size: 10px;
        font-weight: 200;
        color: rgb(147, 153, 159);
        line-height: 12px;
      }
    }

    .ratingContentBox {
      font-size: 12px;
      font-weight: normal;
      color: rgb(7, 17, 27);
      line-height: 18px;
      margin: 0 0 8px 40px;
    }

    .recommendBox {
      margin-left: 40px;

      .icon {
        font-size: 12px;
        line-height: 16px;

        &.ratingUpIcon {
          color: rgb(0, 160, 233);
        }

        &.ratingDownIcon {
          color: rgb(147, 153, 159);
        }
      }

      .recommendItem {
        display: inline-block;
        padding: 3px 6px;
        font-size: 9px;
        color: rgb(147, 153, 159);
        line-height: 16px;
        border: 1px solid rgba(7, 17, 27, 0.1);
        background: #fff;
        border-radius: 1px;
        margin-left: 8px;
        margin-bottom: 8px;
        font-weight: normal;

        &:last-child {
          margin-right: 0;
        }
      }
    }
  }
}
</style>
