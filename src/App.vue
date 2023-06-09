<template>
  <div class="container">
    <visualScrollList  :list="mockData" :item-key="'key'" @scroll-end="handleOnScrollEnd" :isGetting="isGetting">
      <template #item="{ item, index }">
        <div :style="{height: item.height + 'px', background: item.color, width: '100%'}">
          <div :key="index">{{ item.data }}</div>
        </div>
      </template>
    </visualScrollList>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import visualScrollList from "../dist/index";
type Data = { key: string; data: string; msg: string }[]
let mockData:Data;
const isGetting = ref(false)
function genData (len: number) {
  let ret: { key: string; data: string; msg: string, height: number, color: string}[] = [];
  let count = 100 * len;
  while (count--) {
    ret.push({
      data: `第${count}数据`,
      key: "index_" + count,
      msg: count % 2 ? "msg_" + count : '',
      height: 24 + 100 * Math.random(),
      color: '#' + Math.floor(Math.random() * 16777215).toString(16)      
    });
  }
  return ret;
}
mockData = genData(10000)
async function mockGetData(len: number) {
  isGetting.value = true
  return new Promise<Data>((resolve)=>{
    const time = setTimeout(()=>{
      isGetting.value = false
      resolve(genData(len))
      clearTimeout(time)
    }, 3000)
  })
}
async function handleOnScrollEnd() {  
  mockData.push(...await mockGetData(mockData.length))
}
</script>

<style scoped>
.container {
  height: 600px;
  width: 300px;
  background: #000;
}
</style>
