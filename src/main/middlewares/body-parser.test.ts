import request from 'supertest';
import app from '../config/app';

describe('Body parser middleware', () => {
  test('Should parse body type to json', async () => {
    app.post('/test_body_parser', (req, res) => {
      res.send(req.body);
    });

    const bodyRequest = { name: 'Samer' };
    await request(app)
      .post('/test_body_parser')
      .send(bodyRequest)
      .expect(bodyRequest);
  });
});
