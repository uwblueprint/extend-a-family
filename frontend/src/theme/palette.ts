export type Color = `#${string}`;

export type Palette = Record<number | string, string>;

// Defined in Figma Design Document
export const learner: Palette = {
  0: "#000000",
  10: "#001F25",
  20: "#00363F",
  30: "#004E5A",
  40: "#006877",
  50: "#008395",
  60: "#289EB2",
  70: "#4DB9CE",
  80: "#6CD5EA",
  90: "#A4EEFF",
  95: "#D5F7FF",
  98: "#F5FAFC",
  99: "#F7FDFF",
  100: "#FFFFFF",
  light: "#F5FDFF",
  default: "#006877",
};

export const administrator: Palette = {
  0: "#000000",
  10: "#380D00",
  20: "#5B1A00",
  30: "#812900",
  40: "#A93800",
  50: "#CB4F1C",
  60: "#EE6835",
  70: "#F78C61",
  80: "#FAB59A",
  90: "#FCDCCF",
  95: "#FDEDE8",
  98: "#FFDBCF80",
  99: "#FFF7F5",
  100: "#FFFFFF",
  light: "#FFDBCF",
  default: "#8F4C34",
};

export const facilitator: Palette = {
  0: "#000000",
  10: "#030667",
  20: "#1F257A",
  30: "#373D91",
  40: "#4F56AB",
  50: "#696FC6",
  60: "#8289E2",
  70: "#9DA4FE",
  80: "#BEC2FF",
  90: "#E0E0FF",
  95: "#F1EFFF",
  98: "#E0E0FF80",
  99: "#FFFBFF",
  100: "#FFFFFF",
  light: "#E0E0FF80",
  default: "#555A92",
};

export const error: Palette = {
  0: "#000000",
  10: "#410002",
  20: "#00363F",
  30: "#004E5A",
  40: "#690005",
  50: "#DE3730",
  60: "#FF5449",
  70: "#FF897D",
  80: "#FFB4AB",
  90: "#FFDAD6",
  95: "#FFEDEA",
  99: "#FFFBFF",
  100: "#FFFFFF",
};

export const neutral: Palette = {
  0: "#000000",
  10: "#191C1D",
  20: "#2E3132",
  30: "#444748",
  40: "#5C5F5F",
  50: "#757778",
  60: "#8F9192",
  70: "#AAABAC",
  80: "#C5C7C7",
  90: "#E1E3E3",
  95: "#F0F1F1",
  99: "#F7FDFF",
  100: "#FFFFFF",
};

export const neutralVariant: Palette = {
  0: "#000000",
  10: "#151D1F",
  20: "#2A3234",
  30: "#40484A",
  40: "#586062",
  50: "#71787A",
  60: "#8A9294",
  70: "#A5ACAF",
  80: "#C0C8CA",
  90: "#DCE4E6",
  95: "#EAF2F4",
  99: "#F7FDFF",
  100: "#FFFFFF",
};
