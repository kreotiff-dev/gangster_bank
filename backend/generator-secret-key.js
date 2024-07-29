const crypto = require('crypto');

// Генерация случайного секретного ключа
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

const secretKey = generateSecretKey();
console.log('Сгенерированный секретный ключ:', secretKey);
