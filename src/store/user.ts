
import Store from '.';

export default class User {
  public user;
  private url = {
    base: '/users',
    currentUrl: '/current'
  };

  constructor(private store: Store) { }

  public getCurrent = async (): Promise<any> => {
    const url = `${this.url.base}${this.url.currentUrl}`;
    if (!this.user) {
      const response = await this.store.api.fetch({ url }, 200);
      const { status } = response;
      if (!status) { // failed response, data and status code is sent together.
        this.user = response;
      }
      else { // successful response(200), only data is sent from api.
        this.user = null;
      }
    }
    return this.user;
  };


}
