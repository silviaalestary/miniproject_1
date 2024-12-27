module.exports = (wss) => {
  global.wss = wss;

  wss.on('connection', (ws) => {
    console.log('Client terhubung ke WebSocket');

    // Kirim pesan selamat datang
    ws.send(JSON.stringify({
      event: 'welcome',
      message: 'Selamat datang di Kapal WebSocket Server',
      data: {
        time: new Date().toISOString(),
        clientCount: wss.clients.size
      }
    }));

    ws.on('message', (message) => {
      try {
        const parsedMessage = JSON.parse(message);
        console.log('Pesan diterima:', parsedMessage);
      } catch (error) {
        console.log('Pesan diterima (raw):', message);
      }
    });

    ws.on('close', () => {
      console.log('Client terputus dari WebSocket');
    });

    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
    });
  });

  // Fungsi untuk broadcast ke semua client
  wss.broadcast = (data) => {
    wss.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(JSON.stringify(data));
      }
    });
  };
}; 