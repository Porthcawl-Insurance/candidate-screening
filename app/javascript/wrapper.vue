<template>
  <div class="wrapper">
    <Login @eventname="updateState" v-bind:state="state"></Login>
  </div>
</template>

<script>
import Login from "./login.vue";

const state = {
  token: localStorage.getItem("token")
};

export default {
  data() {
    return {
      state
    };
  },
  components: {
    Login
  },
  methods: {
    updateState() {
      this.state = { token: localStorage.getItem("token") };
    }
  }
};
</script>

<style scoped></style>
