const initialState = {
  urlParams: {},
  userInfo: {},
  vehicleInfo: [],
  violationInfoList: [],
  announcementBasicInfo: [],
  violationInfoModalData: {
    isModalOpen: false,
    violationInfoId: '',
  },
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

const UPDATE_VIOLATIONINFOLIST = (state, payload) => {
  return {
    ...state,
    violationInfoList: payload,
  };
};

const UPDATE_ANNOUNCEMENTBASICINFO = (state, payload) => {
  return {
    ...state,
    announcementBasicInfo: payload,
  };
};

const UPDATE_VIOLATIONINFOMODALDATA = (state, payload) => {
  return {
    ...state,
    violationInfoModalData: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_USERINFO,
  UPDATE_VEHICLEINFO,
  UPDATE_VIOLATIONINFOLIST,
  UPDATE_ANNOUNCEMENTBASICINFO,
  UPDATE_VIOLATIONINFOMODALDATA,
};
