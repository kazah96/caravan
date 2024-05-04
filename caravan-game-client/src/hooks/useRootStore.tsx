import { ReactNode, createContext, useContext } from 'react';

import { RootStore } from '@store/RootStore';

const rootStoreContext = createContext<RootStore | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useRootStore = () => {
  const context = useContext(rootStoreContext);
  if (context) {
    return context;
  }
  throw Error('Root store is not provided!');
};

const rootStore = new RootStore();

type RootStoreProviderProps = {
  children: ReactNode;
  store?: RootStore;
};

export function RootStoreProvider({ children, store = rootStore }: RootStoreProviderProps) {
  return <rootStoreContext.Provider value={store}>{children}</rootStoreContext.Provider>;
}
