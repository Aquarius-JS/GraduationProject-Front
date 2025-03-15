import AuthorizationController from './AuthorizationController'; // 加载授权控制器
import View from './View';
import Model from './Model';

export default class Home extends AuthorizationController {
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
    const res = await this.stuFetch('/getStudentAndVehicleInfo', { method: 'POST' });
    this.store.actions.UPDATE_STATE(res);
  };

  updateStuInfo = async newUserInfo => {
    const res = await this.stuFetch('/updateStuInfo', {
      method: 'POST',
      body: JSON.stringify(newUserInfo),
    });
    return res;
  };

  editPassword = async passwordInfo => {
    const res = await this.stuFetch('/editPassword', {
      method: 'POST',
      body: JSON.stringify(passwordInfo),
    });
    return res;
  };

  vehicleRegistration = async registionInfo => {
    const res = await this.stuFetch('/vehicleRegistration', {
      method: 'POST',
      body: JSON.stringify(registionInfo),
    });
    return res;
  };
}
