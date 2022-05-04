import app from '../app';
import * as request from 'supertest';
import { Connection } from '@vivid-theory/database';

const serials = ['M724000228', 'M724000388'];

describe('/api/readings', () => {
    let db: Connection;

    beforeAll(async () => {
        db = new Connection();
        await db.connect();
    });

    afterAll(async () => {
        if (Connection.active) await db.getConnection().close();
    });

    describe('GET /api/readings/serials', () => {
        it('should return 200 OK', async () => {
            const response = await request(app).get('/api/readings/serials');
            expect(response.status).toBe(200);
        });

        it('should return a list of serials', async () => {
            const response = await request(app).get('/api/readings/serials');
            expect(response.body).toBeInstanceOf(Array);
        });
    });

    describe('GET /api/readings/:serial/devices', () => {
        it('should return an empty array given an invalid serial', async () => {
            const response = await request(app).get(
                '/api/readings/invalid/devices'
            );
            expect(response.status).toBe(200);
            expect(response.body).toBeDefined();
            expect(response.body).toBeInstanceOf(Array);
            expect(response.body.length).toBe(0);
        });

        for (const serial of serials) {
            it(`should return a list of devices for a valid serial (serial: ${serial})`, async () => {
                const response = await request(app).get(
                    `/api/readings/${serial}/devices`
                );
                expect(response.status).toBe(200);
                expect(response.body).toBeInstanceOf(Array);
            });
        }
    });
});
