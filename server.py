
import asyncio
from websockets.server import serve

async def echo(websocket):
    print('Connection: ', websocket.remote_address, websocket.path)
    async for message in websocket:
        print('Got message: ', message)
        await websocket.send(message)

async def main():
    async with serve(echo, "localhost", 3000, compression=None):
        await asyncio.Future()  # run forever

asyncio.run(main())
