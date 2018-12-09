const initialState = {
  useDarkTheme: false,
  imageQuality: 'original',
  messageLanguage: 'fi',
};

export function settingsReducer(state = initialState, action) {
  switch (action.type) {
    case 'CHANGE_SETTING':
      return {
        ...state,
        [action.payload.key]: action.payload.value,
      };
    default:
      return state;
  }
}
