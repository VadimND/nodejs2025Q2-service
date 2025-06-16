import { LoggerService } from '../logger.service';

export const addErrorListeners = (logger: LoggerService): void => {
  process
    .on('unhandledRejection', async (event) => {
      try {
        logger.error(`Unhandled Rejection. ${event}`);
      } catch (err) {
        console.error('Failed to log unhandled rejection:', err.message);
      }
    })
    .on('uncaughtException', async (event) => {
      try {
        logger.error(`Uncaught Exception. ${event}`);
      } catch (err) {
        console.error('Failed to log uncaught exception:', err.message);
      } finally {
        process.exit(1);
      }
    });
};
