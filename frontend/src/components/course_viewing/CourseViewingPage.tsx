import React, { useEffect, useState } from "react";
import { Box, Button, Stack, Typography, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UnitSidebar from "./UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import CourseModulesGrid from "./CourseModulesGrid";
import CreateUnitModal from "./modals/CreateUnitModal";
import DeleteUnitModal from "./modals/DeleteUnitModal";
import EditUnitModal from "./modals/EditUnitModal";
import UnpublishUnitModal from "./modals/UnpublishUnitModal";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [editUnitName, setEditUnitName] = useState("");
  const [createUnitName, setCreateUnitName] = useState("");
  const [deleteUnitId, setDeleteUnitId] = useState("");
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(true);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);
  const [openUnpublishUnitModal, setOpenUnpublishUnitModal] = useState(false);
  const [open, setOpen] = useState(true);
  const [selectedUnit, setSelectedUnit] = useState<CourseUnit | null>(null);

  const handleOpenCreateUnitModal = () => {
    setOpenCreateUnitModal(true);
  };

  const handleCloseCreateUnitModal = () => {
    setOpenCreateUnitModal(false);
  };

  const handleCloseEditUnitModal = () => {
    setOpenEditUnitModal(false);
  };

  const handleOpenEditUnitModal = () => {
    setOpenEditUnitModal(true);
  };

  const handleCloseDeleteUnitModal = () => {
    setOpenDeleteUnitModal(false);
  };

  const handleOpenDeleteUnitModal = () => {
    setOpenDeleteUnitModal(true);
  };

  const handleCloseUnpublishUnitModal = () => {
    setOpenUnpublishUnitModal(false);
  };

  const handleOpenUnpublishUnitModal = () => {
    setOpenUnpublishUnitModal(true);
  };

  const createUnit = () => {};
  const editUnit = () => {};
  const deleteUnit = () => {};
  const unpublishUnit = () => {};

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

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
  }, []);

  const handleSelectUnit = (unit: CourseUnit) => {
    setSelectedUnit(unit);
  };

  return (
    <Box display="flex" width="100%" height="100%">
      <CreateUnitModal
        openCreateUnitModal={openCreateUnitModal}
        handleCloseCreateUnitModal={handleCloseCreateUnitModal}
        setCreateUnitName={setCreateUnitName}
        createUnit={createUnit}
      />
      <EditUnitModal
        openEditUnitModal={openEditUnitModal}
        setEditUnitName={setEditUnitName}
        handleCloseEditUnitModal={handleCloseEditUnitModal}
        editUnit={editUnit}
      />
      <DeleteUnitModal
        openDeleteUnitModal={openDeleteUnitModal}
        handleCloseDeleteUnitModal={handleCloseDeleteUnitModal}
        deleteUnit={deleteUnit}
      />
      <UnpublishUnitModal
        openUnpublishUnitModal={openUnpublishUnitModal}
        handleCloseUnpublishUnitModal={handleCloseUnpublishUnitModal}
        unpublishUnit={unpublishUnit}
      />

      <UnitSidebar
        courseUnits={courseUnits}
        handleClose={handleDrawerClose}
        handleOpenCreateUnitModal={handleOpenCreateUnitModal}
        handleOpenDeleteUnitModal={handleOpenDeleteUnitModal}
        handleOpenEditUnitModal={handleOpenEditUnitModal}
        handleOpenUnpublishUnitModal={handleOpenUnpublishUnitModal}
        open={open}
        onSelectUnit={handleSelectUnit}
      />

      <Box sx={{ flexGrow: 1, p: "48px" }}>
        {selectedUnit ? (
          <Stack spacing="14px">
            <Box display="flex" alignItems="center" paddingLeft="10px">
              {!open && (
                <Button
                  type="button"
                  sx={{
                    color: theme.palette.Neutral[700],
                    backgroundColor: theme.palette.Neutral[200],
                    borderRadius: "4px",
                    width: "34px",
                    minWidth: "34px",
                    height: "34px",
                    padding: 0,
                    marginRight: "12px",
                  }}
                  onClick={handleDrawerOpen}
                >
                  <MenuOpenIcon
                    sx={{
                      fontSize: "18px",
                      transform: "scaleX(-1)",
                    }}
                  />
                </Button>
              )}
              <Typography variant="headlineLarge" display="inline">
                Unit {selectedUnit.displayIndex}: {selectedUnit.title}
              </Typography>
            </Box>
            <CourseModulesGrid unitId={selectedUnit.id} isSidebarOpen={open} />
          </Stack>
        ) : (
          <Typography>Loading units...</Typography>
        )}
      </Box>
    </Box>
  );
}
