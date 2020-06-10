
import Store from '.';

interface ILoginForm {
  email: string,
  password: string
}

interface ISignupForm {
  name: string,
  surname: string,
  email: string,
  password: string,
  role?: ['teacher'] | ['teacher'] | ['teacher' | 'student']
}

export default class Auth {
  private url = '/auth';
  public loading = '/false';

  constructor(private store: Store) { }
  public login = async ({ email, password }: ILoginForm): Promise<{
    success: boolean,
    message: string
  }> => {
    const url = `${this.url}/signin`;
    const method = 'post';
    const auth = false;
    const form = {
      email,
      password,
    };
    const response = await this.store.api.fetch({ url, method, auth, form }, 200);
    if (response) {
      const { status } = response;
      if (status && status === 400) { // failed response, data and status code is sent together.
        const { data: { message } } = response;
        return { success: false, message };
      }
      else { // successful response(200), only data is sent from api.
        const { accessToken } = response;
        const { cookies } = this.store;
        cookies.set('accessToken', accessToken, { path: '/' });
        this.store.api.accessToken = accessToken;
        return { success: true, message: 'Logged in successfully' };
      }
    }
    return { success: false, message: 'Something has gone wrong' };
  };

  public signup = async ({ name, surname, email, password, role = ['teacher'] }: ISignupForm): Promise<{
    success: boolean,
    message: string
  }> => {
    const url = `${this.url}/signup`;
    const method = 'post';
    const auth = false;
    const form = {
      name,
      surname,
      email,
      password,
      role
    };
    const response = await this.store.api.fetch({ url, method, auth, form }, 200);
    if (response) {
      const { status } = response;
      if (status && status === 400) { // failed response, data and status code is sent together.
        const { data: { message } } = response;
        return { success: false, message };
      }
      else { // successful response(200), only data is sent from api.
        return { success: true, message: 'confirmation mail has been sent to your mail account, please confirm it to sign in' };
      }
    }
    return { success: false, message: 'Something has gone wrong' };
  };


}
