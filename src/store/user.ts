
import Store from '.';

export default class User {
  private remote = false;
  public user;
  private url = {
    base: '/users',
    favoriteIds_url: '/favoriteIDs',
    favorites_url: '/favorites',  // ?page = 1 .
    addFavorite_url: '/addfavorite',
    removeFavorite_url: '/favorites/remove'
  };
  public age = 23;

  constructor(private store: Store) { }

  public getCurrent = async (): Promise<string> => {
    this.user = 'assigneduser';
    return this.user;
  };


}
