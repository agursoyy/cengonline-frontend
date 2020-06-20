export default interface IUser {
  id: number;
  email: string;
  name: string;
  surname: string;
  createdAt: Date;
  updatedAt: Date;
  roles: Array<any>;
  // eslint-disable-next-line semi
}