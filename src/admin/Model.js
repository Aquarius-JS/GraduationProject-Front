const initialState = {
  urlParams: {},
  userInfo: {},
  registerInfo: [],
  announcementBasicInfo: [],
  monitoringEquipment: [],
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

const UPDATE_ANNOUNCEMENTBASICINFO = (state, payload) => {
  return {
    ...state,
    announcementBasicInfo: payload,
  };
};

const UPDATE_MONITORINGEQUIPMENT = (state, payload) => {
  return {
    ...state,
    monitoringEquipment: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_REGISTERINFO,
  UPDATE_ANNOUNCEMENTBASICINFO,
  UPDATE_MONITORINGEQUIPMENT,
};
