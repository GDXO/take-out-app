<template>
  <i
    :style="cssVars"
    class="leftIcon"
    :class="`${classMap[iconType]}${imageName}`"
  ></i>
</template>

<script>
export default {
  name: 'CommonLeftIcon',
  props: {
    iconType: {
      type: Number,
      required: true,
      default: 0
    },
    imageName: {
      type: Number,
      require: true,
      default: 0
    },
    imageWidth: {
      type: Number,
      require: true,
      default: 0
    },
    imageHeight: {
      type: Number,
      require: true,
      default: 0
    },
    marginRight: {
      type: Number,
      require: true,
      default: 0
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  data () {
    return {
      classMap: []
    }
  },
  computed: {
    cssVars () {
      return {
        '--background-image-width': `${this.imageWidth}px`,
        '--background-image-height': `${this.imageHeight}px`,
        '--margin-right': `${this.marginRight}px`
      }
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.leftIcon {
  display: inline-block;
  width: var(--background-image-width);
  height: var(--background-image-height);
  background: no-repeat;
  vertical-align: -3px;
  margin-right: var(--margin-right);
  background-size: var(--background-image-width) var(--background-image-height);

  &.decrease1 {
    .background-image('../images/decrease_1');
  }
  &.discount1 {
    .background-image('../images/discount_1');
  }
  &.special1 {
    .background-image('../images/special_1');
  }
  &.invoice1 {
    .background-image('../images/invoice_1');
  }
  &.guarantee1 {
    .background-image('../images/guarantee_1');
  }

  &.decrease2 {
    .background-image('../images/decrease_2');
  }
  &.discount2 {
    .background-image('../images/discount_2');
  }
  &.special2 {
    .background-image('../images/special_2');
  }
  &.invoice2 {
    .background-image('../images/invoice_2');
  }
  &.guarantee2 {
    .background-image('../images/guarantee_2');
  }

  &.decrease3 {
    .background-image('../images/decrease_3');
  }
  &.discount3 {
    .background-image('../images/discount_3');
  }
  &.special3 {
    .background-image('../images/special_3');
  }
  &.invoice3 {
    .background-image('../images/invoice_3');
  }
  &.guarantee3 {
    .background-image('../images/guarantee_3');
  }

  &.decrease4 {
    .background-image('../images/decrease_4');
  }
  &.discount4 {
    .background-image('../images/discount_4');
  }
  &.special4 {
    .background-image('../images/special_4');
  }
  &.invoice4 {
    .background-image('../images/invoice_4');
  }
  &.guarantee4 {
    .background-image('../images/guarantee_4');
  }
}
</style>
