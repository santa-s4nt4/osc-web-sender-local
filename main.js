document.addEventListener('DOMContentLoaded', () => {
  let ws = null;

  const serverIpInput = document.getElementById('serverIp');
  const connectButton = document.getElementById('connectButton');

  const oscSection = document.getElementById('oscSection');
  const statusDiv = document.getElementById('status');
  const ipInput = document.getElementById('ip');
  const portInput = document.getElementById('port');
  const addressInput = document.getElementById('address');
  const valueInput = document.getElementById('value');
  const sendButton = document.getElementById('sendButton');

  connectButton.addEventListener('click', () => {
    const serverIp = serverIpInput.value;
    if (!serverIp) {
      alert('Please enter the Server IP Address.');
      return;
    }

    if (ws) {
      ws.close();
    }

    statusDiv.textContent = `Connecting to ${serverIp}...`;
    statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-yellow-100 text-yellow-800';

    // シンプルな 'ws://' プロトコルで接続
    ws = new WebSocket(`ws://${serverIp}:8080`);

    addWebSocketHandlers();
  });

  function addWebSocketHandlers() {
    ws.onopen = () => {
      console.log('Server connected.');
      statusDiv.textContent = `✅ Connected to ${ws.url}`;
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-green-100 text-green-800';
      oscSection.disabled = false;
    };

    ws.onclose = () => {
      console.log('Server disconnected.');
      statusDiv.textContent = '❌ Disconnected. Please connect to a server.';
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-red-100 text-red-800';
      oscSection.disabled = true;
      ws = null;
    };

    ws.onerror = (error) => {
      console.error('WebSocket Error:', error);
      statusDiv.textContent = `❌ Connection failed. Check IP and if server is running.`;
      statusDiv.className = 'text-sm font-medium mb-4 p-3 rounded-lg text-center bg-red-100 text-red-800';
      oscSection.disabled = true;
      ws = null;
    };
  }

  sendButton.addEventListener('click', () => {
    if (!ws || ws.readyState !== WebSocket.OPEN) {
      alert('Not connected to the server.');
      return;
    }

    const rawValue = valueInput.value;
    const valueToSend = !isNaN(parseFloat(rawValue)) && isFinite(rawValue) ? parseFloat(rawValue) : rawValue;

    const data = {
      ip: ipInput.value,
      port: parseInt(portInput.value, 10),
      address: addressInput.value,
      value: valueToSend,
    };

    ws.send(JSON.stringify(data));
    console.log('Sent to server:', data);
  });
});
