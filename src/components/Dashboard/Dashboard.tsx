import api from "@/services/api";
import { getClient, Body } from '@tauri-apps/api/http';

import { Flag, LightbulbIcon, LightbulbOff, Lock, MegaphoneIcon } from "lucide-react"

type HomeProps = {
    homeState: {
        blackout: boolean;
        freeze: boolean;
        favorite: boolean;
        fog: boolean;
    }
    updateState: (data: any) => void;
}
const Dashboard = ({ homeState, updateState }: HomeProps) => {
    const handleSendCommand = async (command: string, subCommand?: string) => {
        const client = await getClient();
        const body = Body.json({
          command, 
          subCommand, 
          home: true,
        });
        const response = await client.put('http://localhost:4444', body) as any;
        if(response.data) {
          updateState(response.data.home);
        } else {
          const response = await api.put('/', {
            command, 
            subCommand, 
            home: true
          });
          updateState(response.data.home);
        }
        
      }


    const handleFog = () => {
      handleSendCommand('FSOC176255', 'FSBC014');
      setTimeout(() => {
        handleSendCommand('FSOC1760', 'FSBC014');
      }, 1000);
    };

    return (
        <div className='grid grid-cols-2 gap-2 p-2 w-full w-[500px] max-sm:w-[100%]'>
        <button onClick={() => handleSendCommand('FSOC002255', 'FSBC014')}  className={`h-20 p-2 gap-2 ${homeState.blackout ? 'bg-orange-600' : 'bg-blue-600'} mt-2 rounded-md text-white flex items-center justify-center font-bold`}>
            Blackout
            {homeState.blackout ? (
              <LightbulbOff className='w-4' />
            ) : (
              <LightbulbIcon className='w-4' />
            )}
        </button>
        <button onClick={() => handleSendCommand('FSOC001255', 'FSBC014')}  className={`h-20 p-2 gap-2 ${homeState.favorite ? 'bg-orange-600' : 'bg-blue-600'} mt-2 rounded-md text-white flex items-center justify-center font-bold`}>
            Favorite
            <Flag className='w-4' />
        </button>
        <button onClick={() => handleSendCommand('FSOC123255', 'FSBC014')}  className={`h-20 p-2 gap-2 ${homeState.freeze ? 'bg-orange-600' : 'bg-blue-600'} mt-2 rounded-md text-white flex items-center justify-center font-bold`}>
            Freeze
            <Lock className='w-4' />
        </button>
        <button onClick={handleFog}  className={`h-20 p-2 gap-2 ${homeState.fog ? 'bg-orange-600' : 'bg-blue-600'} mt-2 rounded-md text-white flex items-center justify-center font-bold`}>
            Fog
            <MegaphoneIcon className='w-4' />
        </button>
       
      </div>
    )
}

export default Dashboard;