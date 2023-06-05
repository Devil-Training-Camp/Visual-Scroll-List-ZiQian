

<template>
  <div>
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
  let count = 10000 * 100
  while(count--) {
    ret.push({
      data: `第${count}数据`,
      key: 'index_'+count
    })
  }
  return ret
})()
</script>