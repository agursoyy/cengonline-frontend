import Store from '.';
import { observable } from 'mobx';
import IAssignment from '../interfaces/assignment';

type ICreateAssignment = {
  courseID: number;
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
      this.assignments = null;
    }
  };

  // TODO: customize for assignment data type etc.
  // TODO: test the function
  public createAssignment = async ({
    courseID,
    description,
  }: ICreateAssignment): Promise<boolean> => {
    const url = `${this.url.base}/${courseID}`;
    const form = {
      description,
    };
    const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
    console.log(response);
    const { status } = response;
    if (!status) {
      return false;
    } else {
      return true;
    }
  };
}
