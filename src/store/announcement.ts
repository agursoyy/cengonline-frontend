
import Store from '.';
import { observable } from 'mobx';
import IAnnouncement from '../interfaces/announcement';

type ICreateAnnouncement = {
  courseID: number,
  description: string
};

export default class Announcement {
  private url = {
    base: '/announcements',
  };
  @observable
  public announcements: IAnnouncement;
  public age = 23;

  constructor(private store: Store) { }

  public fetchAllAnnouncements = async (courseID: number): Promise<void> => {
    const url = `${this.url.base}/course/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.announcements = response;
    }
    else {
      this.announcements = null;
    }
  };

  public createAnnouncement = async ({ courseID, description }: ICreateAnnouncement): Promise<boolean> => {
    const url = `${this.url.base}/${courseID}`;
    const form = {
      description
    };
    const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
    console.log(response);
    const { status } = response;
    if (!status) {
      return false;
    }
    else {
      return true;
    }
  }
}
