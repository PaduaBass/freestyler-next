'use client'
import Image from 'next/image'
import { LightbulbOff, LightbulbIcon, Lock, Flag, MegaphoneIcon, HomeIcon, PlayCircle, MousePointerSquareDashed, LucideWifiOff } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/context/socketContext';
import Connect from '@/components/Connect/Connect';
import QRCode from "react-qr-code";
import dynamic from 'next/dynamic'


import { Socket } from 'net';
import Dashboard from '@/components/Dashboard/Dashboard';
import Playbacks from '@/components/Playbacks/Playbacks';
import Overrides from '@/components/Overrides/Overrides';
import api from '@/services/api';
import { Body, getClient } from '@tauri-apps/api/http';
// import { test } from '@/services/socket';
export default function Home() {

  const { handleConnect, isConnected } = useContext(SocketContext);
  const ipRef = useRef<HTMLInputElement>(null);
  const portRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [playbacks, setPlaybacks] = useState<[]>([]);
  const [overrides, setOverrides] = useState<[]>([]);


  const [homeState, setHomeState] = useState({
    blackout: false,
    freeze: false,
    favorite: false,
    fog: false,
  })


 


  const [page, setPage] = useState(0);

  const handleConnectRequest = async () => {
    if(ipRef.current && ipRef.current.value.length > 8 && portRef.current && portRef.current.value.length > 3) {
      setLoading(true);
      fetch('http://localhost:4444/', {
        method: 'POST',
        body: JSON.stringify({ ip: ipRef.current.value, port: portRef.current.value }),
       }).then(response => response.json().then(data => {
          console.log(data);
          setLoading(false)
          handleConnect(data);
       }))
    }   
  }

  const handleSendCommand = async (command: string, subCommand?: string) => {
    const client = await getClient();
    const body = Body.json({
      command, 
      subCommand, 
    });
    const response = await client.put('http://localhost:4444', body) as any;

    if(response.data) {
      setHomeState(response.data.home);
      await client.drop()
    } else {
      const response = await api.put('/', {
        command, 
        subCommand, 
      });
      setHomeState(response.data.home);
    }


  }
  const handleDisconnect = async () => {
    const client = await getClient();
    const response = await client.delete('http://localhost:4444') as any;
    if(response.data) {
      handleConnect(response.data.status);
      await client.drop();
    } else {
      const response = await api.delete('/');
      handleConnect(response.data.status);
    }
  
  }

  
  return (
   <div className='w-screen h-screen m-auto bg-blue-950 flex items-center justify-center'>
    {!isConnected ? (
      <Connect />
    ) : (
      <div className='flex flex-col max-sm:w-[90%]  '>
        <div className='mb-2 text-white font-bold'>
          <label>Master</label>
          <div className='flex justify-between'>
            <span>0%</span>
            <span>100%</span>
          </div>
          <input id="default-range" max={255} min={0} onChange={e => handleSendCommand(`FSOC155${e.target.value}`)} defaultValue={255} type="range" className="w-full h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        </div>
        {page === 0 && (
          <>
          <Dashboard homeState={homeState} updateState={data => setHomeState(data)} />
          <label className='text-white font-bold'>Fog level</label>
          <div className='flex justify-between text-white'>
            <span>0%</span>
            <span>100%</span>
          </div>
          <input id="default-range" max={255} min={0} onChange={e => handleSendCommand(`FSOC304${e.target.value}`)} defaultValue={50} type="range" className="w-full h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
          <button
          onClick={handleDisconnect}
          className="h-9 max-sm:h-16 p-2 mt-20 gap-2 bg-blue-600 mt-2 rounded-md text-white flex items-center justify-center font-bold"
        >
          Desconectar
          <LucideWifiOff className="w-4" />
        </button>
          </>
        )}

        {page === 1 && (
          <>
          <Playbacks playbacks={playbacks} updateState={data => setPlaybacks(data)} />
          <label className='text-white font-bold'>Scene Time</label>
          <div className='flex justify-between text-white'>
            <span>0%</span>
            <span>100%</span>
          </div>
          <input id="default-range" max={255} min={0} onChange={e => handleSendCommand(`FSOC206${e.target.value}`)} defaultValue={50} type="range" className="w-full h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
          </>
        )}
        
        {page === 2 && (
          <Overrides overrides={overrides} updateState={data => setOverrides(data)} />
        )}
        <footer className='flex absolute bottom-0 h-14 bg-gray-300 w-full left-0 justify-around'>
          <button type='button' onClick={() => setPage(0)} className={`flex flex-col items-center ${page === 0 && 'text-blue-600'}`} >
            <HomeIcon className='w-4' />
            Home
          </button>   
          <button type='button' onClick={() => setPage(1)} className={`flex flex-col items-center ${page === 1 && 'text-blue-600'}`}>
            <PlayCircle className='w-4' />
            Playbacks
          </button>    
          <button type='button' onClick={() => setPage(2)} className={`flex flex-col items-center ${page === 2 && 'text-blue-600'}`}>
            <MousePointerSquareDashed className='w-4' />
            Buttons
          </button>     
        </footer>
      </div>
   
    )}
   </div>
  )
}
