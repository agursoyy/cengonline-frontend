export default interface announcement {
  id: number;
  title: string;
  description: string;
  dueDate: Date;
  submissions: Array<any>;
  createdAt: Date;
  updatedAt: Date;
  // eslint-disable-next-line semi
}
