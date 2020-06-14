import Store from '.';
import { observable } from 'mobx';
import IAssignment from '../interfaces/assignment';

type ICreateAssignment = {
  courseID: number;
  title: string;
  dueDate: any;
  dueTime: any;
  description: string;
};

export default class Assignment {
  private url = {
    base: '/assignments',
  };
  @observable
  public assignments: Array<IAssignment> = [];

  constructor(private store: Store) {}

  public fetchAllAssignments = async (courseID: number): Promise<void> => {
    const url = `${this.url.base}/course/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.assignments = response;
    } else {
      this.assignments = [];
    }
  };

  public createAssignment = async ({
    courseID,
    title,
    description,
    dueDate,
    dueTime,
  }: ICreateAssignment): Promise<boolean> => {
    let hoursString = dueTime.getHours() < 10 ? `0${dueTime.getHours()}` : dueTime.getHours();
    let minutesString =
      dueTime.getMinutes() < 10 ? `0${dueTime.getMinutes()}` : dueTime.getMinutes();
    const date = `${dueDate.toLocaleDateString()} ${hoursString}:${minutesString}`;

    const url = `${this.url.base}/${courseID}`;
    const form = {
      title,
      description,
      dueDate: date,
    };
    const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
    const { status } = response;
    if (!status) {
      return true;
    }
    return false;
  };

  public deleteAssignment = async (id: any): Promise<boolean> => {
    const url = `${this.url.base}/${id}`;
    const response = await this.store.api.fetch({ url, method: 'delete' }, 200);
    const { status } = response;
    console.log(response);
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  public updateAssignment = async ({
    courseId,
    assignmentId,
    assignmentTitle,
    assignmentDescription,
    assignmentDueDate,
    assignmentDueTime,
  }: {
    courseId: number;
    assignmentId: number;
    assignmentTitle: string;
    assignmentDescription: string;
    assignmentDueDate: Date;
    assignmentDueTime: Date;
  }): Promise<boolean> => {
    let hoursString =
      assignmentDueTime.getHours() < 10
        ? `0${assignmentDueTime.getHours()}`
        : assignmentDueTime.getHours();
    let minutesString =
      assignmentDueTime.getMinutes() < 10
        ? `0${assignmentDueTime.getMinutes()}`
        : assignmentDueTime.getMinutes();
    const date = `${assignmentDueDate.toLocaleDateString()} ${hoursString}:${minutesString}`;

    const url = `${this.url.base}/${assignmentId}`;
    const response = await this.store.api.fetch(
      {
        url,
        method: 'put',
        form: {
          title: assignmentTitle,
          description: assignmentDescription,
          dueDate: date,
        },
      },
      200,
    );
    const { status } = response;
    if (!status) {
      await this.fetchAllAssignments(courseId);
      return true;
    }
    return false;
  };
}
