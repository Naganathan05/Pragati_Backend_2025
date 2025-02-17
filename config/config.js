import { availableParallelism } from "os";

const numCPU = availableParallelism();

export const appConfig = {
    numCPU: numCPU,
    PORT: process.env.SERVER_PORT || 5000,
    tokenSecretKey: process.env.SECRET_KEY,
    otpTokenSecretKey: process.env.OTP_SECRET_KEY,
    db: {
        pragati: {
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USERNAME || "root",
            password: process.env.DB_PWD || "password",
            database: process.env.PRAGATI_DB_NAME || "pragati_2025",
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true,
        },
        transactions: {
            host: process.env.DB_HOST || "localhost",
            port: process.env.DB_PORT || 3306,
            user: process.env.DB_USERNAME || "root",
            password: process.env.DB_PWD || "password",
            database: process.env.TXN_DB_NAME || "pragati_transactions_2025",
            waitForConnections: true,
            connectionLimit: numCPU,
            queueLimit: 0,
            multipleStatements: true,
        },
    },
    mailer: {
        obj: {
            service: process.env.MAILER_SERVICE,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
            },
        },
        name: "Pragati 2025",
    },
    massMailer: {
        obj: {
            service: process.env.MAILER_SERVICE,
            host: process.env.MAILER_HOST,
            port: process.env.MAILER_PORT,
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
                user: process.env.MAILER_USER,
                pass: process.env.MAILER_PASS,
            },
            pool: true,
            maxConnections: 5,
            maxMessages: 100,
        },
        name: "Pragati 2025",
    },
    payU_test: {
        key: process.env.PAYU_TEST_KEY,
        salt: process.env.PAYU_TEST_SALT,
        verifyURL: "https://test.payu.in/merchant/postservice?form=2",
    },
    payU_prod: {
        key: process.env.PAYU_PROD_KEY,
        salt: process.env.PAYU_PROD_SALT,
        verifyURL: "https://info.payu.in/merchant/postservice?form=2",
    },
};

const payUMode =
    process.env.isProduction === "1"
        ? appConfig.payU_prod
        : appConfig.payU_test;

appConfig.payUKey = payUMode.key;
appConfig.payUSalt = payUMode.salt;
appConfig.payUVerifyURL = payUMode.verifyURL;
