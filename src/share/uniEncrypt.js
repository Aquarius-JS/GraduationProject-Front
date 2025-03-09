import CryptoJS from 'crypto-js';

export default function uniEncrypt(password) {
  return CryptoJS.SHA256(password).toString();
}
