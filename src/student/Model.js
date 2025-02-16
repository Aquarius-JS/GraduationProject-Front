const initialState = {
  foo: 0,
};

const ADD_FOO = state => {
  return {
    ...state,
    foo: state.foo + 1,
  };
};

const UPDATE_FOO = (state, foo) => {
  return {
    ...state,
    foo,
  };
};

export default {
  initialState,
  ADD_FOO,
  UPDATE_FOO,
};
