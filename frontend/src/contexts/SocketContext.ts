import { useContext, createContext } from 'react'
import { Socket } from 'socket.io-client'

const SocketContext = createContext<Socket | null>(null);

const useSocket = () => {
    return useContext(SocketContext)
}

export { SocketContext, useSocket };