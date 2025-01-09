# Pragati Backend 2025

Backend server for **Pragati 2025**.

---

## Prerequisites

1. **Node.js** (v16 or higher) and **npm**: [Download and Install](https://nodejs.org/)
2. **MySQL**: [Download and Install](https://dev.mysql.com/)

---

## Installation Steps

### 1. Clone the Repository

```bash
git clone https://github.com/Naganathan05/Pragati_Backend_2025.git
cd Pragati_Backend_2025
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Create Databases

Set up the required databases in MySQL:

```sql
CREATE DATABASE pragati_2025;
CREATE DATABASE pragati_transactions_2025;
```

### 4. Configure Environment Variables

> [!Important]
> Just for the sake of security, the `.env` file is not included in the repository. You need to create one yourself. For mailer credentials, only people involved in development of routes that require mailer service have access. Others, please enter dummy values to avoid errors.

Create a `.env` file in the root directory of the project and add the following key-value pairs. Replace placeholders with actual values. Ensure there are no spaces or quotes, and values are entered as plain text.

```env
# Server Port Number
SERVER_PORT=<PORT_IN_WHICH_YOU_WANT_THE_BACKEND_TO_RUN_IN>

# Database Credentials
DB_USERNAME=<YOUR_MYSQL_DB_USERNAME>
DB_PWD=<YOUR_MYSQL_DB_PASSWORD>
PRAGATI_DB_NAME=<NAME_OF_THE_DATABASE_FOR_PRAGATI>
TXN_DB_NAME=<NAME_OF_THE_DATABASE_FOR_TRANSACTIONS>

# Secret for JWT Token Source Verification
SECRET_KEY=<YOUR_SECRET_KEY>

# Secret for OTP Token Source Verification
OTP_SECRET_KEY=<YOUR_SECRET_KEY>

# Mailer Creds
MAILER_SERVICE=<MAILER_SERVICE_NAME>
MAILER_HOST=<MAILER_HOSTNAME>
MAILER_PORT=<MAILER_PORT>
MAILER_USER=<MAILER_EMAIL>
MAILER_PASS=<MAILER_PASSWORD>
```

### 5. Start the Server

- **For development** (with live reload):

  ```bash
  npm run dev
  ```

- **For development** (without live reload):

  ```bash
  npm start
  ```


