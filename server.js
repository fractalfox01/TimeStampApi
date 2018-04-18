let express = require('express');
let app = express();
let mongo = require('mongodb').MongoClient;

let port = isNaN(process.argv[2]) ? 8420 : process.argv[2];
app.all("/stamp/:date", (req,res) => {
  res.status(200);
  res.set({'content-type': 'application/json'});
  console.log("inside stamp");
  console.log(JSON.stringify(req.params.date));
  let originalQuery = req.params.date;
  console.log(originalQuery.split(','));
  res.json(req.params);
  res.end();
});
app.all("*", function(req, res, next){
  console.log( '@@@@@@@@@@@@( ' + new Date() + ' )@@@@@@@@@@@@' );
  console.log( 'Incoming: ' + JSON.stringify(req.headers.host) );
  console.log( 'User-Agent: ' + JSON.stringify(req.headers['user-agent']) );
  console.log( 'OriginalUrl: ' + JSON.stringify(req.originalUrl) );
  console.log( 'Originating IP: ' + JSON.stringify(req.ip));
  res.status(200);
  res.set( {'content-type': 'text/html'} );
  res.write( "<h1 style='margin-left: 10%;'>A TimeStamp Micro Service</h1><p style='margin-left:10%;'>Click the link below to send a test query to the server.</p>" );
  res.write( "<div style='margin-left:10%;width:500px;height:100px;background-color:black;'><a style='position:absolute;margin-top:25px;margin-left:100px;color:green;background-color:black;' href='http://localhost:8420/stamp/Apr 20, 2018'>Test Timestamp</a></div>" );
  next();
});
app.post('*', function(req, res){
  console.log(req.method);
  res.end();
});
app.get('*', function(req, res){
  console.log(req.method);
  res.end();
});

app.listen(port, () => {
  console.log( "HTTP Server Started On Port: " + port );
  for(var i = 0; i < 2; i++){
    console.log( '+++++++++++++++++++++++++++++++++++' );
  }
});