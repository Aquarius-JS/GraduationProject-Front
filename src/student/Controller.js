import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';

export default class Home extends Controller {
  // 继承它，编写你的控制器逻辑
  SSR = false;
  View = View;
  Model = Model;
}
