export type PresentableError = {
  title?: (...data: string[]) => string;
  text: (...data: string[]) => string;
};
