'use client'
import Image from 'next/image'
import { LightbulbOff, LightbulbIcon, Lock, Flag, MegaphoneIcon, HomeIcon, PlayCircle, MousePointerSquareDashed } from 'lucide-react';
import { useContext, useEffect, useRef, useState } from 'react';
import { SocketContext } from '@/context/socketContext';
import Connect from '@/components/Connect/Connect';
import QRCode from "react-qr-code";
import dynamic from 'next/dynamic'

import { Socket } from 'net';
import Dashboard from '@/components/Dashboard/Dashboard';
import Playbacks from '@/components/Playbacks/Playbacks';
import Overrides from '@/components/Overrides/Overrides';
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
      fetch('api/', {
        method: 'POST',
        body: JSON.stringify({ ip: ipRef.current.value, port: portRef.current.value }),
       }).then(response => response.json().then(data => {
          console.log(data);
          setLoading(false)
          handleConnect(data);
       }))
    }
   
  }

  const handleSendCommand = (command: string, subCommand?: string) => {
    fetch('/api', {
      method: 'PUT',
      body: JSON.stringify({ command, subCommand }),
    }).then(response => response.json().then(data => {
      console.log(data);
      setHomeState(data.home);
    }))
  }
  const handleDisconnect = () => {
    fetch('/api', {
      method: 'DELETE',
    }).then(response => response.json().then(data => {
      console.log(data);
      handleConnect(data);
    }))
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
          <input id="default-range" defaultValue='100' type="range" className="w-full h-6 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"></input>
        </div>
        {page === 0 && (
         <Dashboard homeState={homeState} updateState={data => setHomeState(data)} />
        )}

        {page === 1 && (
          <Playbacks playbacks={playbacks} updateState={data => setPlaybacks(data)} />
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
