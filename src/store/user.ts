import Store from '.';
import { observable } from 'mobx';
import { TEACHER, STUDENT } from '../constants/role';

export default class User {
  @observable
  public user: any;
  private url = {
    base: '/users',
    currentUrl: '/current',
  };

  constructor(private store: Store) { }

  public getCurrent = async (): Promise<any> => {
    const url = `${this.url.base}${this.url.currentUrl}`;
    if (!this.user) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) {
        // failed response, data and status code is sent together.
        this.user = response;
      } else {
        // successful response(200), only data is sent from api.
        this.user = null;
      }
    }
    return this.user;
  };

  public isTeacher = () => {
    if (!this.user)
      return false;
    else {
      const { roles } = this.user;
      if (roles.length > 0 && roles[0].name == TEACHER) {
        return true;
      }
    }
  }
}
