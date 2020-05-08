import { observable, action } from 'mobx';
import Cookies from 'universal-cookie';
import Auth from './auth';
import Api from './api';
import User from './user';
import Course from './course';

export default class Store {
  @observable
  public api = new Api(this);
  public auth = new Auth(this);
  public cookies = new Cookies();
  public user = new User(this);
  public course = new Course(this);
  [name: string]: any;

  /* public export = (): string => Stringify(this);


   public import = (data: string) =>
     Object.entries(JSON.parse(data)).forEach(([storeName, store]) =>
       Object.entries(store).forEach(([variableName, value]) => {
         if (variableName !== 'store')      /// to handle the circular structure of out store architecture. (circularity is the because of sharing store itself to child objects)
           this[storeName][variableName] = value;
       })
     );*/
}
