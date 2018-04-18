
export const collectData = (collect) => ({
  type: 'COLLECT_DATA',
  value: collect
});

export const setActivity = (activity) => ({
  type: 'SET_ACTIVITY',
  value: activity
});

export const incrementId = () => ({
  type: 'INCREMENT_ID',
});