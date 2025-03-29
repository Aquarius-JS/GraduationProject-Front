const initialState = {
  urlParams: {},
  userInfo: {},
  announcementId: '',
  announcementInfo: {},
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

const UPDATE_ANNOUNCEMENTINFO = (state, payload) => {
  return {
    ...state,
    announcementInfo: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_ANNOUNCEMENTINFO,
};
