function cached(fn: Function): Function {
  const cache: {[key: string]: any} = Object.create(null);
  return function cachedFn(str: string): any {
    const hit = cache[str];
    return hit || (cache[str] = fn(str));
  };
}

const regex: RegExp = /-(\w)/g;
const camelize: Function = cached((str: string): string => str.replace(regex, (_, c) => c.toUpperCase()));

export { camelize };

