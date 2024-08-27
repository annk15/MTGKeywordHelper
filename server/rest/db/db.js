import dotenv from 'dotenv'
import { createConnection } from 'mysql2';

dotenv.config()

const connection = createConnection({
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE
});

export default connection;
