import validator from "validator";

const validateEnv = () => {
    const rules = {
        SERVER_PORT: 'number',
        DB_USERNAME: 'string',
        DB_PWD: 'string',
        PRAGATI_DB_NAME: 'string', 
        TXN_DB_NAME: 'string',     
        // SECRET_KEY: 'string',
        // OTP_SECRET_KEY: 'string',
        // MAILER_SERVICE: 'string',
        // MAILER_HOST: 'string',
        // MAILER_PORT: 'number',
        // MAILER_USER: 'string',
        // MAILER_PASS: 'string',
    };
    const isValid = Object.entries(rules).every(([key, type]) => {
        const value = process.env[key];
        if (!value) {
            console.error(`[ERROR]: Missing Key: ${key}.`);
            return false;
        }
        if (type === 'number' && !validator.isNumeric(value)) {
            console.error(`[ERROR]: Invalid Value for ${key}. Expected Number. Got ${value}.`);
            return false;
        }
        if (type === 'string' && validator.isEmpty(value)) {
            console.error(`[ERROR]: Invalid Value for ${key}. Expected non-empty String. Got ${value}.`);
            return false;
        }
        
        return true;
    });
    if (!isValid) {
      return false;
    }
    console.log('[LOG]: All env variables validated.');
    return true;
};
export {
    validateEnv
}
