const crypto = require('crypto');

// Генерация случайного секретного ключа
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex'); // Генерация ключа длиной 32 байта (256 бит) в формате шестнадцатеричной строки
};

const secretKey = generateSecretKey();
console.log('Сгенерированный секретный ключ:', secretKey);
