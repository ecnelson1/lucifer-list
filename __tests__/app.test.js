require('dotenv').config();

const { execSync } = require('child_process');

const fakeRequest = require('supertest');
const app = require('../lib/app');
const client = require('../lib/client');

describe('app routes', () => {
  describe('routes', () => {
    let token;
  
    beforeAll(async done => {
      execSync('npm run setup-db');
  
      client.connect();
  
      const signInData = await fakeRequest(app)
        .post('/auth/signup')
        .send({
          email: 'jon@user.com',
          password: '1234'
        });
      
      token = signInData.body.token; // eslint-disable-line
  
      return done();
    });
  
    afterAll(done => {
      return client.end(done);
    });

    test('returns Lucifer Characters', async() => {

      const expectation = [
        {
          'id': 1,
          'name': 'Lucifer Morningstar',
          'seasons': 5,
          'is_divine': true,
          'type': 'Angel (Fallen)',
          'owner_id': 1
        },
        {
          'id': 2,
          'name': 'Chloe Decker',
          'seasons': 5,
          'is_divine': true,
          'type': 'Human',
          'owner_id': 1
        },
        {
          'id': 3,
          'name': 'Daniel Espinoza',
          'seasons': 5,
          'is_divine': false,
          'type': 'Human',
          'owner_id': 1
        },
        {
          'id': 4,
          'name': 'Amenadiel Firstborn',
          'seasons': 5,
          'is_divine': true,
          'type': 'Angel',
          'owner_id': 1
        },
        {
          'id': 5,
          'name': 'Mazikeen of the Lilim',
          'seasons': 5,
          'is_divine': true,
          'type': 'Demon',
          'owner_id': 1
        },
        {
          'id': 6,
          'name': 'Dr. Linda Martin',
          'seasons': 5,
          'is_divine': false,
          'type': 'Human',
          'owner_id': 1
        },
        {
          'id': 7,
          'name': 'Ella lopez',
          'seasons': 4,
          'is_divine': false,
          'type': 'Human',
          'owner_id': 1
        },
        {
          'id': 8,
          'name': 'Cain/ Marcus Pierce',
          'seasons': 1,
          'is_divine': true,
          'type': 'Human (Cursed)',
          'owner_id': 1
        },
        {
          'id': 9,
          'name': 'Mum',
          'seasons': 2,
          'is_divine': true,
          'type': 'Goddess of Creation',
          'owner_id': 1
        },
        {
          'id': 10,
          'name': 'Lillith',
          'seasons': 2,
          'is_divine': false,
          'type': 'Human (Prior-Immortal)',
          'owner_id': 1
        }
      ];

      const data = await fakeRequest(app)
        .get('/characters')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(data.body).toEqual(expectation);
    });
    test('returns single character with matching id', async() => {
    
      const expectation = {
        'id': 3,
        'name': 'Daniel Espinoza',
        'seasons': 5,
        'is_divine': false,
        'type': 'Human',
        'owner_id': 1
      };
        
    
      const data = await fakeRequest(app)
        .get('/characters/3')
        .expect('Content-Type', /json/)
        .expect(200);
    
      expect(data.body).toEqual(expectation);
    });
    
  });
});


