const express = require('express');
var fs = require('fs');
var kgs_aggregator = require('kgs_results_aggregator');

const PORT = process.env.PORT || 8080;

const app = express(); 
var querier = new kgs_aggregator();

//serviamo in GET la root
app.get('/', (req, res) => {
    console.log('Homepage');
    fs.readFile('index.html', (err, data) => {
        res.write(data);
        res.end();
    });
    
});

//serviamo la ricerca brutale della keyword inserita (può essere anche un'espressione regolare)
app.get('/brutalSearch', (req, res) => {
    console.log('brutalSearch(express)');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var rankingMode = myURL.searchParams.get('rankBy');
    var results = querier.brutalSearch(keyword, rankingMode);
    //per adesso inviamo la stessa key inserita, in seguito 
    // i risultati della ricerca su lod cloud/datahub o un aggregato di entrambi
    res.json(results);
});

app.get('/multiTagSearch', (req, res) => {
    console.log('multiTagSearch(express');
    //url formatting
    const myURL = new URL(req.url, 'https://127.0.0.1:'+PORT);
    console.log(myURL);
    var keyword = myURL.searchParams.get('keyword');
    var rankingMode = myURL.searchParams.get('rankBy');
    var tags = myURL.searchParams.get('tags').split(',');
    var results = querier.multiTagSearch(keyword, ...tags, rankingMode);
    //per adesso inviamo la stessa key inserita, in seguito 
    // i risultati della ricerca su lod cloud/datahub o un aggregato di entrambi
    res.json(results);
});

app.listen(PORT, function(){
    console.log('sono in ascolto sulla porta 8080');
});