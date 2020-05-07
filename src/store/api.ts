import Axios from 'axios';
import Store from '.';
import queryString from 'query-string';
const config = require('../config');
const { publicRuntimeConfig: { api } } = config;
console.log(api);
type IParams = {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete',
  form?: {
    [x: string]: any
  };
  auth?: boolean;
};


export default class Api {
  private url = api;  // .env den çekelim
  //private local_api;
  public accessToken?: string;
  public refreshToken?: string;

  constructor(private store: Store) { }

  public fetch = ({
    url,
    method = 'get',
    form,
    auth = true,
  }: IParams, expected?: number) => { // expected http response status code

    const config = {
      data: {},
      headers: {},
      method,
      url: `${this.url}${url}`,
    };
    if (auth) {
      config.headers = {
        ...config.headers,
        authorization: `Bearer ${this.accessToken}`,
      };
    }
    if (form && Object.keys(form).length > 0) {
      if (method === 'get') {
        const queryParams = queryString.stringify(form, { arrayFormat: 'bracket' });
        config.url = `${config.url}?${queryParams}`;
      }
      else {
        config.data = { ...form };
      }
    }

    if (config.method === 'get') {   // redundant data leads the api to create an error.
      delete config.data;
    }

    return Axios(config).then(({ data, status }) => {
      return expected ? (expected === status ? data : null) : { data, status }; // successful expected response(200), only data is sent from api.
    }).catch(err => {
      if (err.response) {
        const { status, data } = err.response;
        if (status === 401) {
          // if(this.refreshToken ) {} // auth not implemented yet.
        }
        return { data, status };   // failed response, data and status code is sent together.
      }
    });
  }



}