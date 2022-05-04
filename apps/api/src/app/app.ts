import * as express from 'express';
import * as morgan from 'morgan';
import * as path from 'path';
import routes from './routes';

const FRONTEND_PATH = path.join(__dirname, '../smarthomes-app');

const app = express();

app.use(express.static(FRONTEND_PATH));

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);
app.get('*', (_, res) => {
    res.sendFile(path.join(FRONTEND_PATH, 'index.html'));
});

export default app;
