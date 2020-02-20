<template>
  <div class="login">
    <form v-if="state.token === null">
      <input v-model="email" placeholder="Email" />
      <input v-model="password" type="password" placeholder="Password" />
      <button v-on:click="submit" class="urnicus-button inverse">Login</button>
    </form>
    <div class="urnicus-raining" v-if="state.token !== null">
      <button
        v-on:click="getWeather"
        v-if="state.token != null"
        class="urnicus-button inverse"
      >
        Open my window
      </button>
      <div class="urnicus-raining-description information">
        <div v-if="raining_status.raining == undefined">
          My window is locked!  Can you open it and I'll check if it is raining?
        </div>
        <div v-if="raining_status.raining == true">
          Yes! It is raining.
        </div>
        <div v-if="raining_status.raining == false">
          Nope. No rain.
        </div>
        <div
          v-if="raining_status.raining_status_can_be_refreshed_at != undefined"
          class="urnicus-raining-expires"
        >
          This update will not change until
          {{ raining_status.raining_status_can_be_refreshed_at }}
        </div>
      </div>
      <button
        v-on:click="logout"
        v-if="state.token != null"
        class="urnicus-button inverse"
      >
        Logout
      </button>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      email: "hllam@yahoo.com",
      password: "password",
      raining_status: {}
    };
  },
  props: {
    state: Object
  },
  methods: {
    submit(event) {
      const vueComponent = this;
      event.preventDefault();
      const xhr = new XMLHttpRequest();
      xhr.open("POST", "/api/v1/user_token");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.onload = function() {
        if (xhr.status === 201) {
          const responseToken = JSON.parse(xhr.responseText);
          localStorage.setItem("token", responseToken?.jwt);
          vueComponent.$emit("eventname");
        }
      };
      xhr.send(
        JSON.stringify({
          auth: {
            email: this.email,
            password: this.password
          }
        })
      );
    },
    logout() {
      localStorage.removeItem("token");
      this.$emit("eventname");
      this.raining_status = {};
    },
    getWeather() {
      this.raining_status = {};
      const vueComponent = this;
      const xhr = new XMLHttpRequest();
      xhr.open("GET", "/api/v1/raining");
      xhr.setRequestHeader("Content-Type", "application/json");
      xhr.setRequestHeader(
        "Authorization",
        `Bearer ${vueComponent.state.token}`
      );
      xhr.onload = function() {
        if (xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          vueComponent.raining_status = response;
        }
      };
      xhr.send();
    }
  }
};
</script>

<style scoped>
.login {
  width: 50%;
  margin-left: auto;
  margin-right: auto;
}
</style>
