<template>
  <title>万物互联IOT在线控制中心</title>
  <div class="container col-xxl-8 px-4 py-5">
    <div class="row flex-lg-row-reverse align-items-center g-5 py-5">
      <div class="col-10 col-sm-8 col-lg-6">
        <img src="../img/flowerpot.png" class="d-block mx-lg-auto img-fluid" alt="Bootstrap Themes" width="700" height="500" loading="lazy">
      </div>
      <div class="col-lg-6">
        <h1 class="display-5 fw-bold text-body-emphasis lh-1 mb-3">万物互联IOT在线控制台</h1>
        <p class="lead">欢迎使用我们的在线控制中心，在此您可以控制您的物联网设备</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start">
          <input v-model="inputValue" type="search" class="form-control" placeholder="点击此处输入设备ID..." aria-label="Search">
          <button @click="handleButtonClick" type="button" class="btn btn-primary btn-lg px-4 me-md-2">进入</button>
          <button @click="about" type="button" class="btn btn-outline-secondary btn-lg px-4">帮助</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
document.title="万物互联IOT在线控制台"
import { useRouter } from 'vue-router';
import { ref } from 'vue';

const router = useRouter();
const inputValue = ref('');

const handleButtonClick = () => {
  if (inputValue.value.toLowerCase().includes('fp')) {
    router.push({ path: '/control', query: { inputValue: inputValue.value } });
  }
};
const about = () => {
  router.push({ path: '/about' });
}
</script>