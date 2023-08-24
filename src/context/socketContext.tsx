'use client'
import { ReactNode, createContext, useState } from 'react';


type SocketContextProps = {
    isConnected: boolean; 
    handleConnect: (connected: boolean) => void;
}
const SocketContext = createContext<SocketContextProps>({} as SocketContextProps);

const SocketContextProvider = ({ children }: { children: ReactNode }) => {
    const [isConnected, setIsConnected] = useState(false);
    const handleConnect = (connected: boolean) => {
        setIsConnected(connected);
    }

    return <SocketContext.Provider value={{ isConnected, handleConnect }}>
        {children}
    </SocketContext.Provider>
};

export { SocketContextProvider, SocketContext }; 