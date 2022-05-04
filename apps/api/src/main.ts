import app from './app';
import { Connection } from '@vivid-theory/database';

const db = new Connection();
const PORT = process.env.PORT ?? 3333;


db.connect().then((err) => {
    if (err) process.exit(1);
    app.listen(PORT, () => {
        console.log(`Server listening on port ${PORT}`);
    });
});
