<template>
  <div id="app">
    <div id="nav">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>

      <span v-if="isLogin">
        {{ welcome }}
        <button @click="logout">注销</button>
      </span>
    </div>
    <router-view />
  </div>
</template>
<script>
import { mapState, mapGetters, mapActions } from "vuex";

export default {
  name: "app",
  methods: {
    logout() {
      this.$store.commit("user/logout");
      this.$router.push("/login");
    }
  },
  computed: {
    ...mapState("user", ["isLogin"]),
    ...mapGetters("user", ["welcome"]),
    ...mapActions(["user/logout"])
  }
};
</script>
>
<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

#nav {
  padding: 30px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}

#nav a.router-link-exact-active {
  color: #42b983;
}
</style>
