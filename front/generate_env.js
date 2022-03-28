const { networkInterfaces } = require('os');
const fs = require('fs')

const nets = networkInterfaces();
const net = nets['Ethernet'] || nets['Wi-Fi']
const ipv4 = net.find(x => x['family'] === 'IPv4')['address']

fs.writeFileSync('.env.local', `IPv4=${ipv4}`)
