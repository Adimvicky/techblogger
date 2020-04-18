const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const path = require('path');
const config = require('./config');
const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');

const app = express();

app.use(cors());
app.use(helmet());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : true}))

app.use(express.static(path.join(__dirname,'..','assets')));
app.get('/', function (req,res) {
    let indexHtml = path.join(__dirname,'..','index.html');
    console.log(indexHtml)
    res.sendFile(indexHtml);
});

app.use('/api/user',userRoutes);
app.use('/api/post',postRoutes);

app.use((error,req,res,next) => {
    console.log(error.stack);
    return res.status(500).send({success : false, message : 'A server error occured'});
});

app.use((req,res,next) => {
    return res.status(404).send({success : false, message : 'API endpoint not found'});
});

app.listen(config.api.port,() => {
    console.log(`Server is listening on port ${config.api.port}`);
});