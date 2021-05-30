const fs = require('fs');
const path = require('path');
const express = require('express');

const app = express();
app.set('view-engine', 'ejs');

// default for ejs parameter
app.use(function(req, res, next) {
    res.locals.title = null;
    res.locals.favicon = null;
    next();
});

// main page by static
// app.use('/', express.static(path.join(__dirname, `/views/main`)));

app.get('/develop/Text%20beautify', function(req, res, next) {
    res.redirect('/beautify');
});

app.get('/game/IdentityV', function(req, res, next) {
    res.redirect('/IdentityV');
});

// make index.ejs as the default for url ended with "/"
app.all(/\/$/, function(req, res, next) {
    var filePath = path.join(__dirname, '/views' + req.url + 'index.ejs');
    // console.log(filePath);
    if (fs.existsSync(filePath)) {
        res.render(filePath);
    } else { next(); }
});

app.use('/', express.static(path.join(__dirname, `/views`)));

app.use((req, res, next) => {
    console.log(req.url);
    res.redirect('/404/');
});

const port = process.env.PORT || 3000;
server = app.listen(port, function() {
    console.log(`Personal page of Jeuk Hwang listening on port ${port}`);
});