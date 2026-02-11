import * as React from "react";
import ActivityAPIClient from "../../../../APIClients/ActivityAPIClient";
import { useLearner } from "../../../../hooks/useUser";
import DidYouLikeTheContentSlide from "./DidYouLikeTheContent";
import HowEasyWasTheModuleSlide from "./HowEasyWasTheModule";
import ThanksForTheFeedbackSlide from "./ThanksForTheFeedback";
import WhatDidYouThink from "./WhatDidYouThink";

enum SurveyFormStage {
  DidYouLikeTheContent = "DidYouLikeTheContent",
  HowEasyWasTheModule = "HowEasyWasTheModule",
  WhatDidYouThinkOfTheModule = "WhatDidYouThinkOfTheModule",
  ThanksForTheFeedback = "ThanksForTheFeedback",
}

const SurveySlides = ({ moduleId }: { moduleId: string }) => {
  const [formStage, setFormStage] = React.useState<SurveyFormStage>(
    SurveyFormStage.DidYouLikeTheContent,
  );

  const [contentLiked, setContentLiked] = React.useState<boolean | undefined>();
  const [moduleEaseRating, setModuleEaseRating] = React.useState<
    number | undefined
  >();
  const [moduleFeedbackText, setModuleFeedbackText] =
    React.useState<string>("");
  const { id: learnerId } = useLearner();
  const [filledOut, setFilledOut] = React.useState<boolean>(false);
  const [isLoading, setIsLoading] = React.useState<boolean>(true);

  React.useEffect(() => {
    const checkFeedbackStatus = async () => {
      try {
        const hasFeedback = await ActivityAPIClient.hasFeedback(
          learnerId,
          moduleId,
        );
        setFilledOut(hasFeedback);
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error("Error checking feedback status:", error);
      } finally {
        setIsLoading(false);
      }
    };
    checkFeedbackStatus();
  }, [learnerId, moduleId]);

  const submitFeedback = async () => {
    await ActivityAPIClient.sendFeedback({
      learnerId,
      moduleId,
      isLiked: contentLiked,
      difficulty: moduleEaseRating,
      message: moduleFeedbackText,
    });
    setFilledOut(true);
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (filledOut) {
    return <ThanksForTheFeedbackSlide />;
  }

  switch (formStage) {
    case SurveyFormStage.DidYouLikeTheContent:
      return (
        <DidYouLikeTheContentSlide
          contentLiked={contentLiked}
          setContentLiked={(liked: boolean) => {
            setContentLiked(liked);
            setTimeout(() => {
              setFormStage(SurveyFormStage.HowEasyWasTheModule);
            }, 750);
          }}
        />
      );
    case SurveyFormStage.HowEasyWasTheModule:
      return (
        <HowEasyWasTheModuleSlide
          rating={moduleEaseRating}
          onRatingChange={(value: number) => {
            setModuleEaseRating(value);
            setTimeout(() => {
              setFormStage(SurveyFormStage.WhatDidYouThinkOfTheModule);
            }, 750);
          }}
        />
      );
    case SurveyFormStage.WhatDidYouThinkOfTheModule:
      return (
        <WhatDidYouThink
          text={moduleFeedbackText}
          onChange={setModuleFeedbackText}
          onSubmit={() => {
            setFormStage(SurveyFormStage.ThanksForTheFeedback);
            submitFeedback();
          }}
        />
      );
    case SurveyFormStage.ThanksForTheFeedback:
      return <ThanksForTheFeedbackSlide />;
    default:
      return <div>Default</div>;
  }
};

export default SurveySlides;
