<template>
  <div
    class="scroll-container"
    :style="{ height, width }"
    ref="scrollContainerRef"
  >
    <div class="phantomContent" :style="{ height: wrapperHeight + 'px' }">
      <div
        class="scroll-wrapper"
        :style="{
          height: wrapperHeight + 'px',
          transform: wrapperScrollTransform,
        }"
        ref="scrollWrapperRef"
      >
        <div v-for="(item, index) in list" :key="item[itemKey]">
          <slot name="item" v-bind="{ item, index }"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType, computed, nextTick, onMounted, onUnmounted, ref } from "vue";
// const emit = defineEmits(["scroll-end"]);
const props = defineProps({
  list: {
    type: Array as PropType<any[]>,
    required: true,
  },
  itemKey: {
    type: String,
    required: true,
  },
  height: {
    type: String,
    default: "100%",
  },
  width: {
    type: String,
    default: "100%",
  },
  isGetting: {
    type: Boolean,
    default: false,
  },
  bufferSize: {
    type: Number,
    default: 28,
  },
});

const rowHeight = ref(0);
const scrollTop = ref(0);
const startIndex = ref(0);
const endIndex = ref(1);
const viewCount = ref(1);
const scrollContainerRef = ref<HTMLDivElement>();
const scrollWrapperRef = ref<HTMLDivElement>();
const containerRect = ref<DOMRect>();
const wrapperScrollTransform = computed(() => {
  return `translate3d(0, ${
    scrollTop.value -
    (scrollTop.value % rowHeight.value) -
    Math.min(startIndex.value, props.bufferSize) * rowHeight.value
  }px, 0)`;
});
const list = computed(() => {
  const start = startIndex.value;
  const end = endIndex.value;
  return props.list.slice(start, end);
});
const wrapperHeight = computed(() => {
  return props.list.length * rowHeight.value;
});
onMounted(async () => {
  await nextTick();
  getViewData();
  initScrollEvent();
});
onUnmounted(() => {
  removeScrollEvent();
});
function getViewData() {
  if (!scrollContainerRef.value) return;
  rowHeight.value = getRowHeight();
  containerRect.value = scrollContainerRef.value.getBoundingClientRect();
  viewCount.value = Math.ceil(containerRect.value.height / rowHeight.value);
  console.log(containerRect.value);
  // 第一次渲染的数量
  startIndex.value = 0;
  endIndex.value = viewCount.value + props.bufferSize;
  console.log(viewCount.value);
}
function getRowHeight() {
  const wrapper = scrollWrapperRef.value;
  const children = wrapper?.children[0];
  const rect = children?.getBoundingClientRect();
  return rect?.height || 0;
}

function calcRenderIndex() {
  const total = props.list.length;
  const currentStartIndex = Math.floor(scrollTop.value / rowHeight.value);
  if (currentStartIndex !== startIndex.value) {
    startIndex.value = Math.max(currentStartIndex - props.bufferSize, 0);
    endIndex.value = Math.min(
      currentStartIndex + viewCount.value + props.bufferSize,
      total - 1
    );
  }
  console.log(startIndex.value, endIndex.value);
}
function handleOnScroll() {
  const wrapper = scrollContainerRef.value;
  calcRenderIndex();
  scrollTop.value = wrapper?.scrollTop || 0;
}
function initScrollEvent() {
  const wrapper = scrollContainerRef.value;
  wrapper?.addEventListener("scroll", handleOnScroll);
}
function removeScrollEvent() {
  const wrapper = scrollContainerRef.value;
  wrapper?.removeEventListener("scroll", handleOnScroll);
}
function getTransform() {
  return `translate3d(0, ${
    scrollTop.value -
    (scrollTop.value % rowHeight.value) -
    Math.min(startIndex.value, props.bufferSize) * rowHeight.value
  })`;
}
// function getItemScrollStyle(index: number) {
//   if (rowHeight.value <= 0) return undefined;
//   return {
//     width: "100%",
//     height: rowHeight.value + "px",
//     position: "absolute",
//     left: 0,
//     right: 0,
//     top: (startIndex.value + index) * rowHeight.value + 'px',
//   } as StyleValue;
// }
</script>
<style scoped>
.scroll-wrapper {
  position: relative;
}
.scroll-container {
  overflow-y: auto;
}
</style>
