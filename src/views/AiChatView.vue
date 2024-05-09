
<template>
  <div class="container">
    <header class="d-flex flex-wrap justify-content-center py-3 mb-4 border-bottom">
      <a href="index.html" class="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-body-emphasis text-decoration-none">
        <img src="../img/flowerpot.png" style="border-radius:10px;"class="bi me-2" width="40" height="40">
        <span class="fs-4">AI Chat</span>
      </a>

    </header>
  </div>
  <div class="container">
    <h4>You :</h4>
    <h6>{{ searchQuery }}</h6>
  <br><br><br>
    <h4>AIChat :</h4>
    <h6>{{ response }}</h6>
  </div>
  <footer class="footer bg-light fixed-bottom">
    <div class="container">
      <div class="row align-items-center">
        <div class="col-md-8">

          <div style="display: flex; justify-content: center;">
            <p>模型选择：</p>
            <input  style="margin-left: 3px;" type="radio" id="model1" v-model="model" value="0.5b">
            <label for="model1">0.5B快速(推荐)</label>
            <!--
          <input style="margin-left: 3px;" type="radio" id="model2" v-model="model" value="qwen:1.8b">
          <label for="model2">Qwen1.8B中等</label>
          <input style="margin-left: 3px;" type="radio" id="model3" v-model="model" value="gemma:2b">
          <label for="model3">Gemma:2B慢速</label>
          -->
          </div>
          <input type="text" class="form-control" placeholder="来与我聊天吧..." v-model="searchQuery">

        </div>
        <div class="col-md-4">
          <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
            <button style="margin-top: 10px" @click="sendPostRequest" class="btn btn-primary btn-lg px-4 me-md-2 fw-bold">发送</button>
            <button @click="about" type="button" class="btn btn-outline-secondary btn-lg px-4">帮助</button>
          </div>
        </div>
      </div>
    </div>
  </footer>


</template>

<script setup>
document.title="Flowerpot AI"
import { ref } from 'vue';
import axios from 'axios';
import router from "@/router/index.js";

let chattext=null;
let ai=null;
const responseData= ref('');
const model = ref('');
const response = ref('');
const searchQuery = ref('');
const sendPostRequest = async () => {
  response.value = "已发送交互请求，请等待模型推演运算完成...";
  responseData.value = searchQuery.value
  const data = {
    model: 'qwen:' + model.value,
    messages: [
      {
        "role": "system",
        "content": "你是来自YANG的超大规模语言模型，你叫YANGAI。You are YANGAI, a large language model trained by YANG."
      },
      {
        "role": "user",
        "content": "你叫什么、你的名字、介绍、介绍自己、介绍一下、你爸是谁、谁开发的、你是谁、你谁、你谁啊、你来自哪里、who are you、what you name、name、from、where you from"
      },
      {
        "role": "assistant",
        "content": "我是来自YANG的超大规模语言模型，我叫YANGAI。a large language model created by YANG,name is YANGAI"
      },
      {
        "role": "user",
        "content": searchQuery.value
      }
    ],
    stream: false
  };

  try {
    const res = await axios.post('url', data);
    const dataObject = res.data;
    response.value = dataObject.message.content;

    searchQuery.value = '';
  } catch (error) {
    response.value = "请求错误:" + error;
    searchQuery.value = '';
  }
};
const BACK = () => {
  router.push({ path: '/control', query: { inputValue: inputValue.value } });
}
</script>
