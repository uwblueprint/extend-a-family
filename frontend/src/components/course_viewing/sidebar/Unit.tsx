import { useSortable } from "@dnd-kit/sortable";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import {
  ListItem,
  ListItemButton,
  ListItemText,
  useTheme,
  IconButton,
} from "@mui/material";
import { MoreHoriz } from "@mui/icons-material";
import { CourseUnit } from "../../../types/CourseTypes";
import { Role } from "../../../types/AuthTypes";

interface UnitProps {
  index: number;
  unit: CourseUnit;
  courseLength: number;
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  handleListItemClick: (event: any, index: number) => void;
  handleContextMenuOpen: (event: any, unit: CourseUnit) => void;
  selectedIndex: number;
  userRole: Role;
  rearrangeUnitsMode: boolean;
  isAdmin: boolean;
}

export default function Unit({
  index,
  unit,
  handleListItemClick,
  selectedIndex,
  userRole,
  rearrangeUnitsMode,
  handleContextMenuOpen,
  isAdmin,
}: UnitProps) {
  const { id } = unit;
  const { attributes, listeners, setNodeRef, transition } = useSortable({ id });

  const style = {
    transition,
  };

  const theme = useTheme();

  return (
    <ListItem
      key={unit.id}
      ref={setNodeRef}
      style={style}
      /* eslint-disable react/jsx-props-no-spreading */
      {...attributes}
      sx={{
        borderBottom: 1,
        borderColor: theme.palette.Neutral[300],
        backgroundColor:
          selectedIndex === index && !rearrangeUnitsMode
            ? theme.palette[userRole].Light.Selected
            : "transparent",
        "&:hover": {
          backgroundColor: theme.palette[userRole].Light.Hover,
        },
        display: "flex",
        height: "60px",
        ...(rearrangeUnitsMode
          ? { padding: "0 8px 0 16px" }
          : { padding: "0 8px 0 32px" }),
        alignItems: "center",
        gap: "8px",
        alignSelf: "stretch",
      }}
      onClick={
        !rearrangeUnitsMode
          ? (event) => handleListItemClick(event, index)
          : undefined
      }
    >
      <ListItemButton
        key={unit.id}
        sx={{
          "&:hover": {
            backgroundColor: "transparent",
          },
          padding: "0",
        }}
      >
        {isAdmin && rearrangeUnitsMode && (
          <IconButton
            edge="start"
            /* eslint-disable react/jsx-props-no-spreading */
            {...listeners}
          >
            <DragIndicatorIcon />
          </IconButton>
        )}
        <ListItemText
          disableTypography
          primary={
            <span style={{ display: "flex", gap: "16px" }}>
              <span>{index + 1}.</span>
              <span>{unit.title}</span>
            </span>
          }
          sx={{
            ...(selectedIndex === index && !rearrangeUnitsMode
              ? theme.typography.titleSmall
              : theme.typography.bodyMedium),
            color: theme.palette.Neutral[700],
          }}
        />
        {isAdmin && !rearrangeUnitsMode && selectedIndex === index && (
          <IconButton
            edge="start"
            onClick={(event) => {
              event.stopPropagation(); // Prevent triggering the list item click
              handleContextMenuOpen(event, unit); // Custom function to handle button click
            }}
            sx={{ marginLeft: "16px" }}
          >
            <MoreHoriz />
          </IconButton>
        )}
      </ListItemButton>
    </ListItem>
  );
}
