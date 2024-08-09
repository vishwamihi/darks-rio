const net = require('net');

const scanPort = (host, port) => {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    const timeout = setTimeout(() => {
      socket.destroy();
      resolve(false);
    }, 2000);

    socket.on('connect', () => {
      clearTimeout(timeout);
      socket.destroy();
      resolve(true);
    });

    socket.on('error', () => {
      clearTimeout(timeout);
      resolve(false);
    });

    socket.connect(port, host);
  });
};

const handlePortScan = async (sock, from, message) => {
  // Log the entire message object for debugging
  console.log('Received message object:', message);

  // Ensure message and message.body are defined
  if (!message || !message.body) {
    console.error('Invalid message format:', message);
    await sock.sendMessage(from, { text: 'Invalid message format or empty body.' }, { quoted: message });
    return;
  }

  // Ensure message.body is a string
  if (typeof message.body !== 'string') {
    console.error('Message body is not a string:', message.body);
    await sock.sendMessage(from, { text: 'Message body is not a string.' }, { quoted: message });
    return;
  }

  // Parse command arguments
  const args = message.body.split(' ').slice(1);
  const host = args[0];
  const ports = [22, 80, 443, 8080]; // Common ports for demonstration

  if (!host) {
    await sock.sendMessage(from, { text: 'Please provide a host to scan.' }, { quoted: message });
    return;
  }

  let openPorts = [];
  for (let port of ports) {
    const isOpen = await scanPort(host, port);
    if (isOpen) openPorts.push(port);
  }

  const responseText = openPorts.length
    ? `Open ports on ${host}: ${openPorts.join(', ')}`
    : `No open ports found on ${host}.`;

  await sock.sendMessage(from, { text: responseText }, { quoted: message });
  console.log('Port scan response sent successfully.');
};

module.exports = handlePortScan;
