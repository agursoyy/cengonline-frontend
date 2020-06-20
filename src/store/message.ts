import Store from '.';
import { observable } from 'mobx';
import IMessage from '../interfaces/message';


export default class Message {
  private url = {
    base: '/messages',
  };
  @observable
  public messages: Array<IMessage> = [];  // this holds the messages between two.

  constructor(private store: Store) { }

  public fetchAllMessages = async (receiverId: number): Promise<void> => {
    const url = `${this.url.base}/${receiverId}`;
    const response = await this.store.api.fetch({ url }, 200);
    const { status } = response;
    if (!status) {
      this.messages = response;
    }
    else {
      this.messages = [];
    }
  };
  public sendMessage = async (receiverId: number, content: string): Promise<void> => {
    const url = `${this.url.base}/${receiverId}`;
    const form = { content };
    const response = await this.store.api.fetch({ url, method: 'post', form }, 200);
    if (!response.status) { // which means if only data is sent from api.ts.
      this.fetchAllMessages(receiverId);
    }
  }
}