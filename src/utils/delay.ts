export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));

export const randomDelay = (min: number = 1000, max: number = 3000): Promise<void> => {
    const time = Math.floor(Math.random() * (max - min + 1)) + min;
    return delay(time).then(() => {});
  };
  
