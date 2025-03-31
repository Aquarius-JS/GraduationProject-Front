import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';

export default class Admin extends Controller {
  SSR = false;
  View = View;
  Model = Model;
  preload = {
    admin: './admin/styles/admin.css',
    editor: './admin/styles/editor.css',
    announcement: './admin/styles/announcement.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
    };
  };

  componentDidFirstMount = () => {
    this.getRegisterInfo();
  };

  getRegisterInfo = async () => {
    const res = await this.fetch('/admin/getRegisterInfo', { method: 'POST' });
    this.store.actions.UPDATE_REGISTERINFO(res ?? []);
  };

  approveRegister = async registerId => {
    const res = await this.fetch('/admin/approveRegister', { method: 'POST', body: JSON.stringify({ registerId }) });
    return res;
  };

  rejectRegister = async (registerId, remark) => {
    const res = await this.fetch('/admin/rejectRegister', {
      method: 'POST',
      body: JSON.stringify({ registerId, remark }),
    });
    return res;
  };

  getAnnouncementBasicInfo = async () => {
    const res = await this.fetch('/getAnnouncementBasicInfo', {
      method: 'POST',
    });
    this.store.actions.UPDATE_ANNOUNCEMENTBASICINFO(res ?? []);
    return res;
  };

  addAnnouncementInfo = async () => {
    const res = await this.fetch('/addAnnouncementInfo', {
      method: 'POST',
    });
    return res;
  };

  publishAnnouncement = async id => {
    const res = await this.fetch('/publishAnnouncement', {
      method: 'POST',
      body: JSON.stringify({ announcementId: id }),
    });
    return res;
  };

  unpublishAnnouncement = async id => {
    const res = await this.fetch('/unpublishAnnouncement', {
      method: 'POST',
      body: JSON.stringify({ announcementId: id }),
    });
    return res;
  };
}
