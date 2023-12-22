<template>
  <div class="sellerPageContainer" ref="sellerPageContainer">
    <div class="sellerPageMainContainer">
      <div class="overviewBox borderOnePx">
        <div class="overviewTitleBox borderOnePx">
          <div class="sellerTitleBox">
            <span class="sellerName">{{ seller.name }}</span>
            <div class="starContainer">
              <Star :size="36" :score="seller.serviceScore" />
              <span class="ratingCountText">({{ seller.ratingCount }})</span>
              <span class="sellCountText">月售{{ seller.sellCount }}单</span>
            </div>
          </div>
          <span class="favoriteBox" @click="toggleFavoriteFn">
            <svg class="icon favoriteIcon" :class="{'active': favorite}" aria-hidden="true">
              <use xlink:href="#take-favorite"></use>
            </svg>
            {{ favoriteText }}
          </span>
        </div>
        <div class="remarkBox">
          <p class="overviewRemarkItem">
            <span class="titleText">起送价</span>
            <span class="numberText">
              {{ seller.minPrice }}
              <span class="unitText">元</span>
            </span>
          </p>
          <p class="overviewRemarkItem">
            <span class="titleText">商家配送</span>
            <span class="numberText">
              {{ seller.deliveryPrice }}
              <span class="unitText">元</span>
            </span>
          </p>
          <p class="overviewRemarkItem">
            <span class="titleText">平均配送时间</span>
            <span class="numberText">
              {{ seller.deliveryTime }}
              <span class="unitText">分钟</span>
            </span>
          </p>
        </div>
      </div>
      <Interval />
      <div class="bulletinBox borderOnePx">
        <p class="bulletinTitleText">公告和活动</p>
        <p class="bulletinText borderOnePx">{{ seller.bulletin }}</p>
        <ul v-show="seller.supports && seller.supports.length">
          <li
            class="supportBox borderOnePx"
            v-for="(support, supportIndex) of seller.supports"
            :key="supportIndex"
          >
            <LeftIcon
              :iconType="support.type"
              :imageName="4"
              :imageWidth="16"
              :imageHeight="16"
              :marginRight="6"
            />
            <span class="supportText">{{ support.description }}</span>
          </li>
        </ul>
      </div>
      <Interval />
      <div class="businessRealityBox borderOnePx">
        <p class="businessRealityText">商家实景</p>
        <div ref="realityContainer" v-show="seller.pics && seller.pics.length">
          <ul class="realityMainBox" ref="realityMainBox">
            <li
              class="realityItemBox"
              v-for="(realityItem, realityIndex) of seller.pics"
              :key="realityIndex"
            >
              <img :src="realityItem" alt="商家实景图片" />
            </li>
          </ul>
        </div>
      </div>
      <Interval />
      <div class="businessInfoContainer">
        <p class="infoText">商家信息</p>
        <ul v-show="seller.infos && seller.infos.length">
          <li
            class="infoItemBox"
            v-for="(infoItem, infoIndex) of seller.infos"
            :key="infoIndex"
          >
            {{ infoItem }}
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import BScroll from '@better-scroll/core'
import { saveDataToLocalStorage, readDataFromLocalStorage } from '@/assets/js/handleStorage'
import Star from '@/components/Star/'
import Interval from '@/components/Interval/'
import LeftIcon from '@/components/LeftIcon/'

export default {
  name: 'PageSellers',
  components: {
    Star,
    Interval,
    LeftIcon
  },
  props: {
    seller: {
      type: Object,
      required: false
    }
  },
  mounted () {
    this._initScroll()
  },
  data () {
    return {
      favorite: readDataFromLocalStorage(this.seller.id, 'favorite', false)
    }
  },
  computed: {
    favoriteText () {
      return this.favorite ? '已收藏' : '收藏'
    }
  },
  methods: {
    _initScroll () {
      // 页面滚动
      this.sellerPageScroll = new BScroll(this.$refs.sellerPageContainer, {
        click: true
      })

      /* 商家实景滚动 */
      // 计算容器的宽度
      const imgWidth = 120
      const imgMarginLeft = 6

      // 赋值容器宽度
      this.$refs.realityMainBox.style.width =
        (imgWidth + imgMarginLeft) * this.seller.pics.length -
        imgMarginLeft +
        'px'

      this.realityScroll = new BScroll(this.$refs.realityContainer, {
        startX: 0,
        click: true,
        scrollX: true,
        scrollY: false,
        eventPassthrough: 'vertical'
      })
    },
    toggleFavoriteFn (evt) {
      if (!evt._constructed) return false

      this.favorite = !this.favorite

      saveDataToLocalStorage(this.seller.id, 'favorite', this.favorite)
    }
  }
}
</script>

