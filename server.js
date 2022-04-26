const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');
const serveStatic = require('serve-static');
const session = require('express-session');

//Specify url path
var $path =  __dirname + '/public/uploads/'; // Physical path
var $urlpath = '/uploads'; // URL path

app.use(cors());
app.use(express.urlencoded({
    extended: true
}));
app.use(express.json({ limit: '50mb' }));
app.use(serveStatic(path.join(__dirname, '/public')));

app.use(session({
    secret: 'Your_Secret_Key',
    resave: true,
    saveUninitialized: true,
    rolling: true, 
    cookie: {
        httpOnly: true,
        maxAge: 1*60*60*1000
    }
}))

app.post('/upload', (req, res) => {
    const base64Data = req.body.image;
    const filename = req.body.filename;
    require('fs').writeFile($path + '/' + filename, base64Data, 'base64', ()=>{
        res.status(200).json({
            success: true,
            url: `${$urlpath}/${filename}` // return saved file url
        })
    });
});

// Save content into session (normally you will save the content into a database)
app.post('/save', (req, res) => {

    req.session.html = req.body.html;
    req.session.mainCss = req.body.mainCss;
    req.session.sectionCss = req.body.sectionCss;

    res.status(200).json({
        success: true,
        html: req.body.html,
        // body: req.body
    });
});

// Load content from session (normally you will load the content from a database)
app.get('/load', (req, res) => {
    res.json({
        html: req.session.html,
        mainCss: req.session.mainCss,
        sectionCss: req.session.sectionCss
    });
});

app.get('/hello', (req, res) => {
    res.send('Hello');
});

app.listen(8081, function() {
    console.log('App running on port 8081');
});
