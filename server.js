const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// ...configuración de middlewares y rutas...

app.listen(port, () => {
  console.log(`Servidor escuchando en el puerto ${port}`);
});
