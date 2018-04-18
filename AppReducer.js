
const AppReducer = (state, action) => {

  if (!state) {
    state = {
      collectData: false,
      activity: 'walking',
      id: 0
    };
  }

  switch (action.type) {
    case 'COLLECT_DATA':
      return Object.assign({}, state, { collectData: action.value });
    case 'SET_ACTIVITY':
      return Object.assign({}, state, { activity: action.value });
    case 'INCREMENT_ID':
      return Object.assign({}, state, { id: state.id + 1 });
    default:
      return state;
  }
}

export default AppReducer;
