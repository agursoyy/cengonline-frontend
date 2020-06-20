import IUser from '../interfaces/user';
export default interface IMessage {
  id: number;
  content: string;
  createdAt: Date;
  updatedAt: Date;
  receiver: IUser;
  sender: IUser;
  // eslint-disable-next-line semi
}