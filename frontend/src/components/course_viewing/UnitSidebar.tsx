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
  Typography,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import MoveDownIcon from "@mui/icons-material/MoveDown";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AddIcon from "@mui/icons-material/Add";
import { CourseUnit } from "../../types/CourseTypes";
import { useUser } from "../../hooks/useUser";
import { isAdministrator } from "../../types/UserTypes";
import CreateUnitModal from "./modals/CreateUnitModal";
import EditUnitModal from "./modals/EditUnitModal";
import DeleteUnitModal from "./modals/DeleteUnitModal";
import CourseAPIClient from "../../APIClients/CourseAPIClient";

enum ModalType {
  Create = "Create",
  Delete = "Delete",
  Edit = "Edit",
}
interface UnitSideBarProps {
  courseUnits: CourseUnit[];
  setCourseUnits: React.Dispatch<React.SetStateAction<CourseUnit[]>>;
  handleClose: () => void;
  open: boolean;
  onSelectUnit: (unit: CourseUnit) => void;
}

export default function UnitSidebar({
  courseUnits,
  setCourseUnits,
  handleClose,
  open,
  onSelectUnit,
}: UnitSideBarProps) {
  const theme = useTheme();
  const user = useUser();

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const openContextMenu = Boolean(anchorEl);

  const [contextMenuUnit, setContextMenuUnit] = useState<CourseUnit | null>();
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(false);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleContextMenuOpen = (event: any, unit: CourseUnit) => {
    setAnchorEl(event.currentTarget);
    setContextMenuUnit(unit);
  };
  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  const createUnit = async (title: string) => {
    const unit = await CourseAPIClient.createUnit(title);
    if (unit) {
      setCourseUnits((prev) => [...prev, unit]);
    }
  };
  const editUnit = async (title: string) => {
    if (contextMenuUnit) {
      const editedUnit = await CourseAPIClient.editUnit(
        contextMenuUnit.id,
        title,
      );
      if (editedUnit) {
        setCourseUnits((prev) =>
          prev.map((unit) => (unit.id === editedUnit.id ? editedUnit : unit)),
        );
      }
    }
  };
  const deleteUnit = async () => {
    if (contextMenuUnit) {
      const deletedUnitId = await CourseAPIClient.deleteUnit(
        contextMenuUnit.id,
      );
      if (deletedUnitId) {
        setCourseUnits((prev) =>
          prev.filter((unit) => unit.id !== deletedUnitId),
        );
      }
    }
  };

  const handleOpenCreateUnitModal = () => {
    setOpenCreateUnitModal(true);
  };
  const handleCloseCreateUnitModal = () => {
    setOpenCreateUnitModal(false);
  };

  const handleOpenEditUnitModal = () => {
    setOpenEditUnitModal(true);
  };
  const handleCloseEditUnitModal = () => {
    setOpenEditUnitModal(false);
  };

  const handleOpenDeleteUnitModal = () => {
    setOpenDeleteUnitModal(true);
  };
  const handleCloseDeleteUnitModal = () => {
    setOpenDeleteUnitModal(false);
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
      case ModalType.Edit:
        handleOpenEditUnitModal();
        break;
      default:
    }
  };

  const ContextMenu = () => {
    return (
      <Menu
        anchorEl={anchorEl}
        open={openContextMenu}
        onClose={handleContextMenuClose}
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
          onClick={() => handleOpenModal(ModalType.Edit)}
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
          onClick={() => handleOpenModal(ModalType.Delete)}
          sx={{
            height: "48px",
          }}
        >
          <ListItemIcon>
            <DeleteOutlineIcon
              fontSize="small"
              htmlColor={theme.palette.Error.Default}
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
        sx={{
          backgroundColor: theme.palette[user.role].Light,
          overflowX: "hidden",
        }}
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
          {courseUnits.map((unit, index) => {
            return (
              <ListItem
                key={unit.id}
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
                  key={unit.id}
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
                    primary={`${unit.displayIndex}. ${unit.title}`}
                    sx={
                      selectedIndex === index
                        ? theme.typography.titleMedium
                        : theme.typography.bodyLarge
                    }
                  />
                  {isAdministrator(user) && (
                    <IconButton
                      edge="end"
                      onClick={(event) => {
                        event.stopPropagation(); // Prevent triggering the list item click
                        handleContextMenuOpen(event, unit); // Custom function to handle button click
                      }}
                      sx={{ marginLeft: "16px" }}
                    >
                      <MoreVertIcon />
                    </IconButton>
                  )}
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
        {isAdministrator(user) && (
          <Button
            variant="contained"
            onClick={handleOpenCreateUnitModal}
            disableElevation
            startIcon={<AddIcon />}
            sx={{
              width: "100%",
              height: "40px",
              maxWidth: "236px",
              backgroundColor: theme.palette[user.role].Default,
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
        )}
      </Box>

      <CreateUnitModal
        openCreateUnitModal={openCreateUnitModal}
        handleCloseCreateUnitModal={handleCloseCreateUnitModal}
        createUnit={createUnit}
      />
      <EditUnitModal
        openEditUnitModal={openEditUnitModal}
        handleCloseEditUnitModal={handleCloseEditUnitModal}
        editUnit={editUnit}
        currentTitle={contextMenuUnit?.title ?? ""}
      />
      <DeleteUnitModal
        openDeleteUnitModal={openDeleteUnitModal}
        handleCloseDeleteUnitModal={handleCloseDeleteUnitModal}
        deleteUnit={deleteUnit}
      />
    </Drawer>
  );
}
