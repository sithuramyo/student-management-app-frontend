import { create } from 'zustand';

type ErrorStore = {
  showNotFound: boolean;
  notFoundMessage?: string;
  triggerNotFound: (message?: string) => void;
  clearNotFound: () => void;
};

export const useErrorStore = create<ErrorStore>((set) => ({
  showNotFound: false,
  notFoundMessage: '',
  triggerNotFound: (message) =>
    set({ showNotFound: true, notFoundMessage: message }),
  clearNotFound: () =>
    set({ showNotFound: false, notFoundMessage: '' }),
}));
