export const timeToSeconds = (time: string): number => {
  const parts = time.split(':').map(Number).reverse();

  if (parts.some(isNaN)) {
    throw new Error(`Invalid time format: "${time}"`);
  }

  const [seconds = 0, minutes = 0, hours = 0] = parts;

  return hours * 3600 + minutes * 60 + seconds;
}