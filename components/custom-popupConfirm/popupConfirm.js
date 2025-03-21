let confirmInstance = null;
let loadingComponent = null;

export default {
  install(Vue) {
    Vue.prototype.$confirmTimer = {
      show(options) {
        if (!loadingComponent) {
          loadingComponent = Vue.extend(require('@/components/custom-popupConfirm/index.vue').default);
          loadingComponent = new loadingComponent().$mount(document.createElement('div'));
          document.body.appendChild(loadingComponent.$el);
        }
        loadingComponent.show(options);
      },
    };
  }
};
