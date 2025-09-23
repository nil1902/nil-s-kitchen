const cron = require('node-cron');
const https = require('https');

const SERVER_URL = 'https://your-server-url.com/health';

function pingServer() {
  const now = new Date();
  const hour = now.getHours();
  
  // Only ping between 2 PM (14) and 10 PM (22)
  if (hour < 14 || hour >= 22) {
    console.log(`Outside business hours (${hour}:${now.getMinutes()}), skipping ping`);
    return;
  }

  https.get(SERVER_URL, (res) => {
    console.log(`✅ Server pinged successfully at ${now.toLocaleTimeString()}`);
  }).on('error', (err) => {
    console.log(`❌ Ping failed at ${now.toLocaleTimeString()}:`, err.message);
  });
}

// Run every 10 minutes
cron.schedule('*/10 * * * *', pingServer);

console.log('🚀 Keep-alive service started. Pinging every 10 minutes from 2 PM to 10 PM');
pingServer(); // Initial ping