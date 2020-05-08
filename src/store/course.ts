
import Store from '.';
import { observable } from 'mobx';

export default class User {
  private url = {
    base: '/courses',
  };
  @observable
  public courses: any;
  public age = 23;

  constructor(private store: Store) { }

  public fetchAllCourses = async (): Promise<void> => {
    const url = `${this.url.base}`;
    if (!this.courses) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) {
        this.courses = response;
      }
      else
        this.courses = null;
    }
  };
}
