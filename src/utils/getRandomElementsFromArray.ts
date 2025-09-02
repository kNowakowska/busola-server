function getRandomElementsFromArray<T>(arr: T[], count: number): T[] {
  if (arr.length <= count) return arr;

  const copy = [...arr];

  // Fisher-Yates shuffle for the first count elements only
  for (let i = 0; i < copy.length; i++) {
    const j = i + Math.floor(Math.random() * (copy.length - i));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

export default getRandomElementsFromArray;
