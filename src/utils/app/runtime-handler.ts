import * as dotenv from 'dotenv';

export const setupGlobalErrorHandlers = () => {
  dotenv.config();
  if (process.env.NODE_ENV === 'local') {
    process.on('uncaughtException', (err) => {
      console.error('Uncaught Exception:', err.message);
      console.error(err.stack);
      process.exit(1);
    });

    process.on('unhandledRejection', (reason, promise) => {
      console.error('Unhandled Rejection at:', promise, 'reason:', reason);
      process.exit(1);
    });
  }
};
