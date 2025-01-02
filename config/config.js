import { availableParallelism } from "os";

const numCPU = availableParallelism();

export const appConfig = {
    numCPU: numCPU,
    PORT: process.env.SERVER_PORT || 5000,
    tokenSecretKey: process.env.SECRET_KEY,
    otpTokenSecretKey: process.env.OTP_SECRET_KEY,
    db: {
        pragati: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PWD || 'password',
            database: process.env.PRAGATI_DB_NAME || 'pragati_2025',
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true
        },
        transactions: {
            host: process.env.DB_HOST || 'localhost',
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USERNAME || 'root',
            password: process.env.DB_PWD || 'password',
            database: process.env.TXN_DB_NAME || 'pragati_transactions_2025',
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true
        }
    },
    mailer: {
        obj: {
            service: process.env.MAILER_SERVICE,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            tls: {
                ciphers: 'SSLv3',
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS
            }
        },
        name: 'Pragati 2025'
    },
}