export type Ad = number;

function getRandomOffset(jitter: number) {
  return Math.floor(Math.random() * (jitter * 2 + 1)) - jitter;
}

export function adify<T>(
  arr: T[],
  pad: number = 5,
  jitter: number = 1,
): (T | Ad)[] {
  const result: (T | Ad)[] = [];

  let nextAdAt = pad + getRandomOffset(jitter);
  let counter = 0;

  for (let i = 0; i < arr.length; i++) {
    result.push(arr[i]);
    counter++;

    if (counter === nextAdAt) {
      result.push(i);

      counter = 0;
      nextAdAt = pad + getRandomOffset(jitter);
    }
  }

  return result;
}
