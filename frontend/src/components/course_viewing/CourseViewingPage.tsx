import React, { useEffect, useState } from "react";
import { Box, Button, Typography, useTheme } from "@mui/material";
import MenuOpenIcon from "@mui/icons-material/MenuOpen";
import UnitSidebar from "./UnitSidebar";
import { CourseUnit } from "../../types/CourseTypes";
import CourseAPIClient from "../../APIClients/CourseAPIClient";
import CreateUnitModal from "./modals/CreateUnitModal";
import DeleteUnitModal from "./modals/DeleteUnitModal";
import EditUnitModal from "./modals/EditUnitModals";

export default function CourseUnitsPage() {
  const theme = useTheme();
  const [courseUnits, setCourseUnits] = useState<CourseUnit[]>([]);
  const [createUnitName, setCreateUnitName] = useState("");
  const [editUnitName, setEditUnitName] = useState("");
  const [openCreateUnitModal, setOpenCreateUnitModal] = useState(false);
  const [openDeleteUnitModal, setOpenDeleteUnitModal] = useState(false);
  const [openEditUnitModal, setOpenEditUnitModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [open, setOpen] = useState(true);

  const handleOpenCreateUnitModal = () => {
    setOpenCreateUnitModal(true);
  };

  const handleCloseCreateUnitModal = () => {
    setOpenCreateUnitModal(false);
  };

  const handleCloseDeleteUnitModal = () => {
    setOpenDeleteUnitModal(false);
  };

  const handleCloseEditUnitModal = () => {
    setOpenEditUnitModal(false);
  };

  const handleOpenDeleteUnitModal = () => {
    setOpenDeleteUnitModal(true);
  };

  const handleOpenEditUnitModal = () => {
    setOpenEditUnitModal(true);
  };

  const createUnit = () => {
    // dummy function
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unitName = createUnitName;
  };
  const deleteUnit = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const courseId = selectedCourseId;
  };

  const editUnit = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const courseId = editUnitName;
  };

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
    };
    getCouseUnits();
  }, []);

  return (
    <Box display="flex" width="100%" height="100%">
      <CreateUnitModal
        openCreateUnitModal={openCreateUnitModal}
        handleCloseCreateUnitModal={handleCloseCreateUnitModal}
        setCreateUnitName={setCreateUnitName}
        createUnit={createUnit}
      />
      <DeleteUnitModal
        openDeleteUnitModal={openDeleteUnitModal}
        handleCloseDeleteUnitModal={handleCloseDeleteUnitModal}
        deleteUnit={deleteUnit}
      />

      <EditUnitModal
        openEditUnitModal={openEditUnitModal}
        handleCloseEditUnitModal={handleCloseEditUnitModal}
        setEditUnitName={setEditUnitName}
        editUnit={editUnit}
      />

      <UnitSidebar
        courseUnits={courseUnits}
        handleClose={handleDrawerClose}
        handleOpenCreateUnitModal={handleOpenCreateUnitModal}
        handleOpenDeleteUnitModal={handleOpenDeleteUnitModal}
        handleOpenEditUnitModal={handleOpenEditUnitModal}
        setSelectedCourseId={setSelectedCourseId}
        open={open}
      />
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

      <Box sx={{ flexGrow: 1 }}>
        <Typography paragraph>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do
          eiusmod tempor incididunt ut labore et dolore magna aliqua. Rhoncus
          dolor purus non enim praesent elementum facilisis leo vel. Risus at
          ultrices mi tempus imperdiet. Semper risus in hendrerit gravida rutrum
          quisque non tellus. Convallis convallis tellus id interdum velit
          laoreet id donec ultrices. Odio morbi quis commodo odio aenean sed
          adipiscing. Amet nisl suscipit adipiscing bibendum est ultricies
          integer quis. Cursus euismod quis viverra nibh cras. Metus vulputate
          eu scelerisque felis imperdiet proin fermentum leo. Mauris commodo
          quis imperdiet massa tincidunt. Cras tincidunt lobortis feugiat
          vivamus at augue. At augue eget arcu dictum varius duis at consectetur
          lorem. Velit sed ullamcorper morbi tincidunt. Lorem donec massa sapien
          faucibus et molestie ac.
        </Typography>
      </Box>
    </Box>
  );
}
