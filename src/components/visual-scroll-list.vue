<script lang="ts">
import { PropType, defineComponent, h } from 'vue';
import { initSlots } from '../core/renderHelper';

export default defineComponent({
  name: "visual-scroll-list",
  inheritAttrs: false,
  props: {
    list: {
      type: Array as PropType<any[]>,
      required: false,
      default: null,
    },
    itemKey: {
      type: [String, Function],
      required: true,
    },
  },
  data() {
    return {
      error: false
    }
  },
  computed: {
    realList() {
      const { list } = this;
      return list
    },
    getKey() {
      const { itemKey } = this;
      if (typeof itemKey === "function") {
        return itemKey;
      }
      return (element: any) => element[itemKey as string];
    }
  },
  render() {
    try {
      this.error = false
      const { $slots, realList, getKey } = this
      const nodes = initSlots($slots, realList, getKey)
      console.log(nodes)
      return h('div', {}, nodes)
    } catch (err) {
      return h("pre", { style: {color: 'red'}}, (err as Error).stack)
    }
  }
});
</script>
