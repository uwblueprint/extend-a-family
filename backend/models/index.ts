import mongoose from "mongoose";
import { getErrorMessage } from "../utilities/errorUtils";

/* eslint-disable-next-line import/prefer-default-export */
export const mongo = {
  connect: async (): Promise<void> => {
    try {
      const dbName = process.env.MG_DATABASE_NAME;
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      await mongoose.connect(encodeURI(process.env.MG_DATABASE_URL!), {
        dbName,
      });
      /* eslint-disable-next-line no-console */
      console.info(`Successfully connected to MongoDB (${dbName})!`);
    } catch (error) {
      /* eslint-disable-next-line no-console */
      console.error(`Error connecting to MongoDB: ${getErrorMessage(error)}`);
    }
  },
};
