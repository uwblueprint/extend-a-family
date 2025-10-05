import * as React from "react";
import DidYouLikeTheContentSlide from "./DidYouLikeTheContent";
import HowEasyWasTheModuleSlide from "./HowEasyWasTheModule";

enum SurveyFormStage {
  DidYouLikeTheContent = "DidYouLikeTheContent",
  HowEasyWasTheModule = "HowEasyWasTheModule",
  WhatDidYouThinkOfTheModule = "WhatDidYouThinkOfTheModule",
  ThanksForTheFeedback = "ThanksForTheFeedback",
  Congratulations = "Congratulations",
}

const SurveySlides = () => {
  const [formStage, setFormStage] = React.useState<SurveyFormStage>(
    SurveyFormStage.DidYouLikeTheContent,
  );

  const [contentLiked, setContentLiked] = React.useState<boolean | undefined>();
  const [moduleEaseRating, setModuleEaseRating] = React.useState<
    number | undefined
  >();

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
      return <div>WhatDidYouThinkOfTheModule</div>;
    case SurveyFormStage.ThanksForTheFeedback:
      return <div>ThanksForTheFeedback</div>;
    case SurveyFormStage.Congratulations:
      return <div>Congratulations</div>;
    default:
      return <div>Default</div>;
  }
};

export default SurveySlides;
