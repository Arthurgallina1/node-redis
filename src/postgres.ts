import { Pool } from 'pg'

export async function createConnection() {
    const pool = new Pool({
        host: process.env.DB_HOST,
        port: Number(process.env.DB_PORT),
        user: process.env.DB_USER,
        password: process.env.DB_PASS,
        database: process.env.DB_DATABASE,
    })

    await pool.connect()
    return pool
}

export class PGPool {
    pool

    constructor() {
        console.log('pool set ')
        const pool = new Pool({
            host: process.env.DB_HOST,
            port: Number(process.env.DB_PORT),
            user: process.env.DB_USER,
            password: process.env.DB_PASS,
            database: process.env.DB_DATABASE,
        })

        pool.connect().then(() => (this.pool = pool))
    }
}

const pgClient = new PGPool()
export { pgClient }
