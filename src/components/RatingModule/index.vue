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
  </div>
</template>

<script>
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
  methods: {
    selectedTypeFn (emitType, evt) {
      if (!evt._constructed) return false
      this.$emit('changeSelectedType', emitType)
    },
    toggleShowContentFn (evt) {
      if (!evt._constructed) return false
      this.$emit('toggleShowContent', !this.showContent)
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
</style>
