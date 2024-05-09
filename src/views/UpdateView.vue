<template>
  <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">
      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">
        <h3>更新检查</h3>
        <h1 class="display-4 fw-bold lh-1 text-body-emphasis">{{ updatestate }}</h1>
        <h3>设备状态：{{statex}}</h3>
        <h3>当前固件版本：{{versionFormat}}</h3>
        <h3>最新固件版本：</h3>
        <p class="lead">更新日志：</p>
        <p class="lead">{{ updatelog }}</p>
        <div class="d-grid gap-2 d-md-flex justify-content-md-start mb-4 mb-lg-3">
          <button :disabled="isCounting" @click="updatebt" type="button" class="btn btn-primary btn-lg px-4 me-md-2">{{textbt}}</button>
          <button @click="nexttime" type="button" class="btn btn-outline-secondary btn-lg px-4">下次再说</button>

        </div>
      </div>
      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
        <!--
                <img src="pic/flowerpot.png" width="400"style="border-radius:10px;" >
                -->
      </div>
    </div>
  </div>
</template>
<script setup>
document.title="更新检查"
import {onMounted, ref} from 'vue';
import mqtt from 'mqtt';
import { useRoute } from 'vue-router';
import router from "@/router/index.js";
const route = useRoute();
const inputValue = ref(route.query.inputValue);
const id = ref(inputValue.value.match(/fp(\d+)/)[1]);
const splitValuess = ref(null);
let mqttMessages = ref([]);
let mqttClient = null;
let statex = ref("离线");
let versionFormat = null;
let updatelog = "暂无更新！";
let textbt="暂无更新";
let newdata= null;
let updatestate="未发现新版本";
onMounted(() => {
  subscribeToMessages(); // 在页面加载后立即订阅消息
});
const subscribeToMessages = () => {
  mqttClient = mqtt.connect('wss://wss', {
    clientId: 'clientId'
  });

  mqttClient.on('connect', () => {
    console.log('已连接到 MQTT 代理');
    mqttClient.subscribe('Flowerpot');
  });

  mqttClient.on('message', (topic, message) => {
    const messageString = message.toString();
    const firstIndex = messageString.indexOf('#');
    const secondIndex = messageString.indexOf('#', firstIndex + 1);

    if (
        firstIndex !== -1 &&
        secondIndex !== -1 &&
        messageString.substring(firstIndex + 3, secondIndex) === id.value
    ) {

      statex.value = "在线";

      const splitValues = messageString.split('#');
      splitValuess.value = splitValues[8].toString();
      // 将xyz字符串拆分为单独的数字
      let x = splitValues[8].charAt(0);
      let y =splitValues[8].charAt(1);
      let z = splitValues[8].charAt(2);

// 构建Vx.y.z格式的字符串
      let result = `V${x}.${y}.${z}`;

      versionFormat = ref(result);
      if (versionFormat.value != newdata.value) {
        updatestate = "发现新版本";
        textbt="立即更新"
      }

      console.log('分割后的数值:', splitValues);
      console.log('接收到符合条件的消息:', messageString);
      mqttMessages.value.push(messageString);

    }
  });
};
let countdown = ref(60);
const isCounting = ref(false);
const updatebt = () => {

    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&Updata`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
      isCounting.value = true;
      const timer = setInterval(() => {
        if (countdown.value > 0) {
          countdown.value--;

        } else {
          clearInterval(timer);
          isCounting.value = false;

        }
      }, 1000);
      textbt=`固件更新中，请等待${countdown._value}s`;
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }

};
const nexttime = () => {
  router.push({ path: '/control', query: { inputValue: inputValue.value } });
};

</script>