<template>
  <div class="loader"></div>
</template>

<script lang="ts">
import { defineComponent } from "@vue/composition-api";

export default defineComponent({
  name: "Spinner"
});
</script>

<style lang="postcss">
.loader,
.loader:after {
  border-radius: 50%;
  width: 8em;
  height: 8em;
}
.loader {
  margin: 60px auto;
  font-size: 10px;
  position: relative;
  text-indent: -9999em;
  border-top: 1.1em solid rgba(0, 119, 255, 0.2);
  border-right: 1.1em solid rgba(0, 119, 255, 0.2);
  border-bottom: 1.1em solid rgba(0, 119, 255, 0.2);
  border-left: 1.1em solid #1b5fdd;
  -webkit-transform: translateZ(0);
  -ms-transform: translateZ(0);
  transform: translateZ(0);
  -webkit-animation: load8 1.1s infinite linear;
  animation: load8 1.1s infinite linear;
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
</style>
