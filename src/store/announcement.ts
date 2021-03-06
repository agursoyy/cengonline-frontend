import Store from '.';
import { observable } from 'mobx';
import IAnnouncement from '../interfaces/announcement';
import { CropOriginal } from '@material-ui/icons';

type ICreateAnnouncement = {
  courseID: number;
  description: string;
};

export default class Announcement {
  private url = {
    base: '/announcements',
  };
  @observable
  public announcements: Array<IAnnouncement> = [];

  constructor(private store: Store) { }

  public fetchAllAnnouncements = async (courseID: number): Promise<void> => {
    const url = `${this.url.base}/course/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.announcements = response;
    } else {
      this.announcements = [];
    }
  };

  public createAnnouncement = async ({
    courseID,
    description,
  }: ICreateAnnouncement): Promise<boolean> => {
    const url = `${this.url.base}/${courseID}`;
    const form = {
      description,
    };
    const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
    const { status } = response;
    if (!status) {
      await this.fetchAllAnnouncements(courseID);
      return true;
    }
    return false;
  };

  public deleteAnnouncement = async (id: any): Promise<boolean> => {
    const url = `${this.url.base}/${id}`;
    const response = await this.store.api.fetch({ url, method: 'delete' }, 200);
    const { status } = response;
    console.log(response);
    if (status === 'OK') {
      return true;
    }
    return false;
  };

  public updateAnnouncement = async ({ courseId, announcementId, announcementDescription }: {
    courseId: number, announcementId: number,
    announcementDescription: string
  }): Promise<boolean> => {
    const url = `${this.url.base}/${announcementId}`;
    const response = await this.store.api.fetch({ url, method: 'put', form: { description: announcementDescription } }, 200);
    const { status } = response;
    if (!status) {
      await this.fetchAllAnnouncements(courseId);
      return true;
    }
    return false;
  }

}
