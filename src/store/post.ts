import Store from '.';
import { observable } from 'mobx';
import IPost from '../interfaces/post';
import { CropOriginal } from '@material-ui/icons';

type ICreatePost = {
  courseID: number;
  body: string;
};

export default class Post {
  private url = {
    base: '/posts',
  };
  @observable
  public posts: Array<IPost> = [];

  constructor(private store: Store) { }

  public fetchAllPosts = async (courseID: number): Promise<void> => {
    const url = `${this.url.base}/course/${courseID}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.posts = response;
    } else {
      this.posts = [];
    }
  };

  public createPost = async ({
    courseID,
    body,
  }: ICreatePost): Promise<boolean> => {
    const url = `${this.url.base}/${courseID}`;
    const form = {
      body,
    };
    const response = await this.store.api.fetch({ url, form, method: 'post' }, 200);
    const { status } = response;
    if (!status) {
      await this.fetchAllPosts(courseID);
      return true;
    }
    return false;
  };

  public deletePost = async ({ postId, courseId }: { postId: number, courseId: number }): Promise<boolean> => {
    const url = `${this.url.base}/${postId}`;
    const response = await this.store.api.fetch({ url, method: 'delete' }, 200);
    const { status } = response;
    if (status === 'OK') {
      this.fetchAllPosts(courseId);
      return true;
    }
    return false;
  };

  public updatePost = async ({ courseId, postId, body }: {
    courseId: number, postId: number,
    body: string
  }): Promise<boolean> => {
    const url = `${this.url.base}/${postId}`;
    const form = {
      body
    };
    const response = await this.store.api.fetch({ url, method: 'put', form }, 200);
    const { status } = response;
    if (!status) {
      await this.fetchAllPosts(courseId);
      return true;
    }
    return false;
  }

  public addCommentToPost = async (courseId: number, postId: number, body: string): Promise<Boolean> => {
    const url = `/comments/${postId}`;
    const response = await this.store.api.fetch({ url, method: 'post', form: { body } }, 200);
    const { status } = response;
    console.log(response);
    if (!status) {
      await this.fetchAllPosts(courseId);
      return true;
    }
    return false;
  }
}