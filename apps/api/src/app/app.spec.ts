import app from './app';
import * as request from 'supertest';

describe('GET /api', () => {
    it('should return 200 OK', async () => {
        const response = await request(app).get('/api');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ message: 'API v1' });
    });
});

describe('GET /', () => {
    it('should return a 404', async () => {
        const result = await request(app).get('/');
        expect(result.statusCode).toEqual(404);
    });
});
