import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import { createServer } from "http";
import { Server } from "socket.io";
import RateLimit from "express-rate-limit";
import * as firebaseAdmin from "firebase-admin";
import * as firebaseAuth from "@firebase/auth"
import * as firebase from "firebase/app";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";

import { mongo } from "./models";
import authRouter from "./rest/authRoutes";
import entityRouter from "./rest/entityRoutes";
import userRouter from "./rest/userRoutes";
import {
  registerNotificationHandlers,
  registerNotificationSchemaListener,
} from "./sockets/notification";
import helpRequestRouter from "./rest/helpRequestRoutes";
import notificationRouter from "./rest/notificationRoutes";
import courseRouter from "./rest/courseRoutes";

const CORS_ALLOW_LIST = [
  "http://localhost:3000",
  "https://uw-blueprint-starter-code.firebaseapp.com",
  "https://uw-blueprint-starter-code.web.app",
  /^https:\/\/uw-blueprint-starter-code--pr.*\.web\.app$/,
];

const CORS_OPTIONS: cors.CorsOptions = {
  origin: CORS_ALLOW_LIST,
  credentials: true,
};

const swaggerDocument = YAML.load("swagger.yml");

const defaultMinuteRateLimit = parseInt(
  process.env.BACKEND_API_DEFAULT_PER_MINUTE_RATE_LIMIT || "15",
  10,
);
const limiter = RateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: defaultMinuteRateLimit,
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

const app = express();

const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: CORS_ALLOW_LIST,
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  const { userId } = socket.handshake.query;
  // so we can use mongodb id as the key to emit to instead
  if (!userId && typeof userId !== "string") return;
  socket.join(userId);
  registerNotificationHandlers(io, socket);
});

registerNotificationSchemaListener(io);

app.use(cookieParser());
app.use(cors(CORS_OPTIONS));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(limiter);

app.use("/auth", authRouter);
app.use("/entities", entityRouter);
app.use("/users", userRouter);
app.use("/help-request", helpRequestRouter);
app.use("/notifications", notificationRouter);
app.use("/course", courseRouter);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.set("io", io);

mongo.connect();

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

server.listen({ port: process.env.PORT || 8080 }, () => {
  /* eslint-disable-next-line no-console */
  console.info(`Server is listening on port ${process.env.PORT || 8080}!`);
});
