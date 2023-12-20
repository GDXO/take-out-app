<template>
  <div class="starBox" :class="starSizeClass">
    <span
      v-for="(classItem, index) of classArray"
      :class="classItem"
      class="starItem"
      :key="index"
    ></span>
  </div>
</template>

<script>
const STAR_LENGTH = 5
const STAR_SOLID = 'starSolid'
const STAR_HALF = 'starHalf'
const STAR_EMPTY = 'starEmpty'

export default {
  name: 'CommonStar',
  props: {
    size: {
      type: Number,
      required: true,
      default: 0
    },
    score: {
      type: Number,
      required: true,
      default: 0
    }
  },
  computed: {
    starSizeClass () {
      return `star${this.size}Box`
    },
    classArray () {
      const result = []
      const computedScore = Math.floor(this.score * 2) / 2
      const hasDecimal = computedScore % 1 !== 0
      const solidStarLength = Math.floor(computedScore)

      for (let i = 0; i < solidStarLength; i++) {
        result.push(STAR_SOLID)
      }

      if (hasDecimal) result.push(STAR_HALF)

      while (result.length < STAR_LENGTH) {
        result.push(STAR_EMPTY)
      }

      return result
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.starBox {
  font-size: 0;

  .starItem {
    display: inline-block;
    background: no-repeat center;
  }

  &.star48Box {
    .starItem {
      width: 20px;
      height: 19px;
      background-size: 20px 19px;
      margin-right: 22px;

      &:last-child {
        margin-right: 0;
      }
    }

    .starSolid {
      .background-image('../images/star48_on');
    }

    .starHalf {
      .background-image('../images/star48_half');
    }

    .starEmpty {
      .background-image('../images/star48_off');
    }
  }

  &.star36Box {
    .starItem {
      width: 15px;
      height: 14.5px;
      background-size: 15px 14.5px;
      margin-right: 6.25px;

      &:last-child {
        margin-right: 0;
      }
    }

    .starSolid {
      .background-image('../images/star36_on');
    }

    .starHalf {
      .background-image('../images/star36_half');
    }

    .starEmpty {
      .background-image('../images/star36_off');
    }
  }

  &.star24Box {
    .starItem {
      width: 10px;
      height: 9.5px;
      background-size: 10px 9.5px;
      margin-right: 3.5px;

      &:last-child {
        margin-right: 0;
      }
    }

    .starSolid {
      .background-image('../images/star24_on');
    }

    .starHalf {
      .background-image('../images/star24_half');
    }

    .starEmpty {
      .background-image('../images/star24_off');
    }
  }
}
</style>
