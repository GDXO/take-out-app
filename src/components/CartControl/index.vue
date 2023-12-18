<template>
  <div class="cartControlBox">
    <transition name="move">
      <svg
        class="icon cartDecreaseIcon"
        aria-hidden="true"
        v-show="food.count > 0"
        @click.stop="decreaseCountFn"
      >
        <use xlink:href="#take-remove_circle_outline"></use>
      </svg>
    </transition>
    <span class="cartCount" v-show="food.count > 0">{{ food.count }}</span>
    <svg class="icon cartAddIcon" aria-hidden="true" @click.stop="addCountFn">
      <use xlink:href="#take-add_circle"></use>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'CartControl',
  props: {
    food: {
      type: Object,
      required: true,
      default: () => ({})
    }
  },
  methods: {
    addCountFn (evt) {
      if (!evt._constructed) return false
      if (!this.food.count) this.$set(this.food, 'count', 1)
      // eslint-disable-next-line vue/no-mutating-props
      else this.food.count++

      // 向父组件派发一个事件
      this.$emit('addCount', evt.target)
    },
    decreaseCountFn (evt) {
      if (!evt._constructed) return false

      // eslint-disable-next-line vue/no-mutating-props
      if (this.food.count > 0) this.food.count--
    }
  }
}
</script>

<style lang="less" scoped>
.cartControlBox {
  font-size: 0;

  .cartDecreaseIcon,
  .cartAddIcon {
    display: inline-block;
    font-size: 24px;
    color: rgb(0, 160, 220);
    line-height: 24px;
  }

  .cartDecreaseIcon {
    &.move-enter-active,
    &.move-leave-active {
      transition: all 0.4s linear;
    }

    &.move-enter,
    &.move-leave-to {
      opacity: 0;
      transform: translate3d(24px, 0, 0) rotate(180deg);
    }
  }

  .cartCount {
    display: inline-block;
    width: 24px;
    text-align: center;
    font-size: 12px;
    color: rgb(147, 153, 159);
    line-height: 24px;
    vertical-align: top;
    font-weight: normal;
  }
}
</style>
