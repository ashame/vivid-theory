import * as express from 'express';
import { Readings } from '@vivid-theory/models';

const router = express.Router();
const readings = Readings.Model;

const deviceIds = (() => {
    const cache = new Map<string, Set<string>>();
    setInterval(() => cache.clear(), 1000 * 60); // clear cache at one minute intervals to keep fresh data in accordance to sample rate
    return async (serial: string) => {
        const set = cache.get(serial) ?? new Set();
        if (set.size) return Array.from(set);
        const { Sequelize } = readings.sequelize;
        const deviceIds = await readings.findAll({
            attributes: [
                [
                    Sequelize.fn('DISTINCT', Sequelize.col('Device_ID')),
                    'Device_Name',
                ],
            ],
            where: {
                Serial_Number: serial,
            },
        });
        for (const id of deviceIds) {
            set.add(id.Device_Name);
        }
        if (set.size) cache.set(serial, set);
        return Array.from(set);
    };
})();

const serials = (() => {
    let cache = [];
    setInterval(() => (cache = []), 1000 * 60);
    return async () => {
        if (cache.length) return cache;
        const { Sequelize } = readings.sequelize;
        const serials = await readings.findAll({
            attributes: [
                [
                    Sequelize.fn('DISTINCT', Sequelize.col('Serial_Number')),
                    'Serial_Number',
                ],
            ],
        });
        for (const serial of serials) {
            cache.push(serial.Serial_Number);
        }
        return cache;
    };
})();

router.get('/', (_, res) => res.json({ message: '/api/readings' }));

router.get('/serials', async (_, res) => {
    const result = await serials();
    res.json(result);
});

router.get('/:serial/devices', async (req, res) => {
    const result = await deviceIds(req.params.serial);
    res.json(result);
});

router.get('/:serial/:deviceId', async (req, res) => {
    const { serial, deviceId } = req.params;
    const result = await readings.findAll({
        attributes: {
            exclude: ['createdAt', 'updatedAt', 'id'],
        },
        where: {
            Serial_Number: serial,
            Device_ID: deviceId,
        },
        order: [['DateTime', 'ASC']],
    });
    res.json(result);
});

export default router;