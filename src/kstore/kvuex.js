// 保存构造函数的引用，避免import
let Vue;

class Store {
  constructor(options) {
    // this.$options = options;
    this._mutations = options.mutations;
    this._actions = options.actions;

    // 响应化处理state
    // this.state = new Vue({
    //   data: options.state
    // });
    this._vm = new Vue({
      data: {
        // 加两个$，vue不做代理
        $$state: options.state
      }
    });

    // 绑定commit,dispatch上下文为store实例
    this.commit = this.commit.bind(this);
    this.dispatch = this.dispatch.bind(this);
  }
  // 存取器，store.state
  get state() {
    console.log(this._vm);
    return this._vm._data.$$state;
  }

  set state(v) {
    console.error("这样不好！");
  }

  // store.commit('add',1)
  // type:mutation的类型
  // payload: 载荷，是参数
  commit(type, payload) {
    const entry = this._mutations[type];

    if (entry) {
      entry(this.state, payload);
    }
  }
  dispatch(type, payload) {
    const entry = this._actions[type];
    if (entry) {
      entry(this, payload);
    }
  }
}

function install(_Vue) {
  Vue = _Vue;

  Vue.mixin({
    beforeCreate() {
      if (this.$options.store) {
        Vue.prototype.$store = this.$options.store;
      }
    }
  });
}

// 导出的对象可理解为Vuex
export default {
  Store,
  install
};
