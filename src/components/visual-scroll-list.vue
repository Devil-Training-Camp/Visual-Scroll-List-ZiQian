<template>
  <div
    class="scroll-container"
    :style="{
      height: height,
      width: width,
      overflow: 'scroll',
    }"
    ref="scrollContainerRef"
  >
    <div
      class="scroll-wrapper"
      ref="scrollWrapperRef"
      :style="{ height: wrapperHeight + 'px' }"
    >
      <div
        class="display-wrapper"
        :style="{
          position: 'absolute',
          top: scrollWrapperHeight,
          left: 0,
        }"
      >
        <slot
          v-for="(item, index) in list"
          name="item"
          v-bind="{ item, index }"
          :key="item[itemKey]"
        >
        </slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import {
  PropType,
  Ref,
  computed,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
} from "vue";
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
  isGetting: {
    type: Boolean,
    default: false,
  },
});
let scrollTop = ref(0);
let renderStart = ref(0);
let renderEnd = ref(1);
let childrenRect: Ref<DOMRect | undefined> = ref();
let boxRect: Ref<DOMRect | undefined> = ref();
let wrapperHeight = ref(0);
const scrollWrapperRef = ref<HTMLDivElement>();
const scrollContainerRef = ref<HTMLDivElement>();
const list = computed(() => {
  const start = renderStart.value;
  const end = renderEnd.value;
  return props.list?.slice(start, end + 1);
});
const scrollWrapperHeight = computed(() => {
  return scrollTop.value + "px";
});
onMounted(() => {
  singleRect();
  initScrollEvent();
});
async function singleRect() {
  if (!scrollWrapperRef.value || !scrollContainerRef.value) return;
  await nextTick();
  const wrapperEle = scrollWrapperRef.value;
  boxRect.value = scrollContainerRef.value.getBoundingClientRect();
  const element = wrapperEle.children[renderStart.value];
  childrenRect.value = element.getBoundingClientRect();
  wrapperHeight.value = childrenRect.value.height * props.list?.length;
  handleOnScroll();
  calcRenderCount();
}
function calcRenderCount() {
  const scrollHeight = parseInt(scrollTop.value + "");
  const boxRefVal = boxRect.value;
  const childrenRefVal = childrenRect.value;
  if (!boxRefVal || !childrenRefVal) return;

  const renderCount = Math.ceil(
    Number(boxRefVal.height) / childrenRefVal.height
  );
  renderStart.value = Math.floor(scrollHeight / childrenRefVal.height);
  renderEnd.value = renderStart.value + renderCount;
  if (renderEnd.value >= props.list.length) {
    scrollEnd();
  }
}
function initScrollEvent() {
  if (!scrollWrapperRef.value || !scrollContainerRef.value) return;
  const boxEle = scrollContainerRef.value;
  boxEle.addEventListener("scroll", handleOnScroll);
}

function handleOnScroll() {
  if (!scrollWrapperRef.value || !scrollContainerRef.value) return;
  const boxEle = scrollContainerRef.value;
  // console.log(boxEle);
  if (props.isGetting) return;
  scrollTop.value = boxEle.scrollTop;
  calcRenderCount();
}
function removeEvent() {
  if (!scrollWrapperRef.value || !scrollContainerRef.value) return;
  const boxEle = scrollContainerRef.value;
  boxEle.removeEventListener("scroll", handleOnScroll);
}
function scrollEnd() {
  emit("scroll-end");
}
onUnmounted(() => {
  removeEvent();
});
</script>
<style scoped>
.scroll-wrapper {
  position: relative;
}
</style>
