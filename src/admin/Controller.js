import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';

export default class Admin extends Controller {
  SSR = false;
  View = View;
  Model = Model;
  preload = {
    admin: './admin/styles/admin.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
    };
  };

  componentDidFirstMount = () => {
    const tap = this.store.getState().urlParams.tap;
    if (tap === 'register_info' || tap == undefined) {
      this.getRegisterInfo();
    }
  };

  getRegisterInfo = async () => {
    const res = await this.fetch('/admin/getRegisterInfo', { method: 'POST' });
    this.store.actions.UPDATE_REGISTERINFO(res ?? []);
  };
}
