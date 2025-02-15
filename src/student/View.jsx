'ssr';
import React from 'react';
import { useCtrl, useModel, useModelActions, useModelState } from 'react-imvc/hook';
import Test from './Test';

export default function View() {
  const ctrl = useCtrl();
  const model = useModel();
  const actions = useModelActions();
  const state = useModelState();
  return (
    <div>
      {/* <h1>Hello React-IMVC</h1> */}
      <button
        onClick={() => {
          ctrl.history.push({
            pathname: '/student/home',
            search: '?a=query',
          });
        }}
      >
        click
      </button>
      <div>
        {state.foo}
        <button
          onClick={() => {
            actions.ADD_FOO({ foo: state.foo + 1 });
          }}
        >
          +1
        </button>
      </div>
      <Test></Test>
    </div>
  );
}
