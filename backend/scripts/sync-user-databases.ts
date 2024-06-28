import * as firebaseAdmin from "firebase-admin";
import dotenv from "dotenv";
import MgUser, { User } from "../models/user.mgmodel";
import logger from "../utilities/logger";
import { getErrorMessage } from "../utilities/errorUtils";
import { mongo } from "../models";

dotenv.config();

const Logger = logger(__filename);

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert({
    projectId: process.env.FIREBASE_PROJECT_ID,
    privateKey: process.env.FIREBASE_SVC_ACCOUNT_PRIVATE_KEY?.replace(
      /\\n/g,
      "\n",
    ),
    clientEmail: process.env.FIREBASE_SVC_ACCOUNT_CLIENT_EMAIL,
  }),
});

mongo.connect();

async function getAllFirebaseUsers(
  nextPageToken?: string,
): Promise<firebaseAdmin.auth.UserRecord[]> {
  const listUsersResult = await firebaseAdmin
    .auth()
    .listUsers(1000, nextPageToken);
  const { users } = listUsersResult;

  // If there are more users to fetch, recursively fetch them.
  if (listUsersResult.pageToken) {
    const moreUsers = await getAllFirebaseUsers(listUsersResult.pageToken);
    return users.concat(moreUsers);
  }
  return users;
}

async function getUsersNotInMongoDB(
  allFirebaseUsers: firebaseAdmin.auth.UserRecord[],
  allMongoDBUsers: User[],
): Promise<string[]> {
  // We are checking Firebase for all the MongoDB users not in there

  const allFirebaseUserIds = allFirebaseUsers.map((user) => user.uid);
  const allMongoDBUserIds = new Set(allMongoDBUsers.map((user) => user.authId));

  // put in the ! to not delete the wrong people
  return allFirebaseUserIds.filter((id) => !allMongoDBUserIds.has(id));
}

async function getUsersNotInFirebase(
  allFirebaseUsers: firebaseAdmin.auth.UserRecord[],
  allMongoDBUsers: User[],
) {
  // We are checking MongoDB for all the Firebase users not in there
  const allFirebaseUserIds = new Set(allFirebaseUsers.map((user) => user.uid));
  const allMongoDBUserIds = allMongoDBUsers.map((user) => user.authId);
  // put in the ! to not delete the wrong people
  return allMongoDBUserIds.filter((id) => !allFirebaseUserIds.has(id));
}

async function main() {
  try {
    const allFirebaseUsers = await getAllFirebaseUsers();
    Logger.info(`Found ${allFirebaseUsers.length} firebase users`);

    const allMongoDBUsers = await MgUser.find();
    Logger.info(`Found ${allMongoDBUsers.length} MongoDB users`);

    const removeMongoDBUsers = await getUsersNotInMongoDB(
      allFirebaseUsers,
      allMongoDBUsers,
    );
    const removeFirebaseUsers = await getUsersNotInFirebase(
      allFirebaseUsers,
      allMongoDBUsers,
    );

    // Comment if you dont actually want to delete

    removeMongoDBUsers.forEach(async (id) => {
      await MgUser.deleteOne({ authId: id });
    });

    removeFirebaseUsers.forEach(async (id) => {
      await firebaseAdmin.auth().deleteUser(id);
    });
    Logger.info(
      `Deleted ${removeMongoDBUsers.length} MongoDB users and ${removeFirebaseUsers.length} Firebase users`,
    );
    process.exit();
  } catch (error: unknown) {
    Logger.error(getErrorMessage(error));
    throw error;
  }
}

main();
