

<template>
  <div class="container">
    <visualScrollList :list="mockData" :item-key="'key'">
      <template #item="{item, index}">
        <div :key="index">{{item.data}}</div>
      </template>
    </visualScrollList>
  </div>
</template>

<script setup lang="ts">
import visualScrollList from "./components/visual-scroll-list.vue"

const mockData = (function () {
  let ret:{key: string, data: string}[] = []
  let count = 10000
  while(count--) {
    ret.push({
      data: `第${count}数据`,
      key: 'index_'+count
    })
  }
  return ret
})()
</script>

<style scoped>
.container {
  height: 600px;
  width: 300px;
  background: #000;
}
</style>