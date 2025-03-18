import React, { useState } from "react";
import {
  Box,
  Button,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Paper,
  Typography,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import AddIcon from "@mui/icons-material/Add";
import { CourseUnit } from "../../types/CourseTypes";
import { useUser } from "../../hooks/useUser";

enum ModalType {
  Create = "Create",
  Delete = "Delete",
  Unpublish = "Unpublish",
  Edit = "Edit",
}
interface UnitSideBarProps {
  courseUnits: CourseUnit[];
  handleClose: () => void;
  handleOpenCreateUnitModal: () => void;
  handleOpenEditUnitModal: () => void;
  handleOpenDeleteUnitModal: () => void;
  handleOpenUnpublishUnitModal: () => void;
  open: boolean;
  onSelectUnit: (unit: CourseUnit) => void;
}

export default function UnitSidebar(props: UnitSideBarProps) {
  const theme = useTheme();
  const user = useUser();
  const {
    courseUnits,
    handleClose,
    open,
    onSelectUnit,
    handleOpenCreateUnitModal,
    handleOpenEditUnitModal,
    handleOpenDeleteUnitModal,
    handleOpenUnpublishUnitModal,
  } = props;

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openContextMenu = Boolean(anchorEl);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleContextMenuOpen = (event: any) => {
    setAnchorEl(event.currentTarget);
  };
  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenModal = (action: string) => {
    handleContextMenuClose();
    switch (action) {
      case ModalType.Create:
        handleOpenCreateUnitModal();
        break;
      case ModalType.Delete:
        handleOpenDeleteUnitModal();
        break;
      case ModalType.Unpublish:
        handleOpenUnpublishUnitModal();
        break;
      case ModalType.Edit:
        handleOpenEditUnitModal();
        break;
      default:
    }
  };

  const ContextMenu = () => {
    return (
      <Paper
        sx={{
          width: "250px",
          maxHeight: "243px",
          height: "100%",
          borderRadius: "4px",
          backgroundColor: theme.palette.Neutral[200],
        }}
      >
        <Menu
          anchorEl={anchorEl}
          open={openContextMenu}
          onClose={handleContextMenuClose}
          sx={{
            padding: "0px",
            margin: "0px",
            backgroundColor: theme.palette.Neutral[200],
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
          >
            <ListItemIcon>
              <OpenInNewIcon
                fontSize="small"
                htmlColor={theme.palette.Neutral[700]}
              />
            </ListItemIcon>
            <Typography variant="bodyMedium">View Feedback</Typography>
          </MenuItem>
          <Divider component="li" />
          <MenuItem
            sx={{
              height: "48px",
            }}
          >
            <ListItemIcon>
              <FileUploadOutlinedIcon
                fontSize="small"
                htmlColor={theme.palette.Neutral[700]}
              />
            </ListItemIcon>
            <Typography variant="bodyMedium">Upload Thumbnail</Typography>
          </MenuItem>
          <Divider component="li" />
          <MenuItem
            sx={{
              height: "48px",
            }}
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
            sx={{
              height: "48px",
            }}
            onClick={() => handleOpenModal(ModalType.Unpublish)}
          >
            <ListItemIcon>
              <VisibilityOffIcon
                fontSize="small"
                htmlColor={theme.palette.Neutral[700]}
              />
            </ListItemIcon>
            <Typography variant="bodyMedium" noWrap>
              Unpublish
            </Typography>
          </MenuItem>
          <Divider component="li" />
          <MenuItem
            onClick={() => handleOpenModal(ModalType.Delete)}
            sx={{
              height: "48px",
            }}
          >
            <ListItemIcon>
              <DeleteOutlineIcon
                fontSize="small"
                htmlColor={theme.palette.Neutral[700]}
              />
            </ListItemIcon>
            <Typography
              variant="bodyMedium"
              noWrap
              color={theme.palette.Error.Default}
            >
              Delete
            </Typography>
          </MenuItem>
        </Menu>
      </Paper>
    );
  };
  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    onSelectUnit(courseUnits[index]);
  };

  return (
    <Drawer
      sx={{
        maxWidth: "301px",
        width: "100%",
        height: "100%",
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          boxSizing: "border-box",
          position: "relative",
        },
        display: open ? "block" : "none",
      }}
      variant="persistent"
      anchor="left"
      open={open}
    >
      <Box
        height="100%"
        sx={{ backgroundColor: theme.palette[user.role].Light }}
      >
        <Box
          height="59px"
          display="flex"
          p="12px"
          paddingLeft="20px"
          alignItems="center"
          justifyContent="space-between"
          fontWeight="700"
          fontSize="16px"
        >
          Units
          <Button
            type="button"
            sx={{
              p: "8px",
              fontSize: "12px",
              color: theme.palette.Neutral[700],
              lineHeight: "1.5",
            }}
            endIcon={<MenuOpenIcon />}
            onClick={handleClose}
          >
            Close
          </Button>
        </Box>
        <ContextMenu />
        <List sx={{ width: "100%" }}>
          {courseUnits.map((course, index) => {
            return (
              <ListItem
                key={course.id}
                disablePadding
                sx={{
                  borderBottom: 1,
                  borderColor:
                    index !== courseUnits.length - 1
                      ? "#DBE4E7"
                      : "transparent",
                }}
              >
                <ListItemButton
                  key={course.id}
                  sx={{
                    py: "15px",
                    px: "32px",
                    backgroundColor:
                      selectedIndex === index
                        ? theme.palette[user.role].Hover
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette[user.role].Hover,
                    },
                  }}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemText
                    disableTypography
                    primary={`${course.displayIndex}. ${course.title}`}
                    sx={
                      selectedIndex === index
                        ? theme.typography.titleMedium
                        : theme.typography.bodyLarge
                    }
                  />
                  <IconButton
                    edge="end"
                    onClick={(event) => {
                      event.stopPropagation(); // Prevent triggering the list item click
                      handleContextMenuOpen(event); // Custom function to handle button click
                    }}
                    sx={{ marginLeft: "16px" }}
                  >
                    <MoreVertIcon />
                  </IconButton>
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        <Button
          variant="contained"
          onClick={handleOpenCreateUnitModal}
          disableElevation
          startIcon={<AddIcon />}
          sx={{
            width: "100%",
            height: "40px",
            maxWidth: "236px",
            backgroundColor: theme.palette.Administrator.Default,
            alignItems: "center",
            marginTop: "24px",
            marginBottom: "24px",
            marginLeft: "32px",
            marginRight: "32px",
          }}
        >
          <Typography
            variant="labelLarge"
            style={{
              color: theme.palette.Neutral[100],
            }}
          >
            Create Unit
          </Typography>
        </Button>
      </Box>
    </Drawer>
  );
}
