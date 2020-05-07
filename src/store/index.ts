import { observable, action } from 'mobx';
import Cookies from 'universal-cookie';
import User from './user';
import Auth from './auth';
import Api from './api';


export default class Store {
  @observable
  public api = new Api(this);
  public user = new User(this);
  public auth = new Auth(this);
  public cookies = new Cookies();
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


