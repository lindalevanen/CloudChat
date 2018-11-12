const initialState = { rehydrationDone: false };

export function appStatusReducer(state = initialState, action) {
  switch (action.type) {
    case 'persist/REHYDRATE':
      return {
        ...state,
        rehydrationDone: true,
      };
    default:
      return state;
  }
}
