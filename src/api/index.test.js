import MockAdapter from 'axios-mock-adapter';
import * as helpers from 'helpers';
import appApiClient from './index';
import apiInstance from './apiInstance';

jest.unmock('axios');

describe('appApiClient', () => {
  const mockAppClient = new MockAdapter(apiInstance, {
    onNoMatch: 'throwException',
  });

  beforeEach(async () => {
    mockAppClient.reset();
  });

  afterAll(() => {
    mockAppClient.restore();
  });

  it('should successfully fetch hotlines data by search param', async () => {
    const search = 'Delhi';
    const response = [
      {
        _id: '5f9db611c7cc881787ba620e',
        city: 'Delhi',
        country: 'India',
        organisation_name: "Nelson's Horsenettle",
        phone: '+91 9876543210',
        website: 'https://nari.nic.in',
        description: 'Available 24/7',
      },
      {
        _id: '5f9db611c7cc881787ba620a',
        city: 'Delhi',
        country: 'India',
        organisation_name: 'Test name',
        phone: '+91 1122334455',
        website: 'https://ncw.nic.in',
        description: 'Available 24/7',
      },
      {
        _id: '5f9db611c7cc881787ba620b',
        city: 'Delhi',
        country: 'India',
        organisation_name: 'Test name 2',
        phone: '+91 9988776655',
        website: 'https://wcd.nic.in',
        description: 'Available 24/7',
      },
    ];
    mockAppClient
      .onGet('/hotlines', { params: { searchTerm: search } })
      .reply(200, response);
    const hotlines = await appApiClient.getHotlinesData(search);
    expect(hotlines.data).toEqual(response);
  });

  it('should successfully fetch shelters data', async () => {
    const response = [
      {
        place_name: 'Safe Shelter',
        address: '110001, Delhi, India Gate Road, 1',
        contact_person: 'Jon Snow',
        phone: '+91 1122334455',
        locs: [77.2314, 28.6139],
      },
    ];
    mockAppClient.onGet('/shelters').reply(200, {
      data: response,
    });
    const shelters = await appApiClient.getSheltersData();
    expect(shelters.data.data).toEqual(response);
  });

  it('should successfully fetch articles data', async () => {
    const response = [
      {
        title: 'Test title',
        author: 'Test User',
        text: 'Lorem ipsum',
        violence_type: ['emotional'],
        url_to_image: 'https://upload.wikimedia.org/example.jpg',
      },
    ];
    mockAppClient.onGet('/articles').reply(200, {
      data: response,
    });
    const articles = await appApiClient.getArticlesData();
    expect(articles.data.data).toEqual(response);
  });

  it('should successfully fetch articles data by id', async () => {
    const response = [
      {
        title: 'Test title',
        author: 'Test User',
        text: 'Lorem ipsum',
        violence_type: ['emotional'],
        url_to_image: 'https://upload.wikimedia.org/example.jpg',
      },
    ];
    const id = '6062e6501e80a94test40522';
    mockAppClient.onGet(`/articles/${id}`).reply(200, {
      data: response,
    });
    const article = await appApiClient.getArticleById(id);
    expect(article.data.data).toEqual(response);
  });

  it('should successfully send user data on POST to /login endpoint', async () => {
    const email = 'test@test.com';
    const password = '12345678';
    const user = {
      username: 'Celeste',
      email,
      contacts: [{}],
      role: 'basic',
    };
    const response = {
      success: true,
      message: 'Logged in successfully !',
      token: 'TestToken121212',
      user,
    };
    mockAppClient.onPost('/login', { email, password }).reply(201, response);
    const actual = await appApiClient.loginUser(email, password);
    expect(actual.data).toEqual(response);
  });

  it('should successfully send user data on POST to /signup endpoint', async () => {
    const email = 'test@test.com';
    const password = '12345678';
    const username = 'celeste';
    const token = 'TestToken121212';
    const user = {
      username,
      email,
      contacts: [{}],
      role: 'basic',
    };
    const response = {
      success: true,
      token,
      user,
    };
    mockAppClient
      .onPost('/signup', { email, password, username })
      .reply(201, response);
    const actual = await appApiClient.signupUser(email, password, username);
    expect(actual.data).toEqual(response);
  });

  it('should successfully delete user on DELETE request to /deleteUser endpoint', async () => {
    const username = 'celeste';
    const email = 'test@test.com';
    const user = {
      username,
      email,
      contacts: [{}],
      role: 'basic',
    };
    const response = {
      message: 'User was deleted',
      user,
    };
    mockAppClient
      .onDelete('/deleteUser', { params: { username } })
      .reply(200, response);
    const actual = await appApiClient.deleteUser(username);
    expect(actual.data).toEqual(response);
  });

  it('should successfully change password of user on POST request to /changePassword endpoint', async () => {
    const email = 'test@test.com';
    const password = '12345678';
    const oldPassword = '87654321';
    const response = {
      message: 'You updated the password',
    };
    mockAppClient
      .onPost('/changePassword', { email, oldPassword, password })
      .reply(200, response);
    const actual = await appApiClient.changePassword(
      email,
      oldPassword,
      password
    );
    expect(actual.data).toEqual(response);
  });

  it('should successfully get sos contacts with username', async () => {
    const username = 'celeste';
    const response = [
      {
        _id: '2f213dsafdsfasdfdas34e',
        name: 'Soyoon',
        phone: '012341235215',
        message: 'help',
      },
    ];
    mockAppClient.onGet(`/users/${username}/contacts`).reply(200, response);
    const actual = await appApiClient.getSosContacts(username);
    expect(actual.data).toEqual(response);
  });

  it('should successfully delete a contact with username and contact id', async () => {
    const username = 'celeste';
    const id = '2f213dsafdsfasdfdas34e';
    const response = [];
    mockAppClient
      .onDelete(`/users/${username}/contacts/${id}`)
      .reply(202, response);
    const actual = await appApiClient.deleteSosContact(username, id);
    expect(actual.data).toEqual(response);
  });

  it('should successfully add a contact', async () => {
    const username = 'celeste';
    const data = {
      name: 'ciel',
      phone: '12341234134',
      message: 'help me',
    };
    const response = [
      {
        _id: '2f213dsafdsfasdfdas34h',
        name: 'ciel',
        phone: '12341234134',
        message: 'help me',
      },
    ];
    mockAppClient.onPatch(`/users/${username}/contacts/`).reply(201, response);
    const actual = await appApiClient.addSosContact(username, data);
    expect(actual.data).toEqual(response);
  });

  it('should successfully edit a contact', async () => {
    const username = 'celeste';
    const id = '2f213dsafdsfasdfdas34e';
    const data = {
      name: 'soyoon',
      phone: '12341234134',
      message: 'help me',
    };
    const response = {
      _id: '2f213dsafdsfasdfdas34e',
      name: 'soyoon',
      phone: '12341234134',
      message: 'help me',
    };
    mockAppClient
      .onPatch(`/users/${username}/contacts/${id}`)
      .reply(201, response);
    const actual = await appApiClient.editSosContact(username, data, id);
    expect(actual.data).toEqual(response);
  });
});

describe('Request interceptor', () => {
  beforeEach(async () => {
    helpers.getTokenSecureStorage = jest.fn(() => 'faketoken');
  });
  it('should add authorization token to header', async () => {
    const result = await apiInstance.interceptors.request.handlers[0].fulfilled(
      {
        headers: {},
      }
    );
    expect(result.headers).toHaveProperty('authorization');
    expect(result.headers['authorization']).toBe('Bearer faketoken');
    expect(helpers.getTokenSecureStorage.mock.calls.length).toBe(1);
  });
});
