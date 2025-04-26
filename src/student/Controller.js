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
      violationInfoModalData: {
        isModalOpen: false,
        violationInfo: {},
      },
    };
  };

  componentDidFirstMount = async () => {
    await this.getStudentAndVehicleInfo();
    const licList = this.store.getState().vehicleInfo.map(item => item.license_number);
    this.getViolationInfoByLicenseNumberList(licList);
    this.getAnnouncementBasicInfo();
  };

  getVehicleInfoByStuToken = async () => {
    const res = await this.stuFetch('/getVehicleInfoByStu', { method: 'POST' });
    this.store.actions.UPDATE_STATE({ vehicleInfo: res });
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

  confirmEnterSchool = async registionInfo => {
    const res = await this.stuFetch('/confirmEnterSchool', {
      method: 'POST',
      body: JSON.stringify(registionInfo),
    });
    return res;
  };

  cancelRegister = async registionInfo => {
    const res = await this.stuFetch('/cancelRegister', {
      method: 'POST',
      body: JSON.stringify(registionInfo),
    });
    return res;
  };

  registerAgain = async registionInfo => {
    const res = await this.stuFetch('/registerAgain', {
      method: 'POST',
      body: JSON.stringify(registionInfo),
    });
    return res;
  };

  leavingRegister = async registionInfo => {
    const res = await this.stuFetch('/leavingRegister', {
      method: 'POST',
      body: JSON.stringify(registionInfo),
    });
    return res;
  };

  modificationRegisterInfo = async newRegisterInfo => {
    const res = await this.stuFetch('/modificationRegisterInfo', {
      method: 'POST',
      body: JSON.stringify(newRegisterInfo),
    });
    return res;
  };

  getStudentAndVehicleInfo = async () => {
    const res = await this.stuFetch('/getStudentAndVehicleInfo', { method: 'POST' });
    this.store.actions.UPDATE_STATE(res);
  };

  getViolationInfoByLicenseNumberList = async licenseNumberList => {
    const violationInfoList = await this.stuFetch('/getViolationInfoByLicenseNumberList', {
      method: 'POST',
      body: JSON.stringify({ licenseNumberList }),
    });
    this.store.actions.UPDATE_VIOLATIONINFOLIST(violationInfoList);
  };

  getAnnouncementBasicInfo = async () => {
    const res = await this.stuFetch('/getAnnouncementBasicInfo', { method: 'POST' });
    this.store.actions.UPDATE_ANNOUNCEMENTBASICINFO(res.filter(item => item.status === 2));
    return res;
  };

  violationInfoHaveRead = async id => {
    const res = await this.stuFetch('/violationInfoHaveRead', { method: 'POST', body: JSON.stringify({ id }) });
    return res;
  };

  violationInfoAppeal = async (id, appealReason) => {
    const res = await this.stuFetch('/violationInfoAppeal', {
      method: 'POST',
      body: JSON.stringify({ id, appealReason }),
    });
    return res;
  };
}
