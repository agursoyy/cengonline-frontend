import { observable, action } from "mobx";
import User from './user';


export default class Store {
  @observable
  public user = new User(this);

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


