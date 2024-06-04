const express = require('express');
const fs = require('fs');
const path = require('path');
const router = express.Router();
const config = require('../config/config')

router.get('/exchange-rates', (req, res) => {
  const filePath = path.join(config.CBR_FILE_PATH, 'daily_json.js');
  
  fs.readFile(filePath, 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ message: 'Ошибка чтения файла', error: err });
    }
    
    try {
      const exchangeRates = JSON.parse(data);
      res.json(exchangeRates);
    } catch (parseErr) {
      res.status(500).json({ message: 'Ошибка парсинга данных', error: parseErr });
    }
  });
});

module.exports = router;
