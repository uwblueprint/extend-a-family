import dotenv from "dotenv";
import { mongo } from "../models";
import CourseModuleModel from "../models/coursemodule.mgmodel";
import CoursePageModel from "../models/coursepage.mgmodel";
import { getErrorMessage } from "../utilities/errorUtils";
import logger from "../utilities/logger";

dotenv.config();

const Logger = logger(__filename);

mongo.connect();

const MODULE_ID = "67c664c090cf9975f2a845ca";
const PDF_URL =
  "https://firebasestorage.googleapis.com/v0/b/extendafamily-7613e.appspot.com/o/course%2Fpdfs%2Fmodule-67c664c090cf9975f2a845ca.pdf?alt=media&token=de0abefe-887a-46d5-9da4-ab5c75b7c559";

async function main() {
  try {
    // Find the module
    const module = await CourseModuleModel.findById(MODULE_ID);

    if (!module) {
      Logger.error(`Module with ID ${MODULE_ID} not found`);
      process.exit(1);
    }

    Logger.info(`Found module: ${module.title}`);
    Logger.info(`Module has ${module.pages.length} pages`);

    // First, let's see what types of pages we have
    const allPages = await CoursePageModel.find({ _id: { $in: module.pages } });
    Logger.info(`\nPage types in module:`);
    const pageTypeCounts: Record<string, number> = {};
    allPages.forEach((page) => {
      const pageType = (page as any).type || "unknown";
      pageTypeCounts[pageType] = (pageTypeCounts[pageType] || 0) + 1;
    });
    Object.entries(pageTypeCounts).forEach(([type, count]) => {
      Logger.info(`  - ${type}: ${count} pages`);
    });

    // Update all pages in the module using native MongoDB collection
    const { collection } = CoursePageModel as any;
    const updateResult = await collection.updateMany(
      { _id: { $in: module.pages } },
      { $set: { pdfUrl: PDF_URL } },
    );

    Logger.info(
      `\nUpdate result: matched ${updateResult.matchedCount}, modified ${updateResult.modifiedCount}`,
    );
    Logger.info(`Set pdfUrl to: ${PDF_URL}`);

    // Verify the updates
    const updatedPages = await CoursePageModel.find({
      _id: { $in: module.pages },
    });
    Logger.info(`\nVerification - Pages in module ${MODULE_ID}:`);
    updatedPages.forEach((page) => {
      Logger.info(
        `  - [${(page as any).type}] ${page.title}: pdfUrl = ${
          (page as any).pdfUrl || "NOT SET"
        }`,
      );
    });

    process.exit(0);
  } catch (error: unknown) {
    Logger.error(getErrorMessage(error));
    throw error;
  }
}

main();
