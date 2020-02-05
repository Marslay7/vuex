### vuex

> 介绍：

- Vuex 是一个专为 Vue.js 应用程序开发的**状态管理模式**。它采用集中式存储管理应用的所有组件的状态，并以相应的规则保证状态以**可预测的方式发生变化**。

<img src="https://tva1.sinaimg.cn/large/006tNbRwgy1gblgujjvrfj30gz0cq0t6.jpg"  />

> 安装：

- 库安装：npm install vuex / yarn add vuex
- 项目安装：vue add vuex

> 起始：Store 包裹 State,Mutations,Actions

- State

  - 将应用全局状态定义在 state 中

    ```js
    state: {
      isLogin: false;
    }
    ```

* Mutation

  - 通过 mutation 修改 state 状态

    ```js
    mutations: {
      login(state) {
      	state.isLogin = true;
      },
      logout(state) {
      	state.isLogin = false;
      }
    }
    ```

* 获取和修改方法

  - 使用 store.state 获取状态

    ```html
    <button @click="login" v-if="!$store.state.isLogin">登录</button>
    <button @click="logout" v-else>注销</button>
    ```

  - 使用计算属性获取状态

    ```js
    computed: {
      isLogin() {
      	return this.$store.state.isLogin;
      }
    }
    ```

  - 修改状态只能通过 store.dispatch(mutation)

    ```js
    this.$store.commit("login");
    this.$store.commit("logout");
    ```

* Action

  - 类似于 mutation，不同在于：

    - Action 提交的是 mutation，而不是直接变更状态。

    - Action 可以包含任意异步操作。

      ```js
      // src/store/index.js
      actions: {
        /**
         * param1 vuex传递的上下文context {commit,dispatch,state}
         */
        login({ commit }, username) {
          /**
           * 模拟登录api调用
           * 1秒钟以后如果用户名是admin则登录成功
           */
          return new Promise((resolve, reject) => {
            setTimeout(() => {
              if (username === "admin") {
                commit("login");
                resolve();
              } else {
                reject();
              }
            }, 1000);
          });
        }
      }

      // src/views/Login.vue
      /**
      	* 派发动作，触发actions
        * 这里的login是actions里面的
        */
      this.$store
        .dispatch("login", "admin")
        .then(() => {
        const redirect = this.$route.query.redirect || "/";
        this.$router.push(redirect);
      }).catch(() => {
        console.log("用户名或密码错误，请重试！");
      });
      ```

> 最佳实践：

- 模块化

  - 使用 modules 定义多个子模块利于组件复杂状态

    - 将先前相关登录代码封装到 user.js

      ```js
      export default {
        namespaced: true // 设置独立的命名空间，避免命名冲突
      };
      ```

    - 导入并调用 user 模块

      ```js
      // src/store/index.js
      import user from "./user";

      export default new Vuex.Store({
        modules: {
          user
        }
      });
      ```

    - 访问方式随之变化

      - 例如：$store.state.isLogin => $store.state.user.isLogin

- mapState()/mapMutation()/mapAction()

  - 通过这些映射方法可以减少代码，避免对 store 直接访问

  - state 相关修改：

    ```html+js
    <button @click="login" v-if="!isLogin">登录</button>

    import { mapState } from 'vuex'; computed: { ...mapState('user',
    ['isLogin']); }
    ```

  - action 相关修改：

    ```js
    import { mapActions } from 'vuex';
    methods: {
      login() {
      	this['user/login']('admin').then(...)
      },
      ...mapActions(['user/login', 'user/logout'])
    }
    ```

- Getter

  - 可以使用 getters 从 store 的 state 中派生出一些状态，其实是计算属性在 vuex 的一种迁移

    - 设置如下：

      ```js
      export default {
        namespaced: true, // 设置独立的命名空间，避免命名冲突
        state: {
          isLogin: false,
          username: "" // 用户名
        },
        mutations: {
          login(state, username) {
            state.isLogin = true;
            state.username = username;
          },
          logout(state) {
            state.isLogin = false;
            state.username = "";
          }
        },
        getters: {
          welcome: state => state.username + "，欢迎回来！"
        },
        actions: {
          /**
           * param1 vuex传递的上下文context {commit,dispatch,state}
           */
          login({ commit }, username) {
            /**
             * 模拟登录api调用
             * 1秒钟以后如果用户名是admin则登录成功
             */
            return new Promise((resolve, reject) => {
              setTimeout(() => {
                if (username === "admin") {
                  commit("login", username);
                  resolve();
                } else {
                  reject();
                }
              }, 1000);
            });
          }
        }
      };
      ```

    - 使用：

      ```html+js
      // src/App.vue
      <span v-if="isLogin">
        {{ welcome }}
        <button>注销</button>
      </span>

      import { mapState, mapGetters } from "vuex"; export default { name: "app",
      computed: { ...mapState("user", ["isLogin"]), ...mapGetters("user",
      ["welcome"]) } };
      ```

> 严格模式

- 严格模式下，无论何时发生了状态变更且不是由 mutation 函数引起的，将会抛出错误。这能保证所有的状态变更都能被调试工具跟踪到。

  ```js
  // 防止随意手动修改数据
  const store = new Vuex.Store({
    // ...
    strict: true
  });
  ```

> 插件

- 概念：

  Vuex 的 store 接受 plugins 选项，这个选项暴露出每次 mutation 的钩子。Vuex 插件就是一个函 数，它接收 store 作为唯一参数：

  ```js
  const myPlugin = store => {
    // 当 store 初始化后调用
  };
  ```

- 注册插件：

  ```js
  const store = new Vuex.Store({
    // ...
    plugins: [myPlugin]
  });
  ```

- 范例：实现登录状态持久化

  ```js
  export default store => {
    // store初始化的时候，将存储在localStoreage中的状态还原
    if (localStorage) {
      const user = JSON.parse(localStorage.getItem("user"));

      if (user) {
        store.commit("user/login", user.username);
      }
      // 如果用户相关状态发生变化，自动存入localStoreage
      // 订阅所有mutations,store.subscribe()
      store.subscribe((mutation, state) => {
        // {type:'user/login'}
        if (mutation.type === "user/login") {
          const user = JSON.stringify(state.user);
          localStorage.setItem("user", user);
        } else if (mutation.type === "user/logout") {
          localStorage.removeItem("user");
        }
      });
    }
  };
  ```
