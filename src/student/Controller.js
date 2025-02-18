import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';
import { getURLParameter } from '../share/url';

export default class Home extends Controller {
  SSR = false;
  View = View;
  Model = Model;
  getInitialState = () => {
    return {
      urlParams: getURLParameter(),
    };
  };
}
