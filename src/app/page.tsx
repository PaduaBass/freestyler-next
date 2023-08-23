'use client'
import Image from 'next/image'
import { Workflow } from 'lucide-react';
// import { test } from '@/services/socket';
export default function Home() {
  
  const handleConnect = async () => {
    fetch('api/', {
      method: 'POST',
      body: JSON.stringify({ ip: '10.0.0.163', port: '3334'}),
     }).then(response => response.json().then(data => {
      console.log(data);
     }))

   
  }
  
  return (
   <div className='w-full h-screen m-auto bg-blue-950 flex items-center justify-center'>
    <div className='flex flex-col md:w-[400px] max-sm:w-[80%]'>
      <h2 className='text-white text-center mb-2'>FreeStyler DMX</h2>
      <input  placeholder='Ip do servidor' className='h-9  p-2 outline-none focus:border-2 focus:border-blue-600 rounded-md' />
      <button onClick={handleConnect}  className='h-9 p-2 gap-2 bg-blue-600 mt-2 rounded-md text-white flex items-center justify-center font-bold'>
        Conectar
        <Workflow className='w-4' />
      </button>
    </div>
   </div>
  )
}
