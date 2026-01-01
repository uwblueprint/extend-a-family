import {
  DeleteOutline,
  DescriptionOutlined,
  EditOutlined,
  MoreHoriz,
  OpenInNew,
  PlayCircleOutline,
  VisibilityOffOutlined,
  VisibilityOutlined,
} from "@mui/icons-material";
import {
  Button,
  CardMedia,
  Divider,
  IconButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { useRef, useState } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useHistory } from "react-router-dom";
import CourseAPIClient from "../../../APIClients/CourseAPIClient";
import * as Routes from "../../../constants/Routes";
import { CourseModule, ModuleStatus } from "../../../types/CourseTypes";
import BlankImg from "../../assets/blankSlide.png";
import ChangeThumbnailModal from "../modals/ChangeThumbnailModal";
import EditModuleModal from "../modals/EditModuleModal";

const ItemType = "MODULE_CARD";

interface DragItem {
  index: number;
  id: string;
  type: string;
}

const ModuleCardAdmin = ({
  module,
  unitId,
  index,
  onModuleUpdate,
  moveModule,
}: {
  module: CourseModule;
  unitId: string;
  index: number;
  onModuleUpdate?: (updatedModule: CourseModule) => void;
  moveModule: (dragIndex: number, hoverIndex: number) => void;
}) => {
  const theme = useTheme();
  const history = useHistory();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openEditModuleModal, setOpenEditModuleModal] = useState(false);
  const [openChangeThumbnailModal, setOpenChangeThumbnailModal] =
    useState(false);
  const open = Boolean(anchorEl);
  const ref = useRef<HTMLDivElement>(null);

  const [{ handlerId }, drop] = useDrop<
    DragItem,
    void,
    { handlerId: string | symbol | null }
  >({
    accept: ItemType,
    collect(monitor) {
      return {
        handlerId: monitor.getHandlerId(),
      };
    },
    hover(item: DragItem, monitor) {
      if (!ref.current) {
        return;
      }
      const dragIndex = item.index;
      const hoverIndex = index;

      // Don't replace items with themselves
      if (dragIndex === hoverIndex) {
        return;
      }

      // Determine rectangle on screen
      const hoverBoundingRect = ref.current?.getBoundingClientRect();

      // Get vertical middle
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

      // Determine mouse position
      const clientOffset = monitor.getClientOffset();

      // Get pixels to the top
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      // Only perform the move when the mouse has crossed half of the items height
      // When dragging downwards, only move when the cursor is below 50%
      // When dragging upwards, only move when the cursor is above 50%

      // Dragging downwards
      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
        return;
      }

      // Dragging upwards
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
        return;
      }

      // Time to actually perform the action
      moveModule(dragIndex, hoverIndex);

      // Note: we're mutating the monitor item here!
      // Generally it's better to avoid mutations,
      // but it's good here for the sake of performance
      // to avoid expensive index searches.
      // eslint-disable-next-line no-param-reassign
      item.index = hoverIndex;
    },
  });

  const [{ isDragging }, drag] = useDrag({
    type: ItemType,
    item: () => {
      return { id: module.id, index };
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  drag(drop(ref));

  const handleMenuClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleOpenEditModuleModal = () => {
    setOpenEditModuleModal(true);
    handleMenuClose();
  };

  const handleCloseEditModuleModal = () => {
    setOpenEditModuleModal(false);
  };

  const handleOpenChangeThumbnailModal = () => {
    setOpenChangeThumbnailModal(true);
    handleMenuClose();
  };

  const handleCloseChangeThumbnailModal = () => {
    setOpenChangeThumbnailModal(false);
  };

  const handleThumbnailUpdate = (newImageUrl: string) => {
    if (onModuleUpdate) {
      onModuleUpdate({ ...module, imageURL: newImageUrl });
    }
  };

  const editModule = async (title: string) => {
    const updatedModule = await CourseAPIClient.editModule(
      unitId,
      module.id,
      title,
    );
    if (updatedModule && onModuleUpdate) {
      onModuleUpdate(updatedModule);
    }
  };

  const labelTextColorFromModuleState: Record<ModuleStatus, string> = {
    draft: theme.palette.Learner.Dark.Default,
    published: theme.palette.Success.Dark.Default,
    unpublished: theme.palette.Neutral[600],
  };

  const labelBackgroundColorFromModuleState: Record<ModuleStatus, string> = {
    draft: theme.palette.Learner.Light.Hover,
    published: theme.palette.Success.Light.Hover,
    unpublished: theme.palette.Neutral[300],
  };

  const iconFromModuleState: Record<ModuleStatus, React.ReactNode> = {
    draft: <DescriptionOutlined sx={{ width: 16, height: 16 }} />,
    published: <PlayCircleOutline sx={{ width: 16, height: 16 }} />,
    unpublished: <VisibilityOffOutlined sx={{ width: 16, height: 16 }} />,
  };

  return (
    <Stack
      ref={ref}
      data-handler-id={handlerId}
      direction="column"
      gap="12px"
      padding="16px"
      alignItems="flex-start"
      flex="1 0 0"
      minWidth="300px"
      maxWidth="300px"
      borderRadius="8px"
      border={`1px solid ${theme.palette.Neutral[400]}`}
      bgcolor={theme.palette.Neutral[100]}
      sx={{
        opacity: isDragging ? 0.5 : 1,
        cursor: "move",
      }}
    >
      <CardMedia
        component="img"
        image={module.imageURL ? module.imageURL : BlankImg}
        alt={module.title}
        sx={{ aspectRatio: "16 / 9" }}
      />
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="center"
        alignSelf="stretch"
      >
        <Stack
          direction="row"
          padding="4px 8px"
          justifyContent="center"
          alignItems="center"
          gap="8px"
          borderRadius="4px"
          bgcolor={labelBackgroundColorFromModuleState[module.status]}
        >
          {iconFromModuleState[module.status]}
          <Typography
            variant="labelMedium"
            color={labelTextColorFromModuleState[module.status]}
          >
            {module.status}
          </Typography>
        </Stack>
        <IconButton onClick={handleMenuClick}>
          <MoreHoriz />
        </IconButton>
        <Menu
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          MenuListProps={{
            sx: {
              paddingTop: "8px",
              paddingBottom: "8px",
              backgroundColor: theme.palette.Neutral[200],
            },
          }}
        >
          <MenuItem onClick={handleOpenEditModuleModal}>
            <ListItemIcon>
              <EditOutlined />
            </ListItemIcon>
            <ListItemText>Rename module</ListItemText>
          </MenuItem>
          <Divider sx={{ my: "0 !important", py: "4px !important" }} />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <OpenInNew />
            </ListItemIcon>
            <ListItemText>View Feedback</ListItemText>
          </MenuItem>
          <Divider sx={{ my: "0 !important", py: "4px !important" }} />
          <MenuItem onClick={handleOpenChangeThumbnailModal}>
            <ListItemIcon>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M14 11V14H2V11H0V14C0 15.1 0.9 16 2 16H14C15.1 16 16 15.1 16 14V11H14ZM3 5L4.41 6.41L7 3.83V12H9V3.83L11.59 6.41L13 5L8 0L3 5Z"
                  fill="#555759"
                  transform="translate(4, 4)"
                />
              </svg>
            </ListItemIcon>
            <ListItemText>Change Thumbnail</ListItemText>
          </MenuItem>
          <Divider sx={{ my: "0 !important", py: "4px !important" }} />
          <MenuItem onClick={handleMenuClose}>
            <ListItemIcon>
              <VisibilityOutlined />
            </ListItemIcon>
            <ListItemText>Go Live</ListItemText>
          </MenuItem>
          <Divider sx={{ my: "0 !important", py: "4px !important" }} />
          <MenuItem
            onClick={handleMenuClose}
            color={theme.palette.Error.Dark.Default}
            sx={{ color: theme.palette.Error.Dark.Default }}
          >
            <ListItemIcon>
              <DeleteOutline sx={{ color: theme.palette.Error.Dark.Default }} />
            </ListItemIcon>
            <ListItemText>Delete</ListItemText>
          </MenuItem>
        </Menu>
      </Stack>
      <Stack
        padding="4px 0 16px 0"
        flexDirection="column"
        alignItems="flex-start"
        gap="8px"
        alignSelf="stretch"
      >
        <Typography variant="labelLarge">
          Module {module.displayIndex}
        </Typography>
        <Typography variant="bodyLarge">{module.title}</Typography>
      </Stack>
      <Button
        startIcon={<EditOutlined />}
        sx={{
          width: "100%",
          padding: "10px 24px 10px 16px",
          color: theme.palette.Administrator.Dark.Default,

          borderRadius: "4px",
          border: `1px solid ${theme.palette.Neutral[500]}`,
        }}
        href={`${Routes.VIEW_PAGE}?moduleId=${module.id}`}
        onClick={() =>
          history.push(`${Routes.VIEW_PAGE}?moduleId=${module.id}`)
        }
      >
        <Typography variant="labelLarge">Edit</Typography>
      </Button>
      <EditModuleModal
        openEditModuleModal={openEditModuleModal}
        handleCloseEditModuleModal={handleCloseEditModuleModal}
        editModule={editModule}
        currentTitle={module.title}
      />
      <ChangeThumbnailModal
        open={openChangeThumbnailModal}
        onClose={handleCloseChangeThumbnailModal}
        moduleId={module.id}
        currentImageUrl={module.imageURL}
        onThumbnailUpdate={handleThumbnailUpdate}
      />
    </Stack>
  );
};

export default ModuleCardAdmin;
