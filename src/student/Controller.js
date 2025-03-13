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
    home: '/student/styles/home.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
    };
  };

  componentDidFirstMount = async () => {
    const res = await this.fetch('/getStudentAndVehicleInfo', { method: 'POST' });
    if (res?.isLogin === false) {
      message.warning('登录状态已失效，请重新登录！');
      await sleep(1000);
      this.redirect('/login');
    }
    this.store.actions.UPDATE_STATE(res);
  };

  updateStuInfo = async newUserInfo => {
    const res = await this.fetch('/updateStuInfo', {
      method: 'POST',
      body: JSON.stringify(newUserInfo),
    });
    if (res?.isLogin === false) {
      message.warning('登录状态已失效，请重新登录！');
      await sleep(1000);
      this.redirect('/login');
      return;
    }
    return res;
  };
  editPassword = async passwordInfo => {
    const res = await this.fetch('/editPassword', {
      method: 'POST',
      body: JSON.stringify(passwordInfo),
    });
    if (res?.isLogin === false) {
      message.warning('登录状态已失效，请重新登录！');
      await sleep(1000);
      this.redirect('/login');
      return;
    }
    return res;
  };
}
