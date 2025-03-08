const initialState = {
  urlParams: {},
  userInfo: {},
  vehicleInfo: [],
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

const UPDATE_USERINFO = (state, payload) => {
  return {
    ...state,
    userInfo: payload,
  };
};

const UPDATE_VEHICLEINFO = (state, payload) => {
  return {
    ...state,
    vehicleInfo: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_USERINFO,
  UPDATE_VEHICLEINFO,
};
