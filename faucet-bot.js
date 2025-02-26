const axios = require('axios');
const { address } = require('./address'); // Import address dari file address.js

// URL faucet
const faucetUrl = 'https://testnet.haven1.org/faucet';

// Data untuk mengklaim faucet
const claimData = {
  address: address, // Menggunakan address dari file address.js
};

// Fungsi untuk mengklaim faucet
async function claimFaucet() {
  try {
    const response = await axios.post(faucetUrl, claimData);
    if (response.status === 200) {
      if (response.data.success) {
        console.log('Faucet claimed successfully:', response.data.message);
        return true;
      } else if (response.data.message.includes('already claimed')) {
        const nextClaimTime = new Date(response.data.next_available).toLocaleString();
        console.log('Faucet already claimed. Next claim available at:', nextClaimTime);
        return new Date(response.data.next_available);
      } else {
        console.log('Failed to claim faucet:', response.data.message);
        return false;
      }
    } else {
      console.log('Failed to claim faucet:', response.status, response.statusText);
      return false;
    }
  } catch (error) {
    console.error('Error claiming faucet:', error.message);
    return false;
  }
}

// Fungsi untuk menunggu hingga waktu tertentu
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Fungsi utama untuk menjalankan klaim faucet secara terus-menerus
async function main() {
  while (true) {
    const result = await claimFaucet();
    if (result === true) {
      // Jika klaim berhasil, tunggu 24 jam sebelum mencoba lagi
      await sleep(24 * 60 * 60 * 1000);
    } else if (result instanceof Date) {
      // Jika sudah diklaim, tunggu hingga waktu berikutnya tersedia
      const waitTime = result - new Date();
      if (waitTime > 0) {
        await sleep(waitTime);
      }
    } else {
      // Jika gagal, coba lagi setelah 1 menit
      await sleep(1 * 60 * 1000);
    }
  }
}

// Jalankan fungsi utama
main();
