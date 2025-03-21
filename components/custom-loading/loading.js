let loadingComponent = null;

export default {
  install(Vue) {
    Vue.prototype.$customLoading = {
      show(title) {
        if (!loadingComponent) {
          loadingComponent = Vue.extend(require('@/components/custom-loading/index.vue').default);
          loadingComponent = new loadingComponent().$mount(document.createElement('div'));
          document.body.appendChild(loadingComponent.$el);
        }
        loadingComponent.showLoading(title);
      },
      hideLoading() {
        if (loadingComponent) loadingComponent.hideLoading();
      },
      setTitle(title) {
        if (loadingComponent) loadingComponent.setLoadingTitle(title);
      }
    };
  }
};