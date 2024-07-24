// eslint-disable-next-line import/prefer-default-export
export function capitalizeFirstLetter(string: string | null): string {
  if (!string){
    return "";
  }
  return string.charAt(0).toUpperCase() + string.slice(1);
}
