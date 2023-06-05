<template>
  <div class="scroll-container">
    <div class="scroll-wraper">
      <slot v-for="(item, index) in list" name="item" v-bind="{ item, index }">
      </slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType } from "vue";

const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
  },
});
</script>
