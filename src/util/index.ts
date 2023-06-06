export function throttle(fn: Function, wait: number) {
    let timeout: ReturnType<typeof setTimeout>;
    return ()=> {
        let args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(function () {
            fn(...args);
        }, wait);
    };
}

