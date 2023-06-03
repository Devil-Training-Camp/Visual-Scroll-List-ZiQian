import { isHtmlTag, isTransition } from "../util/tags";
import { resolveComponent, TransitionGroup } from "vue";
export function initSlots<T extends { key: string }>($slots: any, realList: Array<T>, getKey: Function) {
    const { item } = $slots
    if(!item) {
        throw new Error("visual scroll list element must have an item slot");
    }
    const normalizedList = realList || [];
    let itemNodes = normalizedList.flatMap((element, index)=>{
        return item({element, index}).map((node:any) => {
            node.key = getKey(element)
            node.props = {
                ...(node.props || {}),
                'data-visual': true,
            }
            return node
        })
    })
    return {
        default: itemNodes
    }
}

function getRootInformation(tag) {
    const transition = isTransition(tag);
    const externalComponent = !isHtmlTag(tag) && !transition;
    return {
      transition,
      externalComponent,
      tag: externalComponent
        ? resolveComponent(tag)
        : transition
        ? TransitionGroup
        : tag
    };
  }