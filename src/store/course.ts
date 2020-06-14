import Store from '.';
import { observable } from 'mobx';

export default class Course {
  private url = {
    base: '/courses',
  };
  @observable
  public course: any; // course-detail
  public studentsOfCourse: any;
  public courses: any;

  constructor(private store: Store) {}

  public fetchAllCourses = async (): Promise<void> => {
    const url = `${this.url.base}`;
    if (!this.courses) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) {
        console.log(response);
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

  public fetchStudents = async (courseID): Promise<void> => {
    const url = `${this.url.base}/students/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);

    const { status } = response;
    if (!status) {
      if (Array.isArray(response)) {
        this.studentsOfCourse = response;
      }
    } else this.studentsOfCourse = [];
  };

  public addCourse = async ({
    title,
    term,
  }: {
    title: string;
    term: string;
  }): Promise<{ success: boolean; courseId?: number }> => {
    const isTeacher = this.store.user.isTeacher();
    if (isTeacher) {
      const url = `${this.url.base}`;
      const form = { title, term };
      const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
      const { status } = response;
      if (!status) {
        this.courses = null; // to fetch all courses again on courses page
        const { id } = response;
        return { success: true, courseId: id };
      }
      return { success: false };
    }
    return { success: false };
  };

  public updateCourse = async ({
    courseId,
    title,
    term,
  }: {
    courseId: number;
    title: string;
    term: string;
  }): Promise<{ success: boolean; courseId?: number }> => {
    const isTeacher = this.store.user.isTeacher();
    if (isTeacher) {
      const url = `${this.url.base}/${courseId}`;
      const form = { title, term };
      const response = await this.store.api.fetch({ url, form, method: 'put' }, 200);
      const { status } = response;
      if (!status) {
        this.courses = null; // to fetch all courses again on courses page
        await this.fetchCourse(courseId);
        const { id } = response;
        return { success: true, courseId: id };
      }
      return { success: false };
    }
    return { success: false };
  };

  public deleteCourse = async (id: any): Promise<boolean> => {
    const url = `${this.url.base}/${id}`;
    const response = await this.store.api.fetch({ url, method: 'delete' }, 200);
    const { status } = response;
    if (status === 'OK') {
      return true;
    }
    return false;
  };
}
