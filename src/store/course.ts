import Store from '.';
import { observable } from 'mobx';

export default class Course {
  private url = {
    base: '/courses',
  };
  @observable
  public course: any; // course-detail
  public courses: any;

  constructor(private store: Store) {}

  public fetchAllCourses = async (): Promise<void> => {
    const url = `${this.url.base}`;
    if (!this.courses) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) {
        this.courses = response;
      } else this.courses = null;
    }
  };

  public fetchCourse = async (courseID): Promise<void> => {
    const url = `${this.url.base}/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.course = response;
    } else this.course = null;
  };
}
