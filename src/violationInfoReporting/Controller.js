import Controller from 'react-imvc/controller';
import View from './View';
import Model from './Model';

export default class ViolationInfoReporting extends Controller {
  SSR = false;
  View = View;
  Model = Model;

  preload = {
    vio: '/violationInfoReporting/styles/violationInfoReporting.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
      searchValue: '',
      searchResults: [],
      isSearched: false,
    };
  };

  getVehicleRegisterInfoByStuNumber = async stu_number => {
    const res = await this.fetch('/getVehicleRegisterInfoByStuNumber', {
      method: 'POST',
      body: JSON.stringify({ stu_number }),
    });
    return res;
  };

  getVehicleRegisterInfoByLicense = async license_number => {
    const res = await this.fetch('/getVehicleRegisterInfoByLicense', {
      method: 'POST',
      body: JSON.stringify({ license_number }),
    });
    return res;
  };

  unregisteredVehicleInfoReporting = async unregisteredInfo => {
    const res = await this.fetch('/unregisteredVehicleInfoReporting', {
      method: 'POST',
      body: JSON.stringify(unregisteredInfo),
    });
    return res;
  };

  violationInfoReporting = async violationInfo => {
    const res = await this.fetch('/violationInfoReporting', {
      method: 'POST',
      body: JSON.stringify(violationInfo),
    });
    return res;
  };
}
