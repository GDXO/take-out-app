<template>
  <div class="ratingBox">
    <div class="ratingType borderOnePx">
      <span
        class="allRatingBtn"
        :class="{ active: selectedType === 2 }"
        @click="selectedTypeFn(2, $event)"
      >
        {{ desc.all }}<span class="ratingCount">{{ ratingsData.length }}</span>
      </span>
      <span
        class="positiveBtn"
        :class="{ active: selectedType === 1 }"
        @click="selectedTypeFn(1, $event)"
      >
        {{ desc.positive
        }}<span class="ratingCount">{{ positiveCountNum }}</span>
      </span>
      <span
        class="negativeBtn"
        :class="{ active: selectedType === 0 }"
        @click="selectedTypeFn(0, $event)"
      >
        {{ desc.negative
        }}<span class="ratingCount">{{ negativeCountNum }}</span>
      </span>
    </div>
    <div class="showContentSwitchBox borderOnePx">
      <svg
        class="icon switchIcon"
        aria-hidden="true"
        :class="{ active: showContent }"
        @click="toggleShowContentFn"
      >
        <use xlink:href="#take-check_circle"></use>
      </svg>
      <span>只看有内容的评价</span>
    </div>
    <div class="ratingMainBox">
      <ul class="ratingListUl" v-if="ratingsData.length">
        <li
          class="ratingItemBox borderOnePx"
          v-for="(rating, ratingIndex) of ratingsData"
          :key="ratingIndex"
          v-show="ratingShow(rating.rateType, rating.text)"
        >
          <p class="ratingItemHeader cleanBoth">
            <span class="ratingTime">{{ rating.rateTime | formateDate }}</span>
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
</template>

<script>
import { timeFormat } from '@/assets/js/utils'

const RATING_ALL = 2
const RATING_POSITIVE = 1
const RATING_NEGATIVE = 0

export default {
  name: 'RatingModule',
  props: {
    ratingsData: {
      type: Array,
      required: true,
      default: () => []
    },
    selectedType: {
      type: Number,
      required: true,
      default: RATING_ALL
    },
    showContent: {
      type: Boolean,
      required: true,
      default: false
    },
    desc: {
      type: Object,
      required: true,
      default: () => ({
        all: '全部',
        positive: '满意',
        negative: '不满意'
      })
    }
  },
  computed: {
    positiveCountNum () {
      return this.ratingsData.filter(
        rating => rating.rateType * 1 + 1 === RATING_POSITIVE
      ).length
    },
    negativeCountNum () {
      return this.ratingsData.filter(
        rating => rating.rateType * 1 - 1 === RATING_NEGATIVE
      ).length
    }
  },
  filters: {
    formateDate (time) {
      return timeFormat(time, '-', true)
    }
  },
  methods: {
    selectedTypeFn (emitType, evt) {
      if (!evt._constructed) return false
      this.$emit('changeSelectedType', emitType)
    },
    toggleShowContentFn (evt) {
      if (!evt._constructed) return false
      this.$emit('toggleShowContent', !this.showContent)
    },
    ratingShow (type, text) {
      if (this.showContent && !text) return false
      if (this.selectedType === RATING_ALL) return true
      else if (type * 1 + 1 === 1) return this.selectedType === 1
      else if (type * 1 - 1 === 0) return this.selectedType === 0
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.ratingType {
  padding: 18px 0;
  margin: 0 18px;
  .border-1px(rgba(7, 17, 27, 0.1));

  & > span {
    padding: 8px 12px;
    font-size: 12px;
    border-radius: 2px;
    line-height: 16px;
    color: rgb(77, 85, 93);
    margin-right: 8px;
    font-weight: normal;

    &.allRatingBtn,
    &.positiveBtn {
      background: rgba(0, 160, 233, 0.2);

      &.active {
        background: rgb(0, 160, 233);
        color: #fff;
      }
    }

    &.negativeBtn {
      background: rgba(77, 85, 93, 0.2);
      margin-right: 0;

      &.active {
        background: rgb(77, 85, 93);
        color: #fff;
      }
    }

    .ratingCount {
      font-size: 8px;
      margin-left: 5px;
    }
  }
}

.showContentSwitchBox {
  padding: 12px 18px;
  border-bottom: 1px solid rgba(7, 17, 27, 0.1);
  font-size: 12px;
  color: rgb(147, 153, 159);
  line-height: 24px;
  font-weight: normal;

  & > .icon {
    font-size: 24px;
    vertical-align: -7px;
    margin-right: 4px;

    &.active {
      color: #00c850;
    }
  }
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

  .ratingContentBox{
    font-size: 0;
    font-weight: normal;

    .icon{
      font-size: 12px;
      line-height: 24px;

      &.ratingUpIcon{
        color: rgb(0, 160, 233);
      }

      &.ratingDownIcon{
        color: rgb(147, 153, 159);
      }
    }

    & > span{
      font-size: 12px;
      color: rgb(7, 17, 27);
      margin-left: 4px;
    }
  }
}

.noRatingBox{
  padding: 16px 18px;
  font-size: 12px;
  color: rgb(147, 153, 159);
}
</style>
