import { atom } from "recoil";

export const userState = atom({
  key: "userState",
  default: null,
});

export const currentListState = atom({
  key: "currentList",
  default: "default",
});

export const currentThemeState = atom({
  key: "currentThemeState",
  default: "dark",
});
