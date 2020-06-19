export default interface IPost {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  body: string;
  comments: Array<{
    id: number;
    createdAt: Date;
    updatedAt: Date;
    body: string;
    user: {
      createdAt: Date;
      updatedAt: Date;
      id: number;
      name: string;
      surname: string;
      email: string;
      roles: Array<{
        createdAt: Date;
        updatedAt: Date;
        id: number;
        name: 'ROLE_TEACHER' | 'ROLE_STUDENT'
      }>;
    }
  }>;
  // eslint-disable-next-line semi
}
