<template>
	<uni-popup ref="loadingPopup" type="center" :mask-click="false">
	  <view class="custom-loading">
	    <uni-icons type="spinner-cycle" size="34" color="#fff" class="spin"></uni-icons>
	    <text class="loading-title">{{ loadingTitle }}</text>
	  </view>
	</uni-popup>
</template>
<script>
export default {
  data() {
    return {
      loadingTitle: '加载中...' // 初始标题
    };
  },
  methods: {
    // 显示加载弹层
    showLoading(title = '加载中...') {
      this.loadingTitle = title;
      this.$refs.loadingPopup.open();
    },
    // 隐藏加载弹层
    hideLoading() {
      this.$refs.loadingPopup.close();
    },
    // 动态更新标题
    setLoadingTitle(title) {
      this.loadingTitle = title;
    }
  }
};
</script>
<style scoped>
.custom-loading {
  background: rgba(0, 0, 0, 0.6);
  padding: 20px 30px;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-bottom: 10%;
}

.spin {
  animation: spin 1s linear infinite;
  margin-bottom: 10px;
}

.loading-title {
  color: #fff;
  font-size: 14px;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>