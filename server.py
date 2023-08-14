
import asyncio
from websockets.server import serve

async def echo(websocket):
    print('Connection: ', websocket.remote_address, websocket.path)
    async for message in websocket:
        print('Got message (%d bytes): %s' % (len(message), message))
        for n in message.split('x'):
            if n == '':
                continue
            print(n)
            out = 'x'*(int(n) - 21)
            print('   Sending %d bytes' % (len(out)))
            await websocket.send(out)

async def main():
    async with serve(echo, "localhost", 3000, compression=None):
        await asyncio.Future()  # run forever

asyncio.run(main())
