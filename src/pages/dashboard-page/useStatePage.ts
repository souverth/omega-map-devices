import type { SelectProps } from "antd/es/select";
import { create } from "zustand";
import type { IFilter, TMapProps } from "./data";

const initState: IState = {
  filter: {
    Keyword: "",
    State: 0,
  },
  isLoading: true,
  data: [],
  dataFiltered: [],
  stateOptions: [],
  selectedInfo: null,
};

const usePageState = create<IState & IAction>((set, get) => {
  return {
    ...initState,
    setIsLoading: isLoading => set({ isLoading: isLoading }),
    setData: data => set({ data: data }),
    setDataFiltered: dataFiltered => set({ dataFiltered: dataFiltered }),
    setSelectedInfo: selectedInfo => set({ selectedInfo: selectedInfo }),
    setStateOptions: stateOptions => set({ stateOptions: stateOptions }),
    setFilter: filter => set({ filter: filter }),
    refresh: () => {
       const newFilter = { ...get().filter }
      set({ filter: newFilter })
    },
    resetState: () => set(initState),
  };
});

export default usePageState;

interface IAction {
  setIsLoading: (isLoading: boolean) => void;
  setData: (data: TMapProps[]) => void;
  setDataFiltered: (dataFiltered: TMapProps[]) => void;
  setSelectedInfo: (selectedInfo: TMapProps) => void
  setStateOptions: (stateOptions: SelectProps["options"]) => void;
  setFilter: (filter: IFilter) => void;
  refresh: () => void;
  resetState: () => void;
}

interface IState {
  isLoading: boolean
  data: TMapProps[]
  dataFiltered: TMapProps[]
  selectedInfo: TMapProps | null
  stateOptions: SelectProps["options"]
  filter: IFilter
}

