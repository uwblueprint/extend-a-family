// eslint-disable-next-line import/prefer-default-export
export function capitalizeFirstLetter(string: string | null): string {
  if (!string) {
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export function padNumber(num: number) {
  if (num > 9) {
    return num;
  }
  return `0${num}`;
}

export function isCaseInsensitiveSubstring(
  str: string,
  substr: string,
): boolean {
  return (str ?? "").toLowerCase().includes((substr ?? "").toLowerCase());
}
