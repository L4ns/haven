const axios = require('axios');
const { address } = require('./address'); // Import address dari file address.js

// URL faucet
const faucetUrl = 'https://testnet.haven1.org/faucet';

// Data untuk mengklaim faucet
const claimData = {
  address: address, // Menggunakan address dari file address.js
};

async function claimFaucet() {
  try {
    const response = await axios.post(faucetUrl, claimData);
    if (response.status === 200) {
      console.log('Faucet claimed successfully:', response.data);
    } else {
      console.log('Failed to claim faucet:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error claiming faucet:', error.message);
  }
}

// Jalankan fungsi claimFaucet
claimFaucet();
