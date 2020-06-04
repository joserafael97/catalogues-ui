const express = require('express');

const app = express();

app.use(express.static('./dist/catalogues-ui'));

app.get('/*', (req, res) =>
    res.sendFile('index.html', {root: 'dist/catalogues-ui/'}),
);

app.listen(process.env.PORT || 8080);
