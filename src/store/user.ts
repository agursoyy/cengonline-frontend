import Store from '.';
import { observable } from 'mobx';
import { TEACHER, STUDENT } from '../constants/role';

export default class User {
  @observable
  public user: any;
  private url = {
    base: '/users',
    currentUrl: '/current',
    attendCourseUrl: '/attend-class'
  };

  constructor(private store: Store) { }

  public getCurrent = async (): Promise<any> => {
    const url = `${this.url.base}${this.url.currentUrl}`;
    if (!this.user) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) {
        // successful response(200), only data is sent from api.
        this.user = response;
      } else {
        // failed response, data and status code is sent together.
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
  public attendCourse = async (code: string): Promise<{ success: boolean, courseId: number, message: string }> => {
    const url = `${this.url.base}${this.url.attendCourseUrl}/${code}`;
    const response = await this.store.api.fetch({ url, method: 'post' }, 200);
    const { status } = response;
    if (!status || status === '200') {
      this.store.course.courses = null;
      return { success: true, courseId: Number(code), message: 'You have attented the course successfully ' };
    }
    else {
      const { data: { message } } = response;
      return { success: false, courseId: Number(code), message };
    }
  };
}
