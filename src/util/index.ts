export function throttle(fn: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return () => {
        let args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn(...args);
        }, wait);
    };
}
export enum CompareResult {
    eq = 1,
    lt,
    gt,
}
export function binarySearch<T, VT>(list: T[], value: VT, compareFunc: (current: T, value: VT) => CompareResult) {
    let start = 0;
    let end = list.length - 1;
    let tempIndex = null;

    while (start <= end) {
        tempIndex = Math.floor((start + end) / 2);
        const midValue = list[tempIndex];
        const compareRes: CompareResult = compareFunc(midValue, value);

        if (compareRes === CompareResult.eq) {
            return tempIndex;
        }
        if (compareRes === CompareResult.lt) {
            start = tempIndex + 1;
        } else if (compareRes === CompareResult.gt) {
            end = tempIndex - 1;
        }
    }
    return tempIndex as number;
}
