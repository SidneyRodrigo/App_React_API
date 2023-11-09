const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(cors());

app.get('/api/localizacao', (req, res) => {
  const dadosLocalizacao = {
    latitude: req.query.latitude || 0,
    longitude: req.query.longitude || 0,
  };

  res.json(dadosLocalizacao);
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
