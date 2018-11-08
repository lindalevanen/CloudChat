export const changeSetting = (key, value) => ({
  type: 'CHANGE_SETTING',
  payload: {
    key,
    value,
  },
});