<style lang="less" scoped>
@import '@/assets/css/mixins.less';

.sellerPageContainer {
  background: #fff;
  height: calc(100% - 174px);
  overflow: hidden;

  .sellerName,
  .bulletinTitleText,
  .businessRealityText,
  .infoText {
    font-size: 14px;
    color: rgb(7, 17, 27);
    line-height: 14px;
    margin-bottom: 8px;
    font-weight: normal;
  }

  .overviewBox {
    padding: 18px;
    .border-1px(rgba(7, 17, 27, 0.2));

    .overviewTitleBox {
      display: flex;
      font-weight: normal;
      padding-bottom: 18px;
      .border-1px(rgba(7, 17, 27, 0.1));

      .sellerTitleBox {
        display: flex;
        flex: 1;
        flex-direction: column;

        .starContainer {
          display: flex;
          flex-direction: row;
          font-size: 10px;
          color: rgb(77, 85, 93);
          line-height: 18px;

          .ratingCountText {
            margin-left: 8px;
          }

          .sellCountText {
            margin-left: 12px;
          }
        }
      }

      .favoriteBox {
        display: flex;
        flex-direction: column;
        align-items: flex-end;
        font-size: 10px;
        color: rgb(77, 85, 93);
        line-height: 10px;
        font-weight: normal;

        .favoriteIcon {
          font-size: 24px;
          color: #D4D6D9;
          line-height: 24px;
          margin-bottom: 4px;

          &.active{
            color: rgb(240, 20, 20);
          }
        }
      }
    }

    .remarkBox {
      display: flex;
      flex-wrap: nowrap;
      padding-top: 18px;

      .overviewRemarkItem {
        display: flex;
        flex: 1;
        flex-direction: column;
        align-items: center;
        border-left: 1px solid rgba(7, 17, 27, 0.1);

        &:first-child {
          border-left: none;
        }

        .titleText {
          font-size: 10px;
          color: rgb(147, 153, 159);
          line-height: 10px;
          font-weight: normal;
          margin-bottom: 4px;
        }

        .numberText {
          font-size: 24px;
          font-weight: 200;
          color: rgb(7, 17, 27);
          line-height: 24px;

          .unitText {
            font-size: 10px;
            font-weight: normal;
          }
        }
      }
    }
  }

  .bulletinBox {
    padding: 18px 18px 0;
    .border-1px(rgba(7, 17, 27, 0.2));

    .bulletinText {
      font-size: 12px;
      font-weight: 400;
      color: rgb(240, 20, 20);
      line-height: 24px;
      padding: 0 12px;
      padding-bottom: 16px;
      .border-1px(rgba(7, 17, 27, 0.1));
    }

    .supportBox {
      padding: 16px 12px;
      .border-1px(rgba(7, 17, 27, 0.1));

      &:last-child {
        &:after {
          border: none;
        }
      }

      .supportText {
        font-size: 12px;
        font-weight: 200;
        color: rgb(7, 17, 27);
        line-height: 16px;
      }
    }
  }

  .businessRealityBox {
    padding: 18px;
    .border-1px(rgba(7, 17, 27, 0.2));

    .businessRealityText {
      margin-bottom: 12px;
    }

    .realityContainer{
      overflow: hidden;
    }

    .realityMainBox {
      overflow: hidden;
      white-space: nowrap;

      .realityItemBox {
        display: inline-block;
        margin-left: 6px;

        img {
          width: 120px;
          height: 90px;
        }

        &:first-child {
          margin-left: 0;
        }
      }
    }
  }

  .businessInfoContainer {
    padding: 18px;

    .infoText {
      margin-bottom: 12px;
    }

    .infoItemBox {
      padding: 16px 12px;
      border-top: 1px solid rgba(7, 17, 27, 0.1);
      font-size: 12px;
      font-weight: 300;
      color: rgb(7, 17, 27);
      line-height: 16px;
    }
  }
}
</style>
