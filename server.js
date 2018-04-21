let express = require('express');
let app = express();
let moment = require('moment');
//let mongo = require('mongodb').MongoClient;

function compare(arg, req){
  let totaldays = 0;
  let years = 0;
  let rem = 0;
  let stamp = new Date(req.params.date);
  let months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  let d = months[stamp.getMonth()];
  let b = stamp.toDateString().split(' ').pop();
  let c = stamp.toDateString().split(' ')[2];
  if(d == undefined){
    d = null;
  }else{
    d = d + " " + c + ", " + b;
  }
  let g = Number(moment(stamp, "X").format('X'));
  // arg = true if date was evaluated to be a number.
  //  false for NaN
  if(arg){
    // total days since 1970
    let unx = Number(req.params.date);
    totaldays = Number(req.params.date)/86400;
    years = (totaldays/365.22199999);
    years = Number(years.toString().split('.').shift());
    years = 1970 + years;
    rem = totaldays%365.222199999;
    let s = moment.unix(req.params.date).format('MMMM DD, YYYY');
    return {
        unix: unx,
        natural: s
      }
  }else{
    
    return {
        unix: g,
        natural: d
      }
  }
}
app.use('/stack/', express.static(__dirname + "/stack"));
let port = isNaN(process.argv[2]) ? 3000 : process.argv[2];
app.get("/:date", (req,res) => {
  res.status(200);
  res.set({'content-type': 'application/json'});
  console.log();
  console.log("Request from: " + req.headers['x-forwarded-for']);
  console.log("for: " + JSON.stringify(req.params));
  
  let getObj = (Number.isInteger(Number(req.params.date)))? compare(true,req): compare(false,req);
  
  res.json(getObj);
  
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
    let good1 = "http://" + a.substr(1, (a.length - 2)).concat("/December%2015,%202015");
    let good2 = "http://" + a.substr(1, (a.length - 2)).concat("/1450137600");
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
    let d = "http://" + c.substr(1, (c.length - 2)).concat("/");
    console.log(d);
    res.write('<h2><a target="_self" href=' + d + ' >Turn Back Now</a></h2>');
    res.end();
  }
});

app.listen(3000, () => {
  console.log( "HTTP Server Started On Port: " + 3000 );
  for(var i = 0; i < 2; i++){
    console.log( '+++++++++++++++++++++++++++++++++++' );
  }
});
