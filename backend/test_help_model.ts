import mongoose from "mongoose";
import dotenv from "dotenv";
import { mongo } from "./models";
import UserModel, { Facilitator, Learner } from "./models/user.mgmodel";
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
    });
    await facilitator.save();

    const learner = new Learner({
      firstName: "Jane",
      lastName: "Smith",
      authId: "456",
      role: "Learner",
      facilitator: "123",
    });
    await learner.save();

    const CourseUnit = await MgCourseUnit.create({
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
      learner,
      facilitator,
      unit: CourseUnit.id,
      module: CourseUnit.modules[0].id,
      page: CourseUnit.modules[0].pages[0].id,
    });
  } finally {
    await mongoose.disconnect();
  }
}

// eslint-disable-next-line no-console
runTests().catch((error) => console.error("Error running tests:", error));
