<template>


  <div class="container my-5">
    <div class="row p-4 pb-0 pe-lg-0 pt-lg-5 align-items-center rounded-3 border shadow-lg">

      <div class="col-lg-7 p-3 p-lg-5 pt-lg-3">

        <h1 class="display-4 fw-bold lh-1 text-body-emphasis">智能植物培育设备</h1>
        <h3>设备ID：{{ inputValue }}</h3>
        <h3>设备状态：{{ statex }}</h3>
        <h3>固件版本：{{ versionFormat }}</h3>
        <div class="row row-cols-3 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
          <h3 class="fw-bold mb-0 fs-4  white-text">环境湿度：{{ cloudtemp }}%</h3>
          <h3 class="fw-bold mb-0 fs-4  white-text">环境温度：{{ tempx}}°C</h3>
          <h3 class="fw-bold mb-0 fs-4  white-text">土壤湿度：{{ soildtemp }}%</h3>
        </div>
      </div>

      <div class="col-lg-4 offset-lg-1 p-0 overflow-hidden shadow-lg">
        <!--
                <img src="pic/flowerpot.png" width="400"style="border-radius:10px;" >
                -->
      </div>
    </div>
  </div>

  <div class="container px-4 py-5" id="icon-grid">
    <h2 class="pb-2 border-bottom fw-bold">AI引擎</h2>
    <div class="col row-cols-1 d-flex align-items-start">

      <div> <button @click="auto" type="button" id="autobt" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
        <h3 class="fw-bold mb-0 fs-4  white-text">AUTO自动控制</h3>
        <p>开启本功能，将启用AI自动控制模式，由AI模型进行自动化管理</p>

      </button>
      </div>
    </div>
    <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">

      <div class="col d-flex align-items-start">

        <div> <button @click="aichat" type="button" id="aichat" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">AI对话</h3>
          <p>为植物生成交互模型</p>

        </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">

        <div> <button @click="aigrow" type="button" id="aigrow" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">AI生长预测</h3>
          <p>为植物预测生长方向</p>

        </button>
        </div>
      </div>


    </div>
    <h2 class="pb-2 border-bottom fw-bold">控制台</h2>

    <div class="row row-cols-2 row-cols-sm-2 row-cols-md-3 row-cols-lg-4 g-4 py-5">
      <div class="col d-flex align-items-start">



        <div> <button @click="temp" type="button" id="tempbt" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">环境恒温</h3>
          <p>为植物土壤开启恒温模式</p>

        </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">

        <div> <button @click="light" type="button" id="lightbt" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">环境光照</h3>
          <p>将为植物开启光合作用</p>

        </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">

        <div> <button @click="water" type="button" id="waterbt" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">自动浇水</h3>
          <p>土壤湿度不足时自动浇水</p>

        </button>
        </div>
      </div>
      <div class="col d-flex align-items-start">

        <div> <button @click="updateClick" type="button" id="updatebt" class="btn btn-outline-secondary btn-lg px-4 me-md-2 ">
          <h3 class="fw-bold mb-0 fs-4  white-text">更新检查</h3>
          <p>检测花盆版本，固件更新</p>

        </button>
        </div>
      </div>

    </div>
  </div>



</template>
<script setup>
import {onMounted, ref} from 'vue';
import mqtt from 'mqtt';
import { useRoute } from 'vue-router';
import router from "@/router/index.js";
document.title="智能植物培育设备控制中心"
const route = useRoute();
const inputValue = ref(route.query.inputValue);
const id = ref(inputValue.value.match(/fp(\d+)/)[1]);
let tempx=ref(null);
let soildtemp=ref(null);
let cloudtemp=ref(null);
const splitValuess = ref(null);
let mqttMessages = ref([]);
let mqttClient = null;
let statex = ref("离线");
let versionFormat = null;
let autobtstate = null;
let tempbtstate=null;
let waterbtstate=null;
let lightbtstate=null;
onMounted(() => {
  subscribeToMessages(); // 在页面加载后立即订阅消息
});
const subscribeToMessages = () => {
  mqttClient = mqtt.connect('mqtt://mqtt', {
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
      tempx= splitValues[2].toString();
      cloudtemp = splitValues[3].toString();
      soildtemp = splitValues[4].toString();

      if(splitValues[9].toString()!=="0"){
        const button = document.getElementById('autobt');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
        autobtstate=1;
      }else {
        const button = document.getElementById('autobt');
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
        autobtstate=0;
      }
      if(splitValues[6].toString()!=="0"){
        const button = document.getElementById('tempbt');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
        tempbtstate=1;
      }else {
        const button = document.getElementById('tempbt');
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
       tempbtstate=0;
      }  if(splitValues[5].toString()!=="0"){
        const button = document.getElementById('waterbt');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
        waterbtstate=1;
      }else {
        const button = document.getElementById('waterbt');
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
        waterbtstate=0;
      }  if(splitValues[7].toString()!=="0"){
        const button = document.getElementById('lightbt');
        button.classList.remove('btn-outline-secondary');
        button.classList.add('btn-primary');
       lightbtstate=1;
      }else {
        const button = document.getElementById('lightbt');
        button.classList.remove('btn-primary');
        button.classList.add('btn-outline-secondary');
        lightbtstate=0;
      }
      // 将xyz字符串拆分为单独的数字
      let x = splitValues[8].charAt(0);
      let y =splitValues[8].charAt(1);
      let z = splitValues[8].charAt(2);

// 构建Vx.y.z格式的字符串
      let result = `V${x}.${y}.${z}`;

      versionFormat = ref(result);
      console.log('分割后的数值:', splitValues);
      console.log('接收到符合条件的消息:', messageString);
      mqttMessages.value.push(messageString);

    }
  });
};
const auto = () => {
  if(autobtstate==0) {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&ONAUTO`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }else {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&OFFAUTO`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }
};
const temp = () => {
  if(tempbtstate==0) {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&ONHOT`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }else {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&OFFHOT`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }
};
const water = () => {
  if(waterbtstate==0) {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&ONPUMP`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }else {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&OFFPUMP`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }
};
const light = () => {
  if(lightbtstate==0) {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&ONLED`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }else {
    if (mqttClient && mqttClient.connected) {
      let valueToUse = inputValue._value; // 获取 Ref 对象中的值
      let message = `#IDTO${valueToUse.substring(2) }&OFFLED`;
      mqttClient.publish('Flowerpot', message);
      console.log('已发送消息:', message);
    } else {
      console.log('未连接到 MQTT 代理或连接断开。');
    }
  }
};
const changeButtonStyle = () => {
  const button = document.getElementById('myButton');
  button.classList.remove('btn-outline-secondary');
  button.classList.add('btn-primary');
};
const RechangeButtonStyle = () => {
  const button = document.getElementById('myButton');
  button.classList.remove('btn-primary');
  button.classList.add('btn-outline-secondary');

};
const beforeDestroy = () => {
  if (mqttClient) {
    mqttClient.end();
  }
};
const updateClick = () => {
    router.push({ path: '/update', query: { inputValue: inputValue.value } });
};
const aichat = () => {

  router.push({
    path: '/aichat',
    query: {

    }
  });
};
</script>