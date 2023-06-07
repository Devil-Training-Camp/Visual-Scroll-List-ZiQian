<template>
  <div
    class="scroll-container"
    :style="{ height, width }"
    ref="scrollContainerRef"
  >
    <div
      class="phantomContent"
      :style="{ position: 'relative', height: phantomContentHeight + 'px' }"
    >
      <div
        class="scroll-wrapper"
        :style="{
          position: 'absolute',
          height: wrapperHeight + 'px',
          transform: wrapperScrollTransform,
        }"
        ref="scrollWrapperRef"
      >
        <div
          v-for="(item, index) in list"
          :key="item[itemKey]"
          :id="'item-' + (startIndex + index)"
        >
          <slot name="item" v-bind="{ item, index }"> </slot>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType, computed, nextTick, onMounted, onUnmounted, ref } from "vue";
import { throttle, binarySearch, CompareResult } from "../util";
const emit = defineEmits(["scroll-end"]);
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
  estimateHeight: {
    type: Number,
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
type HeightCache = {
  index: number;
  height: number;
  top: number;
  bottom: number;
  dValue: number;
};
const rowHeight = ref(0);
const scrollTop = ref(0);
const startIndex = ref(0);
const endIndex = ref(1);
const viewCount = ref(1);
const scrollContainerRef = ref<HTMLDivElement>();
const scrollWrapperRef = ref<HTMLDivElement>();
const containerRect = ref<DOMRect>();
const heightCahce = ref<HeightCache[]>([]);
const wrapperScrollTransform = computed(() => {
  // 滑动高度 - 当前被截断 - 缓冲区
  return `translate3d(0, ${startIndex.value >= 1 ? heightCahce.value[startIndex.value]?.bottom : 0}px, 1px)`;
});
const list = computed(() => {
  const start = startIndex.value;
  const end = endIndex.value;
  return props.list.slice(start, end);
});
const wrapperHeight = computed(() => {
  return list.value.length * rowHeight.value;
});
const phantomContentHeight = computed(() => {
  const len = props.list.length;
  if (heightCahce.value.length) return heightCahce.value[len - 1].bottom;
  return len * rowHeight.value;
});
onMounted(async () => {
  await nextTick();
  getViewData();
  initScrollEvent();
  nextTick(() => {
    initCacheHeight();
    updateHeightCache();
  });
});
onUnmounted(() => {
  removeScrollEvent();
});
function getViewData() {
  if (!scrollContainerRef.value) return;
  // 如果传入了对元素的预估高度，则直接使用此高度不进行计算
  rowHeight.value = props.estimateHeight
    ? props.estimateHeight
    : getRowHeight();
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
  const currentStartIndex = getStartIndex(scrollTop.value);
  if (currentStartIndex !== startIndex.value) {
    startIndex.value = Math.max(currentStartIndex - props.bufferSize, 0);
    endIndex.value = Math.min(
      currentStartIndex + viewCount.value + props.bufferSize,
      total - 1
    );
    if(endIndex.value >= total -1) {
      scolleEnd()
    }
  }
  console.log(startIndex.value, endIndex.value);
}
function handleOnScroll() {
  const wrapper = scrollContainerRef.value;
  calcRenderIndex();
  scrollTop.value = wrapper?.scrollTop || 0;
  nextTick(() => {
    tupdateHeightCache();
  });
}
function initScrollEvent() {
  const wrapper = scrollContainerRef.value;
  wrapper?.addEventListener("scroll", handleOnScroll);
}
function removeScrollEvent() {
  const wrapper = scrollContainerRef.value;
  wrapper?.removeEventListener("scroll", handleOnScroll);
}
function initCacheHeight() {
  const estimateHeight = rowHeight.value;
  for (let i = 0; i < props.list.length; ++i) {
    heightCahce.value[i] = {
      index: i,
      height: estimateHeight,
      top: i * estimateHeight,
      bottom: (i + 1) * estimateHeight,
      dValue: 0,
    };
  }
}
const tupdateHeightCache = throttle(updateHeightCache, 100);
function updateHeightCache() {
  const wrapper = scrollWrapperRef.value;
  if (!wrapper) return;
  const childrens = Array.from(wrapper.children);
  const heightCacheVal = heightCahce.value;
  const start = childrens[0];
  childrens.forEach((node) => {
    if (!node) return;
    const rect = node.getBoundingClientRect();
    const { height } = rect;
    const index = Number(node.id.split("-")[1]);
    const oldHeight = heightCacheVal[index].height;
    const dValue = oldHeight - height;

    if (dValue) {
      heightCacheVal[index].bottom -= dValue;
      heightCacheVal[index].height = height;
      heightCacheVal[index].dValue = dValue;
    }
  });
  let startIdx = 0;
  if (start) {
    startIdx = Number(start.id.split("-")[1]);
  }
  const cacheLen = heightCacheVal.length;
  let cumulativeDiffHeight = heightCacheVal[startIdx].dValue;
  heightCacheVal[startIdx].dValue = 0;
  for (let i = startIdx + 1; i < cacheLen; ++i) {
    const item = heightCacheVal[i];
    heightCacheVal[i].top = heightCacheVal[i - 1].bottom;
    heightCacheVal[i].bottom = heightCacheVal[i].bottom - cumulativeDiffHeight;
    if (item.dValue !== 0) {
      cumulativeDiffHeight += item.dValue;
      item.dValue = 0;
    }
  }
  console.log("update", heightCacheVal);
}
function getStartIndex(st = 0) {
  let idx = binarySearch<HeightCache, number>(
    heightCahce.value,
    st,
    (currentValue, targetValue) => {
      const currentCompareValue = currentValue.bottom;
      if (currentCompareValue === targetValue) {
        return CompareResult.eq;
      } else if (currentCompareValue < targetValue) {
        return CompareResult.lt;
      }
      return CompareResult.gt;
    }
  );
  const targetItem = heightCahce.value[idx];
  if (targetItem.bottom < st) {
    idx += 1;
  }
  return idx;
}
const scolleEnd = throttle(()=>{
  emit('scroll-end')
}, 100)
// function getTransform() {
//   return `translate3d(0, ${
//     scrollTop.value -
//     (scrollTop.value % rowHeight.value) -
//     Math.min(startIndex.value, props.bufferSize) * rowHeight.value
//   })`;
// }
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
