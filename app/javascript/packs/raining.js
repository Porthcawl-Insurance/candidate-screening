import TurbolinksAdapter from "vue-turbolinks";
import Vue from "vue/dist/vue.esm";
import Wrapper from "../wrapper";

Vue.use(TurbolinksAdapter);
Vue.component("wrapper", Wrapper);

document.addEventListener("turbolinks:load", () => {
  const app = new Vue({
    el: "#vue-application"
  });
});
