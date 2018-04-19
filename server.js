
let express = require('express');
let app = express();
let moment = require('moment');
//let mongo = require('mongodb').MongoClient;

app.use('/stack/', express.static(__dirname + "/stack"));
let port = isNaN(process.argv[2]) ? 3000 : process.argv[2];
app.all("/:date", (req,res) => {
  res.status(200);
  res.set({'content-type': 'application/json'});
  let flag = true;
  let stamp;
  let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let nat = new Date(req.params.date);
  let day = nat.toDateString().split(' ')[2];
  if(/^[0-9]*$/.test(req.params.date)){
    stamp = moment(req.params.date, "X");
    flag = false;
  }else{
    stamp = Date.parse(req.params.date);
  }
  if(flag && stamp >= 0){
    console.log("Path" + req.route.path);
    console.log("Contains either a unix timestamp or a natural language date: " + stamp);
    let num = Number((new Date(req.params.date).valueOf()).toString().substr(0, 10));
    let myResults = {
      'unix': num,
      'natural': months[nat.getMonth()] + " " + day + ", " + nat.getFullYear()
    }
    res.json(myResults);
  }else if(!flag){
    let myResults = {
      'unix': Number(stamp.utc().format('X')),
      'natural': stamp.utc().format("MMMM D, YYYY")
    }
    res.json(myResults);
  }else{
    console.log( Date(req.params.date));
    let badResults = {
      'unix timestamp': null,
      'natural language': null
    };
    res.json(badResults);
  }

  res.end();
});
app.all("*", function(req, res, next){
  res.status(200);
  res.set( {'content-type': 'text/html'} );
  if(req.originalUrl == '/'){
    console.log( '@@@@@@@@@@@@( ' + new Date() + ' )@@@@@@@@@@@@' );
    console.log( 'Incoming: ' + JSON.stringify(req.headers.host) );
    console.log( 'User-Agent: ' + JSON.stringify(req.headers['user-agent']) );
    console.log( 'OriginalUrl: ' + JSON.stringify(req.originalUrl) );
    console.log( 'Originating IP: ' + JSON.stringify(req.ip));

    let a = JSON.stringify(req.hostname);
    let good1 = "http://" + a.substr(1, (a.length - 2)).concat(":3000/December%2015,%202015");
    let good2 = "http://" + a.substr(1, (a.length - 2)).concat(":3000/1450137600");
    console.log(good2);
    console.log(good1);
    res.write( "<h1 style='margin-left: 10%;'>A TimeStamp Micro Service</h1><p style='margin-left:10%;'>Click the link below to send a test query to the server.</p>" );
    res.write( '<div style="margin-left:10%;width:450px;height:200px;background-color:black;"><ul><li><a style="position:absolute;margin-top:25px;margin-left:10px;color:green;background-color:black;font-size:1.25em;" target="_self" href=' + good2 + '>Test Timestamp - /1450137600</a></li><li><a style="position:absolute;margin-top:100px;margin-left:10px;color:green;background-color:black;font-size:1.25em;" target="_self" href=' + good1 + '>Test TimeStamp - /December%2015,%202015</a></li></ul></div>' );
    res.end();
  }else{
    console.log(req.headers.cookie);
    res.write("<h1 style='font-size:2em;color:red;'>Restricted Area:</h1>");
    res.write("<p>Or, The page you were looking for does not exist.");
    let c = JSON.stringify(req.hostname);
    let d = "http://" + c.substr(1, (c.length - 2)).concat(":3000/");
    console.log(d);
    res.write('<h2><a target="_self" href=' + d + ' >Turn Back Now</a></h2>');
    res.end();
  }
});

app.listen(port, () => {
  console.log( "HTTP Server Started On Port: " + 3000 );
  for(var i = 0; i < 2; i++){
    console.log( '+++++++++++++++++++++++++++++++++++' );
  }
});