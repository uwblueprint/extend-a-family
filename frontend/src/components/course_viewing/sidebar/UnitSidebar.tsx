import AddIcon from "@mui/icons-material/Add";
import { DndContext, closestCorners } from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { Box, Button, Drawer, List, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import { useUser } from "../../../hooks/useUser";
import { CourseUnit, UnitSidebarModalType } from "../../../types/CourseTypes";
import { isAdministrator } from "../../../types/UserTypes";
import CreateUnitModal from "../modals/CreateUnitModal";
import DeleteUnitModal from "../modals/DeleteUnitModal";
import EditUnitModal from "../modals/EditUnitModal";
import ContextMenu from "./ContextMenu";
import Unit from "./Unit";
import { useCourseUnits } from "../../../contexts/CourseUnitsContext";

interface UnitSideBarProps {
  open: boolean;
  setSelectedUnit: React.Dispatch<React.SetStateAction<CourseUnit | null>>;
  selectedUnit: CourseUnit | null;
}

export default function UnitSidebar({
  open,
  setSelectedUnit,
  selectedUnit,
}: UnitSideBarProps) {
  const theme = useTheme();
  const user = useUser();

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [contextMenuUnit, setContextMenuUnit] = useState<CourseUnit | null>();
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(false);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);

  const { courseUnits, refetchCourseUnits } = useCourseUnits();
  
  useEffect(() => {
    const getCouseUnits = async () => {
      const data = await CourseAPIClient.getUnits();
      const orderData: Map<string, number> = new Map<string, number>();
      setCourseUnits(data);

      // Set selectedUnit to the first unit if data is not empty
      if (data.length > 0) {
        setSelectedUnit(data[0]);
      }
      /* eslint-disable no-restricted-syntax */
      for (const course of data) {
        orderData.set(course.id, course.displayIndex);
      }
    };
    getCouseUnits();
  }, [setSelectedUnit]);

  useEffect(() => {
    if (!courseUnits || !courseUnits.length) return;

    const queryParams = new URLSearchParams(window.location.search);
    const selectedUnitParam = queryParams.get("selectedUnit");

    if (selectedUnitParam) {
      const unitFromParams = courseUnits.find(
        (unit) => unit.id === selectedUnitParam,
      );
      if (unitFromParams) {
        setSelectedUnit(unitFromParams);
        return;
      }
    }

    // Default to first unit if no valid query parameter
    setSelectedUnit(courseUnits[0]);
  }, [courseUnits, setSelectedUnit]);

  /* eslint-disable-next-line @typescript-eslint/no-explicit-any */
  const handleContextMenuOpen = (event: any, unit: CourseUnit) => {
    setAnchorEl(event.currentTarget);
    setContextMenuUnit(unit);
  };
  const handleContextMenuClose = () => {
    setAnchorEl(null);
  };

  /* eslint-disable  @typescript-eslint/no-explicit-any */
  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over) return;

    if (active.id !== over.id) {
      setCourseUnits((items) => {
        const oldIndex = items.findIndex((u) => u.id === active.id);
        const newIndex = items.findIndex((u) => u.id === over.id);
        setSelectedIndex(newIndex);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const createUnit = async (title: string) => {
    const unit = await CourseAPIClient.createUnit(title);
    if (unit) {
      refetchCourseUnits();
    }
  };
  const editUnit = async (title: string) => {
    if (contextMenuUnit) {
      const editedUnit = await CourseAPIClient.editUnit(
        contextMenuUnit.id,
        title,
      );
      if (editedUnit) {
        refetchCourseUnits();
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
        refetchCourseUnits();
      }
    }
  };

  const changeUnitArangement = async () => {
    const newUnitMap: Map<string, number> = new Map();
    /* eslint-disable  no-restricted-syntax */
    /* eslint-disable  guard-for-in */
    for (const idx in courseUnits) {
      const courseObj = courseUnits[idx];
      /* eslint-disable  radix */
      const updatedIdx = parseInt(idx, undefined) + 1;

      if (courseObj.displayIndex !== updatedIdx) {
        newUnitMap.set(courseUnits[idx].id, updatedIdx);
      }
    }
    if (newUnitMap.size > 0) {
      const data = await CourseAPIClient.rearangeUnits(newUnitMap);
      if (data) {
        const updatesUnits = courseUnits.map((unit, index) => {
          return {
            ...unit,
            displayIndex: index + 1,
          };
        });
        setCourseUnits(updatesUnits);
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

  const handleOpenMoveUnitModal = () => {
    setRearrangeUnitsMode(true);
  };

  const handleCloseMoveUnitModal = () => {
    setRearrangeUnitsMode(false);
    changeUnitArangement();
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
      case UnitSidebarModalType.Move:
        handleOpenMoveUnitModal();
        break;
      default:
    }
  };

  const handleListItemClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>,
    index: number,
  ) => {
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
        sx={{
          backgroundColor: theme.palette[user.role].Light.Default,
          display: "flex",
          flexDirection: "column",
          overflow: "hidden",
          overflowX: "hidden",
          height: "100%",
        }}
      >
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            minHeight: 0,
          }}
        >
          <Box
            height="59px"
            display="flex"
            p="12px"
            paddingLeft="20px"
            alignItems="center"
            justifyContent="space-between"
            sx={{
              ...theme.typography.titleMedium,
              color: theme.palette.Neutral[700],
            }}
          >
            Units
          </Box>
          <ContextMenu
            anchorEl={anchorEl}
            onClose={handleContextMenuClose}
            onModalOpen={handleOpenModal}
          />
          {rearrangeUnitsMode && (
            <Box
              p="12px"
              paddingLeft="32px"
              paddingRight="32px"
              paddingBottom="24px"
              paddingTop="16px"
              alignItems="center"
              justifyContent="center"
            >
              <Button
                type="button"
                sx={{
                  p: "8px",
                  height: "40px",
                  color: theme.palette.Administrator.Dark.Default,
                  lineHeight: "1.5",
                  alignSelf: "stretch",
                  width: "100%",
                  fontSize: theme.typography.titleSmall,
                  fontFamily: "Lexend Deca",
                  fontWeight: 300,
                  borderStyle: "solid",
                  borderWidth: "1px",
                }}
                onClick={handleCloseMoveUnitModal}
              >
                SAVE CHANGES
              </Button>
            </Box>
          )}
          <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
            <List sx={{ width: "100%" }}>
              <DndContext
                collisionDetection={closestCorners}
                onDragEnd={handleDragEnd}
              >
                <ListItemButton
                  key={unit.id}
                  sx={{
                    py: "15px",
                    px: "32px",
                    backgroundColor:
                      selectedUnit?.id === unit.id
                        ? theme.palette[user.role].Light.Selected
                        : "transparent",
                    "&:hover": {
                      backgroundColor: theme.palette[user.role].Light.Hover,
                    },
                  }}
                  onClick={(event) => handleListItemClick(event, index)}
                >
                  <ListItemText
                    disableTypography
                    primary={`${unit.displayIndex}. ${unit.title}`}
                    sx={
                      selectedUnit?.id === unit.id
                        ? theme.typography.labelLargeProminent
                        : theme.typography.bodyMedium
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
              backgroundColor: theme.palette[user.role].Dark.Default,
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
