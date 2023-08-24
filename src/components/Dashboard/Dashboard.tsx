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
    const handleSendCommand = (command: string, subCommand?: string) => {
        fetch('/api', {
          method: 'PUT',
          body: JSON.stringify({ command, subCommand, home: true }),
        }).then(response => response.json().then(data => {
          console.log(data);
          updateState(data.home);
        }))
      }
    return (
        <div className='grid grid-cols-2 gap-2 p-2 w-full'>
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
        <button onClick={() => handleSendCommand('FSOC176255', 'FSBC014')}  className={`h-20 p-2 gap-2 ${homeState.fog ? 'bg-orange-600' : 'bg-blue-600'} mt-2 rounded-md text-white flex items-center justify-center font-bold`}>
            Fog
            <MegaphoneIcon className='w-4' />
        </button>
       
      </div>
    )
}

export default Dashboard;