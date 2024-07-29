import React, { ReactNode, createContext, useContext, useEffect, useRef, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface SocketProviderProps {
    children: ReactNode; // Returns a prop called children of type ReactNode
}

// Socket Context
const SocketContext = createContext<any>(null); // Default value of null due to docs saying: "If you don’t have any meaningful default value, specify null" - type is either Socket object or null

// Custom hook (function) to make accessing context value more intuitive
export const useSocket = () => {
    return useContext(SocketContext);
};

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
    const [socket, setSocket] = useState<Socket | null>(null);
    const [isConnected, setIsConnected] = useState(false);
  
    useEffect(() => {
        const newSocket = io('https://localhost:3000', {
            secure: true,             // Use HTTPS for encrypted comms
            rejectUnauthorized: false // Allows for self-signed certificates for local dev
        });

        newSocket.on('connect', () => {
            console.log("Connected!");
            setIsConnected(true);
        });

        setSocket(newSocket);

        return () => {
            newSocket.close(); // Close current connection on component deletion (for clean up)
            setIsConnected(false);
        }
    }, []); // Have no dependencies for recalling this so it is only run on component creation

    return (
        // Return a reference to the context via the provider which is called as a component later - we'll import our useSocket in children components
        <SocketContext.Provider value={{ socket, isConnected }}> 
            {children}
        </SocketContext.Provider>
    )
};
