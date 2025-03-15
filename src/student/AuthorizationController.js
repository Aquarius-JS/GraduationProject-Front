import Controller from 'react-imvc/controller';
import { message } from 'antd';
import sleep from '../share/sleep';
// 封装AuthorizationController实现对用户登录态的判断逻辑
export default class AuthorizationController extends Controller {
  stuFetch = async (...args) => {
    const res = await this.fetch.call(this, ...args);
    if (res?.isLogin === false) {
      message.warning('登录状态已失效，请重新登录！');
      await sleep(1000);
      this.redirect('/login');
      return;
    }
    return res;
  };
}
