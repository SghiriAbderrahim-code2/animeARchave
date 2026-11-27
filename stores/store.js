import { create } from 'zustand';

export const useSearch = create((set) => ({
  reLoad: 1,
  setReLoad: () => set((state) => ({animeData: [], page: 1, reLoad: state.reLoad + 1 })),
  search: '',
  setSearch: (searchValue) =>
    set({ animeData: [], page: 1, search: searchValue }),
  page: 1,
  setPage: () => set((state) => ({ page: state.page + 1 })),
  reset: () => set({ search: '', page: 1, animeData: [] }),
  sort: 'title',
  setSort: (sortValue) => set({ sort: sortValue }),
  sortDirection: true,
  setSortDirection: () =>
    set((state) => ({
      sortDirection: !state.sortDirection,
    })),
  sortDraft: 'title',
  sortDirectionDraft: true,
  setSortDraft: (v) => set({ sortDraft: v }),
  setSortDirectionDraft: () => set((state) => ({ sortDirectionDraft: !state.sortDirectionDraft })),
  initSortDraft: () => set((state) => ({ sortDraft: state.sort, sortDirectionDraft: state.sortDirection })),
  applySortDraft: () => set((state) => ({ sort: state.sortDraft, sortDirection: state.sortDirectionDraft })),
  cancelSortDraft: () => set((state) => ({ sortDraft: state.sort, sortDirectionDraft: state.sortDirection })),
  animeData: [],
  // يقبل قيمة مباشرة أو دالة تحديث وظيفية: setAnimeData(prev => [...prev, ...newItems])
  setAnimeData: (newData) =>
    set((state) => ({
      animeData:
        typeof newData === 'function' ? newData(state.animeData) : newData,
    })),
  type: '',
  setType: (newValue) => set({ type: newValue }),
  statu: '',
  setStatu: (newValue) => set({  statu: newValue }),
  rating: '',
  setRating: (newValue) => set({  rating: newValue }),
  producers: [],
  setProducer: (newValue) => set({  producers: newValue }),
  genres: [],
  setGenre: (newValue) => set({  genres: newValue }),
}));

export const useShow = create((set) => ({
  sortShow: false,
  setSortShow: (show) => set({ sortShow: show }),
  filterShow: false,
  setFilterShow: (show) => set({ filterShow: show }),
}));
