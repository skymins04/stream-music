import { toasts } from "svelte-toasts";

export const successToast = (msg: string) => {
  const toast = toasts.add({
    title: "Success",
    description: msg,
    duration: 3000,
    placement: "top-right",
    type: "success",
    theme: "light",
    showProgress: true,
    onClick: () => {},
    onRemove: () => {},
  });
};

export const infoToast = (msg: string) => {
  const toast = toasts.add({
    title: "Info",
    description: msg,
    duration: 3000,
    placement: "top-right",
    type: "info",
    theme: "light",
    showProgress: true,
    onClick: () => {},
    onRemove: () => {},
  });
};

export const errorToast = (msg: string) => {
  const toast = toasts.add({
    title: "Error",
    description: msg,
    duration: 3000,
    placement: "top-right",
    type: "error",
    theme: "light",
    showProgress: true,
    onClick: () => {},
    onRemove: () => {},
  });
};
