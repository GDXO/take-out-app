<template>
  <div class="headerBox">
    <!-- 内容 -->
    <div class="contentBox">
      <div class="avatarBox">
        <img width="64" height="64" :src="seller.avatar" alt="商品头像" />
      </div>
      <div class="content">
        <div class="titleBox">
          <i class="titleIcon"></i>
          <span class="titleText">{{ seller.name }}</span>
        </div>
        <p class="description">
          {{ seller.description }} / {{ seller.deliveryTime }}分钟送达
        </p>
        <div v-if="seller.supports" class="supportsBox">
          <LeftIcon
            :iconType="seller.supports[0].type"
            :imageName="1"
            :imageWidth="12"
            :imageHeight="12"
            :marginRight="4"
          />
          <span class="supportText">{{ seller.supports[0].description }}</span>
        </div>
      </div>
      <div
        class="supportCountBox"
        v-if="seller.supports"
        @click="toggleDetailFn"
      >
        <span class="supportCount">{{ seller.supports.length }}个</span>
        <svg class="icon supportCountIcon" aria-hidden="true">
          <use xlink:href="#take-keyboard_arrow_right"></use>
        </svg>
      </div>
    </div>
    <!-- 公告 -->
    <div class="bulletinBox" @click="toggleDetailFn">
      <i class="bulletinIcon"></i>
      <span class="bulletinText">{{ seller.bulletin }}</span>
      <svg class="icon bulletinRightIcon" aria-hidden="true">
        <use xlink:href="#take-keyboard_arrow_right"></use>
      </svg>
    </div>
    <!-- 背景 -->
    <div class="backgroundBox">
      <img width="100%" height="100%" :src="seller.avatar" alt="背景图片" />
    </div>
    <!-- 详情页 -->
    <transition name="fade">
      <div v-show="detailShow" class="detailBox">
        <div class="detailContentBox cleanBoth">
          <div class="detailMainBox">
            <h1 class="detailName">{{ seller.name }}</h1>
            <Star :size="48" :score="seller.score" />
            <div class="subTitleBox">
              <div class="line"></div>
              <div class="titleText">优惠信息</div>
              <div class="line"></div>
            </div>
            <!-- 优惠信息 -->
            <ul class="specialOffersBox">
              <li
                class="specialOffersItem"
                v-for="(support, index) of seller.supports"
                :key="index"
              >
                <LeftIcon
                  :iconType="support.type"
                  :imageName="2"
                  :imageWidth="16"
                  :imageHeight="16"
                  :marginRight="6"
                />
                <span class="supportText">{{ support.description }}</span>
              </li>
            </ul>
            <div class="subTitleBox">
              <div class="line"></div>
              <div class="titleText">商家公告</div>
              <div class="line"></div>
            </div>
            <div class="businessAnnouncements">{{ seller.bulletin }}</div>
          </div>
        </div>
        <div class="detailCloseBox">
          <svg class="icon" aria-hidden="true" @click="toggleDetailFn">
            <use xlink:href="#take-close"></use>
          </svg>
        </div>
      </div>
    </transition>
  </div>
</template>

<script type="text/javascript">
import Star from '@/components/Star/'
import LeftIcon from '@/components/LeftIcon/'

export default {
  name: 'CommonHeader',
  components: {
    Star,
    LeftIcon
  },
  props: {
    seller: {
      type: Object,
      required: true
    }
  },
  created () {
    this.classMap = ['decrease', 'discount', 'special', 'invoice', 'guarantee']
  },
  data () {
    return {
      classMap: [],
      detailShow: false
    }
  },
  methods: {
    toggleDetailFn () {
      this.detailShow = !this.detailShow
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.headerBox {
  color: #fff;
  font-size: 0;
  position: relative;
  background: rgba(7, 17, 27, 0.5);
  overflow: hidden;

  .avatarBox {
    display: inline-block;
    vertical-align: top;

    img {
      border-radius: 2px;
    }
  }

  .contentBox {
    position: relative;
    padding: 24px 12px 18px 24px;

    .content {
      display: inline-block;
      margin-left: 16px;
      font-size: 14px;

      .titleBox {
        margin: 2px 0 8px;

        .titleIcon {
          display: inline-block;
          width: 30px;
          height: 18px;
          background: no-repeat;
          vertical-align: top;
          .background-image('../images/brand');
          background-size: 30px 18px;
        }

        .titleText {
          margin-left: 6px;
          font-size: 16px;
          line-height: 18px;
          font-weight: 600;
        }
      }

      .description {
        margin: 8px 0 10px;
        font-size: 12px;
        line-height: 12px;
      }

      .supportsBox {
        margin-top: -4px;

        .supportText {
          font-size: 10px;
          line-height: 12px;
        }
      }
    }

    .supportCountBox {
      position: absolute;
      right: 12px;
      bottom: 18px;
      padding: 7px 8px;
      line-height: 12px;
      border-radius: 12px;
      background: rgba(0, 0, 0, 0.2);
      font-size: 10px;
      cursor: pointer;

      .supportCountIcon {
        font-size: 10px;
        margin-left: 4px;
      }
    }
  }

  .bulletinBox {
    height: 28px;
    line-height: 28px;
    padding: 0 12px;
    background: rgba(7, 17, 27, 0.2);
    cursor: pointer;

    i.bulletinIcon {
      display: inline-block;
      width: 22px;
      height: 100%;
      background: no-repeat center;
      .background-image('../images/bulletin');
      background-size: 22px 12px;
    }

    .bulletinText {
      display: inline-block;
      width: calc(100% - 55px);
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      font-size: 10px;
      margin: 0 8px;
    }

    .bulletinRightIcon {
      height: 100%;
      font-size: 10px;
    }
  }

  .backgroundBox {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);
  }

  .detailBox {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 100;
    overflow-x: hidden;
    overflow-y: auto;
    background: rgba(7, 17, 27, 0.7);
    backdrop-filter: blur(10px);

    &.fade-enter-active,
    &.fade-leave-active {
      transition: all 0.5s;
    }
    &.fade-enter,
    &.fade-leave-to {
      opacity: 0;
      background: rgba(7, 17, 27, 0);
    }

    .detailContentBox {
      min-height: 100%;

      .detailMainBox {
        padding-top: 64px;
        padding-bottom: 64px;
        font-size: 32px;
        text-align: center;

        .detailName {
          font-size: 16px;
          line-height: 16px;
          font-weight: 700;
          margin-bottom: 16px;
        }

        .subTitleBox {
          display: flex;
          width: 80%;
          margin: 28px auto 24px;

          .line {
            flex: 1;
            background: rgba(255, 255, 255, 0.2);
            height: 1px;
            align-self: center;
          }

          .titleText {
            font-size: 14px;
            line-height: 14px;
            font-weight: 700;
            padding: 0 12px;
          }
        }

        .specialOffersItem {
          text-align: left;
          padding: 0 calc(10% + 12px);
          height: 16px;
          line-height: 18px;
          margin-bottom: 12px;
          font-size: 16px;

          .supportText {
            font-size: 12px;
            font-weight: 200;
            line-height: 12px;
          }
        }

        .businessAnnouncements {
          font-size: 12px;
          font-weight: 200;
          line-height: 24px;
          padding: 0 calc(10% + 12px);
          text-align: left;
        }
      }
    }

    .detailCloseBox {
      width: 32px;
      height: 64px;
      color: rgba(255, 255, 255, 0.5);
      margin: -64px auto 0;
      clear: both;
      font-size: 32px;
    }
  }
}
</style>
