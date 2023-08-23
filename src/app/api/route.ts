import { Socket } from 'net';
import { NextRequest, NextResponse } from "next/server";

let socket: Socket | null = null;

const conectionSocket = (ip: string, port: string) => {
  try {
    socket = new Socket();
    socket.connect(Number(port), ip, () => {
      console.log('auiii')

    });
    setTimeout(() => {
      if (socket) {
        socket.write('FSOC002255');
        socket.destroy();
      }

    }, 4000);
    console.log('envei conexão')
  } catch (e) {
    console.log(e);
  }
}


export async function GET(req: Request) {
  if (!socket) {

  }
  return NextResponse.json({ name: socket });
}

export async function PUT(req: Request) {

}

export async function POST(req: Request) {
  const json = await req.json();
  // const { ip, port } = req.body as any;
  try {
    await conectionSocket(json.ip, json.port);
    return NextResponse.json(json)
  } catch (e) {
    console.log(e);
  }
}