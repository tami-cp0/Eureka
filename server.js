import express from 'express';
import { config } from "dotenv";
import path from 'path';
import { fileURLToPath } from 'url';
import router from './routes/index.js';

config();

const app  = express();
const port = process.env.PORT;

// Manually define __dirname for ES module
const __dirname = path.dirname(fileURLToPath(import.meta.url));

app.set('view engine', 'ejs');
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true }));

app.use('/public', express.static(__dirname + '/public'));

app.use(router);

app.listen(port, () => {
  console.log(`Eureka listening at http://localhost:${port}`);
});
