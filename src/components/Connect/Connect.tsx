"use client";

import { SocketContext } from "@/context/socketContext";
import api from "@/services/api";
import {  Workflow, LucideWifiOff, Wifi } from "lucide-react";
import dynamic from "next/dynamic";
import { useContext, useState, useEffect } from "react";
import QrCode from "react-qr-code";
import { getClient } from '@tauri-apps/api/http';
import { cli } from "@tauri-apps/api";
const Connect = () => {
  const [ip, setIp] = useState("127.0.0.1");
  const [port, setPort] = useState("3332");
  const { handleConnect } = useContext(SocketContext);
  const [loading, setLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [ipServer, setIpServer] = useState('');
  const [erro, setErro] = useState<any>('');

  const getInterfaces = async () => {
   try {
    const client = await getClient();
    const response = await client.get('http://localhost:4444/') as any;

  
    if(response.data) {
      let address = response.data?.interfaces['Wi-Fi'].find((obj: any) => obj.family === "IPv4").address;

      setIpServer('http://'+address + ':3000');
      setIp(address);
      await client.drop();
    } else {
      fetch('http://localhost:4444/').then(response => response.json().then(data => {
        if(data.interfaces) {
          let address = data.interfaces['Wi-Fi'].find((obj: any) => obj.family === "IPv4").address;
          setIpServer('http://'+address + ':3000');
          setIp(address)
        }
      }));
    }
   
   } catch(e) {
    console.log(e);
    setErro(e);
   }
  } 

  useEffect(() => {
    getInterfaces();
    function detectar_mobile() { 
 
      if(navigator.userAgent.match(/Android/i)
      || navigator.userAgent.match(/webOS/i)
      || navigator.userAgent.match(/iPhone/i)
      || navigator.userAgent.match(/iPad/i)
      || navigator.userAgent.match(/iPod/i)
      || navigator.userAgent.match(/BlackBerry/i)
      || navigator.userAgent.match(/Windows Phone/i)
      ){
         setIsMobile(true);
       }
      else {
         setIsMobile(false);
       }
     }
     detectar_mobile();
     
  }, []);

  
  const handleConnectRequest = async () => {
    if (ip.length > 8 && port.length > 3) {
      setLoading(true);
      const response = await api.post('/', {
        ip,
        port
      });
      setLoading(false);
      handleConnect(response.data.status);
    }
  };

  const handleSendCommand = () => {
    fetch("http://localhost:4444/", {
      method: "PUT",
      body: JSON.stringify({ command: "FSOC002255" }),
    }).then((response) => response.json().then((data) => console.log(data)));
  };

  const handleDisconnect = async () => {
    const response = await api.delete('/');
    handleConnect(response.data.status);
  };

  function maskIP(ip: string) {}

  return (
    <div className="flex flex-col md:w-[400px] max-sm:w-[80%]">
    {!isMobile && (
      <div className="flex flex-col justify-center items-center">
        <h1 className="text-white text-center mb-2 font-bold">Scan the code with your smartphone</h1>
        <QrCode value={ipServer}  />
      </div>
    )}
      <>
      <h2 className="text-white text-center mb-2">FreeStyler DMX Connect</h2>
      <span>{String(erro)}</span>
      <input
        value={ip}
        onChange={(e) => setIp(e.target.value)}
        placeholder="IP"
        className="h-9 max-sm:h-16 p-2 outline-none focus:border-2 focus:border-blue-600 rounded-md"
      />
      <input
        maxLength={4}
        value={port}
        onChange={(e) => setPort(e.target.value)}
        placeholder="Porta"
        className="h-9 max-sm:h-16 mt-2 p-2 outline-none focus:border-2 focus:border-blue-600 rounded-md"
      />
      <button
        onClick={handleConnectRequest}
        className="h-9 max-sm:h-16 p-2 gap-2 bg-blue-600 mt-2 rounded-md text-white flex items-center justify-center font-bold"
      >
        {!loading ? (
          <>
            Conectar
            <Wifi className="w-4" />
          </>
        ) : (
          <div role="status">
            <svg
              aria-hidden="true"
              className="w-8 h-8 mr-2 text-gray-200 animate-spin dark:text-gray-600 fill-blue-300"
              viewBox="0 0 100 101"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                fill="currentColor"
              />
              <path
                d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                fill="currentFill"
              />
            </svg>
            <span className="sr-only">Loading...</span>
          </div>
        )}
      </button>
      </>

      <button
        onClick={handleDisconnect}
        className="h-9 max-sm:h-16 p-2 gap-2 bg-blue-600 mt-2 rounded-md text-white flex items-center justify-center font-bold"
      >
        Desconectar
        <LucideWifiOff className="w-4" />
      </button>
    </div>
  );
};

export default Connect;
