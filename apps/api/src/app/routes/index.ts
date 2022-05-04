import * as express from 'express';
import readings from './readings';

const router = express.Router();

router.get('/', (_, res) => res.json({ message: 'API v1' }));

router.use('/readings', readings);

export default router;
