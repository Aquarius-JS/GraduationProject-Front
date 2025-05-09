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

const UPDATE_ANNOUNCEMENTTITLE = (state, payload) => {
  return {
    ...state,
    announcementInfo: {
      ...state.announcementInfo,
      title: payload,
    },
  };
};

const UPDATE_ANNOUNCEMENTCONTENT = (state, payload) => {
  return {
    ...state,
    announcementInfo: {
      ...state.announcementInfo,
      content: payload,
    },
  };
};

const UPDATE_ANNOUNCEMENTATTACHEDFILE = (state, payload) => {
  return {
    ...state,
    announcementInfo: {
      ...state.announcementInfo,
      attached_file_list_info: payload,
    },
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_ANNOUNCEMENTINFO,
  UPDATE_ANNOUNCEMENTTITLE,
  UPDATE_ANNOUNCEMENTCONTENT,
  UPDATE_ANNOUNCEMENTATTACHEDFILE,
};
