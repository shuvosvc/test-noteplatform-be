const app = require('./src/app');
const connectDatabase = require('./src/config/database');
const environment = require('./src/config/environment');

const startApplication = async () => {
  try {
    await connectDatabase();
    console.log(`Connected to database successfully`);

    if (process.env.NODE_ENV !== 'test' && !process.env.VERCEL) {
      app.listen(environment.PORT, () => {
        console.log(`Server is running on port ${environment.PORT}`);
      });
    }
  } catch (error) {
    console.error(`Database connection error:`, error.message);
    if (!process.env.VERCEL) {
      process.exit(1);
    }
  }
};

startApplication();

module.exports = app;
