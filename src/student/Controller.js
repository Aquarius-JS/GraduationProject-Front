import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';
import { message } from 'antd';
import sleep from '../share/sleep';

export default class Home extends Controller {
  SSR = false;
  View = View;
  Model = Model;
  preload = {
    personalInfo: '/student/styles/personalInfo.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
    };
  };
  // TODO: 获取学生信息
  componentDidFirstMount = async () => {
    const res = await this.fetch('/getStudentAndVehicleInfo', { method: 'POST' });
    if (res?.isLogin === false) {
      message.warning('登录状态已失效，请重新登录！');
      await sleep(1000);
      this.redirect('/login');
    }
    this.store.actions.UPDATE_STATE(res);
  };
}
