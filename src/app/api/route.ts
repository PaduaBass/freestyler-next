import useSocket from '@/hooks/socket';
import { Socket } from 'net';
import { NextRequest, NextResponse } from "next/server";
import { useEffect, useState } from 'react';
import { Buffer } from 'buffer';
import { data } from 'autoprefixer';
import { json } from 'stream/consumers';
import os from 'os';

let home = {
  blackout: false,
  freeze: false,
  favorite: false,
  fog: false,
};


let playbacks: any = [];
let overrides: any = [];

let isConvertOverrides = true;
let isConvertLabels = true;

let socket: any;
let count = 0;



if(socket) {
  socket.on('data', (data: any) => {
    console.log(data);
  })
}

const convertDataHome = (data: string) => {
  home.blackout = data.split(',')[1] === '1' ?? false;
  home.favorite = data.split(',')[3] === '1' ?? false;
  home.freeze = data.split(',')[2] === '1' ?? false;
}

const convertDataPlaybacks = (data: String) => {
  if(isConvertLabels) {
    playbacks = [];
    let array = data.split(',');
    array.shift();
    array.forEach((t, i) => {
        playbacks.push({ 
          label: t, 
          status: false,
          timeScene: 100,
          code: `FSOC0${46 + i}255`,
        });
    });
    if(playbacks.length === 20) {
      isConvertLabels = false;
    }
  }
};


const convertDataOverrides = (data: String) => {
  if(isConvertOverrides) {
    overrides = [];
    let array = data.split(',');
    array.shift();
    array.forEach((t, i) => {
        overrides.push({ 
          label: t, 
          status: false,
          code: `FSOC0${66 + i}255`,
        });
    });
    if(overrides.length === 30) {
      isConvertOverrides = false;
    }
  }
};
  
const convertStatusPlaybacks = (data: String) => {
  let array = data.split(',');
  array.shift();
  if(array.length === playbacks.length) {
    array.forEach((st, i) => {
      playbacks[i].status = st === '1' ?? false;
    });
  }
}

const getData = async () => {
  let intervalHome = setInterval(() => {
    if(count > 1) {
      clearInterval(intervalHome);
      count = 0;
    }
  
    if(socket) {
      socket.on('data', (data: any) => {
        let dataString = Buffer.from(data).toString();
        if(dataString.includes('F')) {
          console.log(dataString);
          convertDataHome(dataString);
          clearInterval(intervalHome);
        } 
      });
    }
    count++;
  }, 5);
}


const updateStatusPlaybacks = async () => {
  let intervalHome = setInterval(() => {
    console.log('intervalo rolando')
    if(count > 1) {
      clearInterval(intervalHome);
      count = 0;
    }

    if(socket) {
      socket.on('data', (data: any) => {
        let dataString = Buffer.from(data).toString();
        if(dataString.includes('F')) {
          convertStatusPlaybacks(dataString);
          clearInterval(intervalHome);
        } 
      });
    }
    count++;
  }, 5);
}



const convertStatusOverrides = (data: String) => {
  console.log('convertendo status over', data);
  let array = data.split(',');
  array.shift();
  if(array.length === overrides.length) {
    array.forEach((st, i) => {
      overrides[i].status = st === '1' ?? false;
    });
  }
}

const updateStatusOverrides = async () => {
  let intervalHome = setInterval(() => {
    if(count > 1) {
      clearInterval(intervalHome);
      count = 0;
    }

    if(socket) {
      socket.on('data', (data: any) => {
        let dataString = Buffer.from(data).toString();
        if(dataString.includes('F')) {
          convertStatusOverrides(dataString);
          clearInterval(intervalHome);
        } 
      });
    }
    count++;
  }, 5);
}


const getDataOverrides = async () => {
  let intervalHome = setInterval(() => {
    if(count > 1) {
      clearInterval(intervalHome);
      count = 0;
    }

    if(socket) {
      socket.on('data', (data: any) => {
        let dataString = Buffer.from(data).toString();
        if(dataString.includes('F')) {
          convertDataOverrides(dataString);
          clearInterval(intervalHome);
        } 
      });
    }
    count++;
  }, 5);
}


const getDataPlaybacks = async () => {
  let intervalHome = setInterval(() => {
    if(count > 1) {
      clearInterval(intervalHome);
      count = 0;
    }

    if(socket) {
      socket.on('data', (data: any) => {
        let dataString = Buffer.from(data).toString();
        if(dataString.includes('F')) {
          convertDataPlaybacks(dataString);
          clearInterval(intervalHome);
        } 
      });
    }
    count++;
  }, 5);
}

// let intervalHome = setInterval(() => {
//   console.log('intervalo rolando')
//   if(count > 1) {
//     clearInterval(intervalHome);
//     count = 0;
//   }

//   console.log('a1u')
//   if(socket) {
//     console.log('entrou aqui')
//     socket.on('data', data => {
//       let dataString = Buffer.from(data).toString();
//       if(dataString.includes('F')) {
//         console.log(dataString);
//         convertDataHome(dataString);
//         clearInterval(intervalHome);
//       } 
//     });
//   }
//   count++;

// }, 1000);



async function conectionSocket (ip: string, port: string)  {
  console.log(port);
  console.log(ip)
  try {
    if(!socket) {
      socket = new Socket();
      socket.connect(Number(port), ip, () => {
        console.log('Conectou')
        socket?.write('FSBC014');
      });
      
    }
    
    // console.log('validação', socket.on)
  } catch (e) {
    console.log('caiu aqui', e)
  }

}


export async function GET(req: Request) {
  const network = os.networkInterfaces();
  if (!socket) {

  }
  return NextResponse.json({ interfaces: network });
}

export async function PUT(req: Request) {
  // clearInterval(intervalHome);

  const json = await req.json();
  try {
    let response: any = {};

    if(socket) {
      
      socket.write(json.command);

      if(json.subCommand) {
        socket.write(json.subCommand, (e: any) => {
        });
        if(json.home) {
          console.log('home');
          await getData();
        }

        if(json.playbacks) {
          console.log('playbacks')

          await getDataPlaybacks();
        }
        if(json.buttons) {
          console.log('buttons');
          await getData();
        }

        if(json.statusOR) {
          await updateStatusOverrides();
        }

        if(json.overrides) {
          await getDataOverrides();
        }

        if(json.statusPB) {
          console.log('playbackStatus')
          await updateStatusPlaybacks();
        }
        // intervalHome.refresh();
      }
      
    }

    return new Promise(async (resolve) => {

     setTimeout(() => {
      resolve(NextResponse.json({ home, playbacks, overrides }));
     }, 5);
      

    })
  } catch(e) {
    console.log(e);
  }
};

export async function DELETE(req: Request) {
  console.log(socket);
  if(socket) {
    socket.end();
    socket = null;
  }

  // const { ip, port } = req.body as any;
  try {
    return NextResponse.json({ status: false })
  } catch (e) {
    console.log(e);
  }
}



export async function POST(request: Request) {
  
  // console.log(json);
  // const { ip, port } = req.body as any;
  try {
    const json = await request.json();

    console.log('iniciando conexão');
    await conectionSocket(json.ip, json.port);
    return new Promise(resolve => {
      setTimeout(() => {
        if(socket?.errored) {
          resolve(NextResponse.json({ status: false }))
        } else {
          resolve(NextResponse.json({ status: true }))
        }
      }, 1000);
    })
  } catch (e) {
    console.log('errro', e);
  }
}

export const dynamic = "force-static";
