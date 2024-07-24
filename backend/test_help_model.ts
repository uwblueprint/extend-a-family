import mongoose from "mongoose";
import dotenv from "dotenv";
import { mongo } from "./models";
import { Facilitator, Learner } from "./models/user.mgmodel";
import MgHelpRequest from "./models/helprequest.mgmodel";
import MgCourseUnit from "./models/courseunit.mgmodel";

dotenv.config();

async function runTests() {
  // eslint-disable-next-line no-console
  console.log("Running help request tests");
  // Connect to MongoDB
  await mongo.connect();

  try {
    // await UserModel.deleteMany({});

    const facilitator = new Facilitator({
      firstName: "John",
      lastName: "Doe",
      authId: "123",
      role: "Facilitator",
      learners: ["learner1", "learner2"],
      status: "Active",
    });
    await facilitator.save();

    const learner = new Learner({
      firstName: "Jane",
      lastName: "Smith",
      authId: "456",
      role: "Learner",
      facilitator: "123",
      status: "Active",
    });
    await learner.save();

    await MgCourseUnit.create({
      displayIndex: 1,
      title: "Fake title",
      modules: [
        {
          title: "Module 1",
          pages: [{ title: "Page 1", type: "Activity", layout: [] }],
        },
      ],
    });

    await MgHelpRequest.create({
      message: "send help plz",
      learner: learner.id,
      facilitator: facilitator.id,
      unit: 1, // now is this the displayIndex or is this the array index?
      module: 0, // thse two are definitely the array index
      page: 0,
    });
  } finally {
    await mongoose.disconnect();
  }
}

// eslint-disable-next-line no-console
runTests().catch((error) => console.error("Error running tests:", error));
