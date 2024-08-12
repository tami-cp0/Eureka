import express from 'express';

const app  = express();
const port = process.env.PORT || 6789;

app.set('view engine', 'ejs');
app.use(express.json({ limit: '5mb' }));
app.use('/public', express.static(__dirname + '/public'));
app.use(router);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${PORT}`);
});