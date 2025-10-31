# SIGMA CRM

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

This guide will walk you through the process of setting up the project for local development.

### 1. Prerequisites

Before you begin, ensure you have the following installed on your system:

- **Node.js**: This project is configured to use a specific version of Node.js to ensure consistency and avoid potential conflicts.
  - **Required Version**: `18.20.0`
  - **Recommended Manager**: [nvm](https://github.com/nvm-sh/nvm) (Node Version Manager)

  This project includes a `.nvmrc` file. If you have `nvm` installed, you can switch to the correct Node.js version by running the following command in the project's root directory:
  ```bash
  nvm use
  ```
  If you don't have this version installed, `nvm` will prompt you to install it.

- **npm**: This comes bundled with Node.js.

### 2. Clone the Repository

First, clone the project repository to your local machine:

```bash
git clone https://github.com/dcolombres/sigma-crm.git
cd sigma-crm
```

### 3. Install Dependencies

Next, install all the project dependencies using npm:

```bash
npm install
```

This command will download and install all the necessary packages defined in the `package.json` file.

### 4. Set Up Environment Variables

The project uses a `.env` file to manage environment variables. You will need to create this file in the root of the project.

Create a file named `.env` and add the following content:

```
# Database configuration
DATABASE_URL="postgresql://user:password@localhost:5432/sigma-crm"
```

**Explanation of the variables:**

- **`DATABASE_URL`**: This is the connection string for your database. Replace `USER`, `PASSWORD`, `HOST`, `PORT`, and `DATABASE` with your PostgreSQL credentials.

### 5. Set Up the Database

The project uses [Prisma](https://www.prisma.io/) as an ORM to interact with the database. To set up the database, you need to run the following command:

```bash
npx prisma migrate dev
```

This command will:

- Apply all the migrations from the `prisma/migrations` directory to the database.
- Run the `prisma/seed.ts` script to populate the database with initial data, including users, projects, and other lookup tables.

### 6. Run the Application

Now that you have completed the setup, you can run the development server:

```bash
npm run dev
```

This will start the application on `http://localhost:3000`. Open this URL in your browser to see the result.

## Importing Staff Data

The `staff_template.csv` file contains all the configuration columns, and the `prisma/import_staff.ts` script can read them, handle optional values, and update existing users if the email already exists. To use it, open `staff_template.csv` in `/Users/dcolom/DSIGMA/`, fill in the data (only `nombre_completo` and `email` are required), and run:

```bash
npm run import:staff
```

This will allow for more complete bulk management.

## Importing Project Data

The `prisma/import_proyectos.ts` script can read the data from the Google Sheet and import it into the database. To use it, make sure the `GOOGLE_SHEETS_DOCUMENT_ID` in your `.env` file is set to the correct Google Sheet ID, and then run:

```bash
npm run import:proyectos
```

## Troubleshooting

If you encounter any issues, you can try the following commands:

- **Reset `node_modules` and `package-lock.json`:**
  ```bash
  # For macOS and Linux
  rm -rf node_modules package-lock.json
  
  # For Windows PowerShell
  Remove-Item -Recurse -Force node_modules
  Remove-Item -Force package-lock.json
  
  npm install
  ```

- **Reset the database:**
  ```bash
  npx prisma migrate reset
  ```

- **Reset the Next.js cache:**
  ```bash
  # For macOS and Linux
  rm -rf .next
  
  # For Windows PowerShell
  Remove-Item -Recurse -Force .next
  
  npm run dev
  ```

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.