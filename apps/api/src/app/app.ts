import * as express from 'express';
import * as morgan from 'morgan';
import routes from './routes';

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api', routes);

export default app;
