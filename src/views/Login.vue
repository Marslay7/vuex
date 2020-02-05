<template>
  <div>
    <h1>登录页面</h1>
    <button @click="login" v-if="!$store.state.isLogin">登录</button>
    <button @click="logout" v-else>注销</button>
  </div>
</template>

<script>
import { mapState, mapActions } from "vuex";

export default {
  name: "login",
  methods: {
    login() {
      // 提交mutation变更状态
      // this.$store.commit("user/login");

      /**
       * 派发动作，触发actions
       * 这里的login是actions里面的
       */
      // this.$store
      //   .dispatch("user/login", "admin")
      //   .then(() => {
      //     const redirect = this.$route.query.redirect || "/";
      //     this.$router.push(redirect);
      //   })
      //   .catch(() => {
      //     console.log("用户名或密码错误，请重试！");
      //   });
      this["user/login"]("admin")
        .then(() => {
          const redirect = this.$route.query.redirect || "/";
          this.$router.push(redirect);
        })
        .catch(() => {
          console.log("用户名或密码错误，请重试！");
        });
    },
    logout() {
      this.$store.commit("user/logout");
      this.$router.push("/");
    },
    ...mapActions(["user/login", "user/logout"])
  },
  computed: {
    // isLogin() {
    //   return this.$store.state.user.isLogin;
    // }
    /**
     * 如果在根模块中
     * 使用es6的...展开运算符，获取key,value形式
     */
    ...mapState("user", ["isLogin"])
  }
};
</script>

<style></style>
