import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  PropsWithChildren,
} from "react";
import { io, Socket } from "socket.io-client";

const SocketContext = createContext<Socket | null>(null);

const useSocket = () => {
  return useContext(SocketContext);
};

type SocketProviderProps = {
  id?: string;
};

const SocketProvider = (props: PropsWithChildren<SocketProviderProps>) => {
  const { id, children } = props;
  const [socket] = useState<Socket>(
    io(process.env.REACT_APP_BACKEND_URL as string, {
      query: { userId: id },
    }),
  );

  useEffect(() => {
    socket.connect();
    // eslint-disable-next-line consistent-return
    return () => {
      socket.close();
    };
  }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketContext, useSocket, SocketProvider };
