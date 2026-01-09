import { RadioButtonChecked, RadioButtonUnchecked } from "@mui/icons-material";
import { Box, SxProps, Typography, useTheme } from "@mui/material";

const DifficultyText = ({ text, sx }: { text: string; sx?: SxProps }) => {
  const theme = useTheme();
  return (
    <Typography
      sx={{
        color: theme.palette.Neutral[600],
        textAlign: "center",
        fontFamily: "Lexend Deca",
        fontSize: "27px",
        fontStyle: "normal",
        fontWeight: 400,
        lineHeight: "140%" /* 37.8px */,
        letterSpacing: "0.6px",
        ...sx,
      }}
    >
      {text}
    </Typography>
  );
};

const RatingRadioButton = ({
  value,
  selected,
  onClick,
}: {
  value: number;
  selected: boolean;
  onClick: () => void;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        padding: "18px",
        flexDirection: "column",
        alignItems: "center",
        gap: "12px",
      }}
    >
      {selected ? (
        <RadioButtonChecked
          sx={{
            fontSize: "54px",
            color: theme.palette.Learner.Dark.Default,
          }}
        />
      ) : (
        <RadioButtonUnchecked
          sx={{
            fontSize: "54px",
          }}
          onClick={onClick}
        />
      )}
      <DifficultyText text={`${value}`} />
    </Box>
  );
};

const HowEasyWasTheModuleSlide = ({
  rating,
  onRatingChange,
}: {
  rating: number | undefined;
  onRatingChange: (value: number) => void;
}) => {
  const theme = useTheme();
  return (
    <Box
      sx={{
        display: "flex",
        padding: "183px 75px",
        justifyContent: "center",
        alignItems: "center",
      }}
      bgcolor={theme.palette.Learner.Light.Default}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "30px",
        }}
      >
        <Typography
          variant="displayMedium"
          color={theme.palette.Learner.Dark.Default}
        >
          How easy was the module?
        </Typography>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <DifficultyText
            text="Very Hard"
            sx={{ width: "81px", flexShrink: 0 }}
          />
          {[1, 2, 3, 4, 5].map((value) => (
            <RatingRadioButton
              key={value}
              value={value}
              selected={rating === value}
              onClick={() => onRatingChange(value)}
            />
          ))}
          <DifficultyText
            text="Very Easy"
            sx={{ width: "81px", flexShrink: 0 }}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default HowEasyWasTheModuleSlide;
