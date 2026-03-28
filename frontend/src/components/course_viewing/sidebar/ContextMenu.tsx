import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import {
  Divider,
  ListItemIcon,
  Menu,
  MenuItem,
  Typography,
  useTheme,
} from "@mui/material";
import { UnitSidebarModalType } from "../../../types/CourseTypes";

interface ContextMenuProps {
  anchorEl: Element | null;
  onClose: () => void;
  onModalOpen: (action: string) => void;
}

const ContextMenu = ({ anchorEl, onClose, onModalOpen }: ContextMenuProps) => {
  const theme = useTheme();
  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={onClose}
      sx={{
        padding: "0px",
        margin: "0px",
      }}
      MenuListProps={{
        sx: {
          py: 0,
          backgroundColor: theme.palette.Neutral[200],
          paddingTop: "8px",
          paddingBottom: "8px",
        },
      }}
    >
      <MenuItem
        sx={{
          height: "48px",
        }}
        onClick={() => onModalOpen(UnitSidebarModalType.Edit)}
      >
        <ListItemIcon>
          <EditOutlinedIcon
            fontSize="small"
            htmlColor={theme.palette.Neutral[700]}
          />
        </ListItemIcon>
        <Typography variant="bodyMedium">Edit Title</Typography>
      </MenuItem>
      <Divider component="li" />
      <MenuItem
        sx={{
          height: "48px",
        }}
        onClick={() => onModalOpen(UnitSidebarModalType.Move)}
      >
        <ListItemIcon>
          <MoveDownIcon
            fontSize="small"
            htmlColor={theme.palette.Neutral[700]}
          />
        </ListItemIcon>
        <Typography variant="bodyMedium">Move</Typography>
      </MenuItem>
      <Divider component="li" />
      <MenuItem
        onClick={() => onModalOpen(UnitSidebarModalType.Delete)}
        sx={{
          height: "48px",
        }}
      >
        <ListItemIcon>
          <DeleteOutlineIcon
            fontSize="small"
            htmlColor={theme.palette.Error.Dark.Default}
          />
        </ListItemIcon>
        <Typography
          variant="bodyMedium"
          noWrap
          color={theme.palette.Error.Dark.Default}
        >
          Delete
        </Typography>
      </MenuItem>
    </Menu>
  );
};

export default ContextMenu;
