import app from './app';
import { Connection } from '@vivid-theory/database';

const db = new Connection();
const PORT = process.env.PORT ?? 3333;

(async () => {
    try {
        await db.connect();
        app.listen(PORT, () => {
            console.log(`API listening on port ${PORT}`);
        });
    } catch (e) {
        console.error('Error connecting to database:', e);
    }
})();
