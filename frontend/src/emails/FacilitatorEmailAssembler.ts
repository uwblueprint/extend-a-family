import fs from "fs";
import path from "path";

import {
  buildFacilitatorEmailNotificationTemplate,
} from "./FacilitatorEmailNotificationTemplate";

import {
  buildSingleMessage,
} from "./SingleMessageTemplate";

import {
  buildMultiMessage,
} from "./MultiMessageTemplate";

/* ----------------------------------
   MULTI MESSAGE #1
----------------------------------- */

const multiMessageHTML1 = buildMultiMessage({
  learnerProfilePicture: "https://i.pinimg.com/736x/cd/97/f1/cd97f101e2603a65a826b184aa4ab58a.jpg",
  learnerName: "Jotaro Kujo",
  messageBody: `
    <p style="margin: 0">
      ORA ORA ORA ORA ORA ORA ORA
    </p>
  `,
  moduleLink: "https://example.com/modules/2",
  moduleNumber: "2",
  moduleName: "Neural Networks",
  modulePage: "Lesson 1",
  messageDate: "March 13",
  messageTime: "10:15 AM",
  respondLink: "https://example.com/respond/2",
});

/* ----------------------------------
   MULTI MESSAGE #2
----------------------------------- */

const multiMessageHTML2 = buildMultiMessage({
  learnerProfilePicture: "https://i.redd.it/joseph-old-design-vs-new-v0-ny1f6jx4ut3f1.jpg?width=735&format=pjpg&auto=webp&s=a48a302a789a75adfbbc1caeebee0298f60daaac",
  learnerName: "Joseph Joestar",
  messageBody: `
    <p style="margin: 0">
      Your next line is "what a great email template!"
    </p>
  `,
  moduleLink: "https://example.com/modules/3",
  moduleNumber: "3",
  moduleName: "Model Evaluation",
  modulePage: "Lesson 2",
  messageDate: "March 13",
  messageTime: "1:40 PM",
  respondLink: "https://example.com/respond/3",
});

/* ----------------------------------
   SINGLE MESSAGE
----------------------------------- */

const singleMessageHTML = buildSingleMessage({
  messageBody: `
    <p style="margin: 0">
      Father?? Is that you?? - Giorno Giovanna
    </p>
  `,
  moduleLink: "https://example.com/modules/1",
  moduleNumber: "1",
  moduleName: "Introduction to AI",
  modulePage: "Lesson 3",
  messageDate: "March 14",
  messageTime: "2:45 PM",
  respondLink: "https://example.com/respond/1",
});

/* ----------------------------------
   COMBINE MESSAGE BLOCK
----------------------------------- */

const messageBlockHTML = `
  ${multiMessageHTML1}
  ${multiMessageHTML2}
  ${singleMessageHTML}
`;

/* ----------------------------------
   INTRO SENTENCE LOGIC
----------------------------------- */

const messageCount: number = 3;

const introSentence =
  messageCount === 1
    ? "You have one new message from Giorno Giovanna"
    : `You have ${messageCount} new messages`;

/* ----------------------------------
   BUILD FULL EMAIL
----------------------------------- */

const fullEmailHTML = buildFacilitatorEmailNotificationTemplate({
  EAFLogo: "https://www.eafwr.on.ca/wp-content/uploads/2016/09/EAFWR_NEW_LOGO-OL.png",
  facilitatorName: "Dio Brando",
  introSentence,
  emailSettingsLink: "https://example.com/email-settings",
  messageBlock: messageBlockHTML,
});

/* ----------------------------------
   WRITE PREVIEW FILE
----------------------------------- */

const outputPath = path.join(__dirname, "preview.html");
fs.writeFileSync(outputPath, fullEmailHTML);

console.log("✅ Email preview written to:", outputPath);
