import React from "react";
import { Box, ListItem, ListItemButton } from "@mui/material";
import { FixedSizeList, ListChildComponentProps } from "react-window";
import { Notification } from "../../types/NotificationTypes";
import NotificationItem from "./NotificationItem";

interface NotificationListProps {
  notifications: Notification[];
}

const NotificationRow = (props: ListChildComponentProps<Notification[]>) => {
  const { style, index, data } = props;

  return (
    <ListItem style={style} key={index} component="div" disablePadding>
      <ListItemButton>
        <NotificationItem notification={data[index]} />
      </ListItemButton>
    </ListItem>
  );
};

const NotificationsList = (props: NotificationListProps) => {
  const { notifications } = props;

  return (
    <Box
      sx={{
        width: "100%",
        height: 400,
        maxWidth: 360,
        bgcolor: "background.paper",
      }}
    >
      <FixedSizeList
        height={400}
        width={360}
        itemSize={100}
        itemCount={notifications.length}
        itemData={notifications}
        overscanCount={2}
      >
        {NotificationRow}
      </FixedSizeList>
    </Box>
  );
};

export default NotificationsList;
