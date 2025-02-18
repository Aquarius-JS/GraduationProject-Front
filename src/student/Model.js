const initialState = {
  urlParams: {},
};

const UPDATE_URLPARAMS = (state, payload) => {
  return {
    ...state,
    urlParams: payload,
  };
};

export default {
  initialState,
  UPDATE_URLPARAMS,
};
