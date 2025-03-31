import Controller from 'react-imvc/controller'; // 加载 react-imvc controller 控制器
import View from './View';
import Model from './Model';

export default class Admin extends Controller {
  SSR = false;
  View = View;
  Model = Model;

  preload = {
    announcement: './announcementEditor/styles/announcement.css',
    editor: './announcementEditor/styles/editor.css',
  };

  getInitialState = () => {
    return {
      urlParams: this.location.query,
      announcementId: this.location.query.id ?? '',
    };
  };

  componentDidFirstMount = () => {
    this.getAnnouncementInfoById(this.store.getState().announcementId);
  };

  getAnnouncementInfoById = async announcementId => {
    const res = await this.fetch('/getAnnouncementInfoById', {
      method: 'POST',
      body: JSON.stringify({ announcementId }),
    });
    this.store.actions.UPDATE_ANNOUNCEMENTINFO(res);
    document.title = '编辑公告: ' + res.title;
    return res;
  };

  updateAnnouncementTitleById = async (announcementId, title) => {
    const res = await this.fetch('/updateAnnouncementTitleById', {
      method: 'POST',
      body: JSON.stringify({ announcementId, title }),
    });
    return res;
  };

  updateAnnouncementContentById = async (announcementId, content) => {
    const res = await this.fetch('/updateAnnouncementContentById', {
      method: 'POST',
      body: JSON.stringify({ announcementId, content }),
    });
    return res;
  };
}
