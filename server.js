require('dotenv').config()

const express = require('express')
const app = express()

const port = process.env.APP_PORT || 5000

// Middleware untuk parsing JSON body
app.use(express.json());

// Handler untuk permintaan POST (saat webhook mengirimkan data)
app.post('/webhook', (req, res) => {
   try {
      const body = req.body; // Mengambil body dari request

      // Cetak payload JSON yang diterima dari webhook
      console.log('Received POST request:', body);

      // Contoh memproses status pesan
      if (body.messages) {
         body.messages.forEach((message) => {
            console.log(`Message ID: ${message.id}`);
            console.log(`Status: ${message.status}`);
            console.log(`Timestamp: ${new Date(message.timestamp * 1000).toISOString()}`);
         });
      }

      res.json({ message: 'Received POST request', data: body });
   } catch (error) {
      console.error('Error parsing request body:', error);
      res.status(400).json({ message: 'Failed to parse request body' });
   }
});

// Handler untuk permintaan GET (untuk verifikasi webhook)
app.get('/webhook', (req, res) => {
   const VERIFY_TOKEN = 'secret'; // Token verifikasi yang Anda atur di platform webhook
   const { mode, token, challenge } = req.query;

   // Verifikasi token dan mode
   if (mode === 'subscribe' && token === VERIFY_TOKEN) {
      console.log('Webhook verified successfully');
      res.status(200).send(challenge); // Mengirimkan challenge untuk verifikasi
   } else {
      console.error('Failed to verify webhook');
      res.status(403).json({ message: 'Failed to verify webhook' });
   }
});

app.listen(port, () => {
   console.log(`Server is running on port ${port}`);
});