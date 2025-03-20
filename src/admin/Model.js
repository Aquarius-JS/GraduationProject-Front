const initialState = {
  urlParams: {},
  userInfo: {},
  registerInfo: [],
};

const UPDATE_STATE = (state, payload) => {
  return {
    ...state,
    ...payload,
  };
};

const UPDATE_URLPARAMS = (state, payload) => {
  return {
    ...state,
    urlParams: payload,
  };
};

const UPDATE_REGISTERINFO = (state, payload) => {
  return {
    ...state,
    registerInfo: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_REGISTERINFO,
};
