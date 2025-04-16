const initialState = {
  urlParams: {},
  searchValue: '',
  searchResults: [],
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

const UPDATE_SEARCHVALUE = (state, payload) => {
  return {
    ...state,
    searchValue: payload,
  };
};

const UPDATE_SEARCHRESULTS = (state, payload) => {
  return {
    ...state,
    searchResults: payload,
  };
};

export default {
  initialState,
  UPDATE_STATE,
  UPDATE_URLPARAMS,
  UPDATE_SEARCHVALUE,
  UPDATE_SEARCHRESULTS,
};
