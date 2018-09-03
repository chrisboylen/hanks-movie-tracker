import { API_KEY } from '../key';
import { fetchCurry, fetchHanksMovies, signUpUserFetch, fetchFavorites, logInUserFetch, addFavoriteFetch, removeFavoriteFetch } from './fetchApi';
import { mockMovie, hanksCredits, cleanedHanksCredits } from './mockData';

describe('fetchCurry', () => {
  let database;

  beforeEach(() => {
    database = 'http://localhost:3000/api/users/';
  })

  it('should return with data', async () => {
    const mockUser = { email: 'tim@tim', password: 'password' };
    const expectedUserData = { name: 'Tim', email: 'tim@tim', password: 'password', id: 1 }

      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: true,
      json: () => Promise.resolve( expectedUserData )
      }));
    const result = await fetchCurry(database)()()()('POST')(mockUser);
    expect(result).toEqual(expectedUserData);
    });
    
  it('should return false if no data came back', async () => {
    const mockUser = { email: 'tim@tim', password: 'password' };
    const expectedUserData = { name: 'Tim', email: 'tim@tim', password: 'password', id: 1 }
    window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
      json: () => Promise.reject(expectedUserData)
    }));
    const result = await fetchCurry(database)()()()('POST')(mockUser);

    expect(result).toEqual(false);
    });

  describe('fetchHanksMovies', () => {
    it('should return Tom Hanks movies', async () => {
      const expected = cleanedHanksCredits;
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve( hanksCredits )
      }));
      const result = await fetchHanksMovies();
      expect(result).toEqual(expected);
    });

      await fetchUserFavorites(1);

      expect(window.fetch).toHaveBeenCalledWith(expected);
    });

    it('should return an object if status code is ok', async () => {
      await expect(fetchUserFavorites(1)).resolves.toEqual(hanksCredits);
    });

    it('should return an alert object if status code is not ok', async () => {
      const expected = {alert: 'Add to your favorites by selecting movies you like.'}
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        json: () => Promise.reject(expected)
      }));

       const result = await fetchUserFavorites(1);
       
       await expect(result).toEqual(expected);
    });
  });

  describe('addUserFavorite', () => {
    let mockOptions;
    beforeEach(() => {
      mockOptions = {
        method: 'POST',
        body: JSON.stringify({
          user_id: 1,
          ...mockMovie
        }),
        headers: {'Content-Type': 'application/json'}
      };
    });
    it('should be invoked with correct params', () => {
      const mockUrl = "http://localhost:3000/api/users/favorites/new"
      const expected = [mockUrl, mockOptions];

      addUserFavorite(1, mockMovie);
      expect(window.fetch).toHaveBeenCalledWith(...expected)
    });
  });
  describe('userSignUp', () => {
    it('should create a new user', async () => {
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({
          id: 14
        })
      }));

      await userSignUp('wil', 'w@w', 'w');
      expect(window.fetch).toHaveBeenCalled();
    });

    it('should return alert object if email has already been taken', async () => {
      const mockUser = {
        name: 'T',
        email: 'tman2272@aol.com',
        password: 'b'
        }
      window.fetch = jest.fn().mockImplementation(() => Promise.resolve({
        ok: false,
        json: () => Promise.reject({})
      }));

      const expected = {alert: 'Email has already been taken.'};

      await expect(userSignUp(mockUser)).resolves.toEqual(expected);
    })
  });

  describe('userLogIn', () => {
    it('should be called with the correct params', async () => {
      const user = [
        "tman2272@aol.com",
        'password'
      ]
      const expected = ["http://localhost:3000/api/users",
      {
        method: 'POST',
        body: JSON.stringify(...user),
        headers: {
          'Content-Type': 'application/json'
        }
      }];

      await userLogIn(...user);

      expect(window.fetch).toHaveBeenCalledWith(...expected)
    });

    it('should return an alert if there is no user', async () => {
      window.fetch = jest.fn().mockImplementation(() => Promise.reject({
        
      }));

      await expect(userLogIn('email', 'password')).resolves.toEqual({
        alert: 'Email and Password do not match.'
      });
    })
  });
});