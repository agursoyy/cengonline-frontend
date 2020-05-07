
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
  role: string
}

export default class Auth {
  private url = '/auth';
  public loading = '/false';

  constructor(private store: Store) { }
  public login = async ({ email, password }: ILoginForm) => {
    const url = `${this.url}/signin`;
    const method = 'post';
    const auth = false;
    const form = {
      email,
      password,
    };
    const response = await this.store.api.fetch({ url, method, auth, form }, 200);
    const { status } = response;
    if (status && status === 400) { // failed response, data and status code is sent together.
      const { data } = response;
      return { auth: false, errors: data };
    }
    else { // successful response(200), only data is sent from api.
      const { accessToken } = response;
      const { cookies } = this.store;
      cookies.set('accessToken', accessToken, { path: '/' });
      this.store.api.accessToken = accessToken;
      return { auth: true };
    }
  };

  public signup = async ({ name, surname, email, password, role }: ISignupForm) => {
    const url = `${this.url}/signup`;
    const method = 'post';
    const auth = false;
    const form = {
      surname,
      email,
      password,
    };
    const response = await this.store.api.fetch({ url, method, auth, form }, 201);
    const { status } = response;
    if (status && status === 400) { // failed response, data and status code is sent together.
      const { data } = response;
      return { signup_success: false, errors: data };
    }
    else { // successful response(200), only data is sent from api.
      return { signup_success: true, msg: 'confirmation mail has been sent to your mail account, please confirm it to sign in' };
    }
  };


}
