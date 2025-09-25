import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  Drawer,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  useTheme,
} from "@mui/material";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import AddIcon from "@mui/icons-material/Add";
import { CourseUnit, UnitSidebarModalType } from "../../../types/CourseTypes";
import { useUser } from "../../../hooks/useUser";
import { isAdministrator } from "../../../types/UserTypes";
import CreateUnitModal from "../modals/CreateUnitModal";
import EditUnitModal from "../modals/EditUnitModal";
import DeleteUnitModal from "../modals/DeleteUnitModal";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import ContextMenu from "./ContextMenu";

interface UnitSideBarProps {
  handleClose: () => void;
  open: boolean;
  setSelectedUnit: React.Dispatch<React.SetStateAction<CourseUnit | null>>;
  selectedUnit: CourseUnit | null;
}

export default function UnitSidebar({
  handleClose,
  open,
  setSelectedUnit,
  selectedUnit,
}: UnitSideBarProps) {
  const theme = useTheme();
  const user = useUser();

  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [anchorEl, setAnchorEl] = React.useState(null);

  const [contextMenuUnit, setContextMenuUnit] = useState<CourseUnit | null>();
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(false);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);

  useEffect(() => {
    const getCouseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      setCourseUnits(data);

      // Set selectedUnit to the first unit if data is not empty
      if (data.length > 0) {
        setSelectedUnit(data[0]);
      }
    };
    getCouseUnits();
  }, [setSelectedUnit]);

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
        if (contextMenuUnit.id === selectedUnit?.id) {
          setSelectedUnit(editedUnit);
        }
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
      case UnitSidebarModalType.Create:
        handleOpenCreateUnitModal();
        break;
      case UnitSidebarModalType.Delete:
        handleOpenDeleteUnitModal();
        break;
      case UnitSidebarModalType.Edit:
        handleOpenEditUnitModal();
        break;
      default:
    }
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
    setSelectedIndex(index);
    setSelectedUnit(courseUnits[index]);
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
        height="100vh"
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
        <ContextMenu
          anchorEl={anchorEl}
          onClose={handleContextMenuClose}
          onModalOpen={handleOpenModal}
        />
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
