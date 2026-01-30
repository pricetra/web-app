export type Ad = number;

export function adify<T>(arr: T[], pad: number = 5): (T | Ad)[] {
  const adifiedArr = new Array<T | Ad>();
  for (let i = 0; i < arr.length; i++) {
    if (i === 0 || i % pad !== 0) {
      adifiedArr.push(arr[i]);
      continue;
    }
    adifiedArr.push(i);
  }
  return adifiedArr;
}
