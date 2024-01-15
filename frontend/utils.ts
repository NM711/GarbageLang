export function isNumber(key: string): boolean {
  return /[0-9.]/g.test(key)
};

export function isAlphabet(char: string): boolean {
  if (!char) return false;
  return /^[A-Za-z]+$/.test(char);
};