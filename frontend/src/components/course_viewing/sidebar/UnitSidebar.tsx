import AddIcon from "@mui/icons-material/Add";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import { Box, Button, Drawer, List, Typography, useTheme } from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  verticalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import { DndContext, closestCorners } from "@dnd-kit/core";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import { useCourseUnits } from "../../../contexts/CourseUnitsContext";
import { useUser } from "../../../hooks/useUser";
import { CourseUnit, UnitSidebarModalType } from "../../../types/CourseTypes";
import { isAdministrator } from "../../../types/UserTypes";
import CreateUnitModal from "../modals/CreateUnitModal";
import DeleteUnitModal from "../modals/DeleteUnitModal";
import EditUnitModal from "../modals/EditUnitModal";
import ContextMenu from "./ContextMenu";
import Unit from "./Unit";

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

  const [anchorEl, setAnchorEl] = React.useState(null);

  const [contextMenuUnit, setContextMenuUnit] = useState<CourseUnit | null>();
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(false);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);
  const [rearrangeUnitsMode, setRearrangeUnitsMode] = useState(false);
  // const [selectedIndex, setSelectedIndex] = useState(0)

  const {
    courseUnits,
    refetchCourseUnits,
    isLoading: isCourseUnitsLoading,
    rearangeUnits,
    selectedIndex,
    changeSelectedIndex,
    handleDrag,
  } = useCourseUnits();

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
    rearangeUnits();
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
    changeSelectedIndex(index);
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
          overflowX: "hidden",
          height: "100%",
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
        {isCourseUnitsLoading ? (
          <Box display="flex" justifyContent="center">
            <Typography variant="bodyMedium">Loading units...</Typography>
          </Box>
        ) : (
          <List sx={{ width: "100%" }}>
            <Box sx={{ flex: 1, overflowY: "auto", minHeight: 0 }}>
              <List sx={{ width: "100%" }}>
                <DndContext
                  collisionDetection={closestCorners}
                  onDragEnd={handleDrag}
                >
                  <SortableContext
                    items={courseUnits.map((u) => u.id)}
                    strategy={verticalListSortingStrategy}
                  >
                    {courseUnits.map((unit, index) => {
                      return (
                        <Unit
                          key={index}
                          index={index}
                          unit={unit}
                          courseLength={courseUnits.length}
                          handleListItemClick={handleListItemClick}
                          selectedIndex={selectedIndex}
                          userRole={user.role}
                          rearrangeUnitsMode={rearrangeUnitsMode}
                          isAdmin={isAdministrator(user)}
                          handleContextMenuOpen={handleContextMenuOpen}
                        />
                      );
                    })}
                  </SortableContext>
                </DndContext>
              </List>
            </Box>
          </List>
        )}
        {isAdministrator(user) &&
          !rearrangeUnitsMode &&
          !isCourseUnitsLoading && (
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
