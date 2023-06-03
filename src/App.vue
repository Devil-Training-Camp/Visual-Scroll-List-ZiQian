

<template>
  <div>
    <visualScrollList :list="mockData" :item-key="'key'">
      <template #item="{data, key}">
        <div :key="key">{{data}}</div>
      </template>
    </visualScrollList>
  </div>
</template>

<script setup lang="ts">
import visualScrollList from "./components/visual-scroll-list.vue"
const mockData = (function () {
  let ret:unknown[] = []
  let count = 1000
  while(count--) {
    ret.push({
      data: `第${count}数据`,
      key: 'index_'+count
    })
  }
  return ret
})()
</script>