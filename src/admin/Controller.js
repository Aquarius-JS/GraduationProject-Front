import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';

export default class Admin extends Controller {
  SSR = false;
  View = View;
}
