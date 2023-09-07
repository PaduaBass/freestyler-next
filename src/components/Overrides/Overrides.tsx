'use client'
import api from "@/services/api";
import { Body, getClient } from "@tauri-apps/api/http";
import { PauseIcon, PlayIcon } from "lucide-react";
import { useEffect } from "react";

type OverridesProps = {
    overrides: [];
    updateState: (data: any) => void;
}

const Overrides = ({ overrides, updateState }: OverridesProps) => {
    const handleSendCommand = async (command: string, subCommand?: string) => {
        const client = await getClient();
        const body = Body.json({
            command, 
            subCommand, 
            overrides: true
        });
        const response = await client.put('http://localhost:4444', body) as any;
        if(response.data) {
            updateState(response.data.overrides);
            await client.drop();
        } else {
            const response = await api.put('/', {
                command, 
                subCommand, 
                overrides: true
            });
            updateState(response.data.overrides);
        }
       
      }


    const handleSendPlayback = async (command: string, subCommand?: string) => {
        const client = await getClient();
        const body = Body.json({
            command, 
            subCommand, 
            statusOR: true   
        });
        const response = await client.put('http://localhost:4444', body) as any;
        if(response.data) {
            updateState(response.data.overrides);
            await client.drop();
        } else {
            const response = await api.put('/', {
                command, 
                subCommand, 
                statusOR: true        
            });
            updateState(response.data.overrides);
        }

    } 
    useEffect(() => {
        if(overrides.length === 0) {
           handleSendCommand('', 'FSBC002', );
           console.log('Mandei overrides')
        }
    }, []);



    
    return (
        <div className="grid grid-cols-2 gap-2 w-[500px] max-sm:w-[100%] h-[500px] overflow-y-auto">
            {overrides.length === 0 && <h2 className="text-white font-bold">Loading...</h2>}
            {overrides.map((pb: { label: string, status: boolean, code: string, timeScene: number }, i: number) => (
                <button key={i} onClick={() => handleSendPlayback(pb.code, 'FSBC007')} className={`text-zinc-200 h-20 rounded-md ${pb.status ? 'bg-orange-600' : 'bg-blue-600'}  w-full flex justify-center items-center gap-2`}>
                    {pb?.label}
                    {pb?.label?.length > 0 && !pb.status &&(
                        <PlayIcon className="w-4" />
                    )}
                    {pb?.label?.length > 0 && pb.status &&(
                        <PauseIcon className="w-4" />
                    )}
                </button>
            ))}
        </div>
    );
}


export default Overrides;
