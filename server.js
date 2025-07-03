const WebSocket = require('ws');
const osc = require('node-osc');

// WebSocketサーバーをポート8080で起動
const wss = new WebSocket.Server({ port: 8080 });

console.log('===========================================');
console.log('🚀 OSC Relay Server (Simple WS) has started!');
console.log('Listening for connections on port 8080');
console.log('===========================================');

wss.on('connection', (ws, req) => {
  const clientIp = req.socket.remoteAddress;
  console.log(`✅ Client connected from: ${clientIp}`);

  ws.on('message', message => {
    try {
      const data = JSON.parse(message);
      console.log('Received from browser:', data);

      const { ip, port, address, value } = data;

      if (!ip || !port || !address || value === undefined) {
        console.error('❌ Invalid data received from browser.');
        return;
      }

      const client = new osc.Client(ip, port);
      client.send(address, value, (err) => {
        if (err) {
          console.error('❌ Error sending OSC message:', err);
        } else {
          console.log(`✅ OSC message sent: Address=${address}, Value=${value} to ${ip}:${port}`);
        }
        client.close();
      });

    } catch (e) {
      console.error('❌ Failed to process message:', e);
    }
  });

  ws.on('close', () => {
    console.log(`👋 Client from ${clientIp} disconnected.`);
  });
});

wss.on('error', (error) => {
  console.error('💥 Server error:', error);
});
