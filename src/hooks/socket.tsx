'use client'
import { Socket } from "net";
import { useEffect, useState } from "react";

const useSocket = () => {
    const [socket, setSocket] = useState<Socket | undefined>();
    
    useEffect(() => {
      if(socket) {
        socket.on('data', (data: any) => {
          console.log(data);
        })
      }
    }, [socket]);
    const handleUpdateSocket = (socket: Socket | undefined) => {
      setSocket(socket)
    };
    return { socket, handleUpdateSocket };
  
  }

 export default useSocket;