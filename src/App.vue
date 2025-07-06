<template>
  <div id="app">
    <Header />
    <router-view />
  </div>
</template>

<script>
import Header from './components/Header.vue';

export default {
  components: {Header}
};
</script>

<style>
body {
  margin: 0;
  font-family: sans-serif;
  background: #f8f8f8;
}
</style>
