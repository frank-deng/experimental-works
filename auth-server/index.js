const userData={
  'frank':'77646f5a4f3166637627abe998e7a1470fe72d8b430f067dafa86263f1f23f94',
  'aaa':'77646f5a4f3166637627abe998e7a1470fe72d8b430f067dafa86263f1f23f94'
}

const commander=require('commander')
  .option('-P, --port <port>', 'Specify port.', 2333)
  .option('-H, --host <host>', 'Specify binding host.', '127.0.0.1')
  .parse(process.argv);

const crypto=require('crypto');
const app=require('express')();
const bodyParser=require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const session=require('express-session');
app.use(session({
  secret:'aaa',
  resave: false,
  saveUninitialized: false,
  cookie:{}
}));

app.post('/login',function(req,res){
  var passed=false;
  try{
    var username=req.body.username, password=req.body.password;
    if(username && password
      && userData[username]===crypto.createHash('SHA256').update(password).digest('hex')){
      passed=true;
    }
    if(passed){
      req.session.user=username;
    }
  }catch(e){
    console.error(e);
  }
  res.json({
    status:(passed?'success':'failed')
  });
});
app.post('/logout',function(req,res){
  req.session.destroy(()=>{
    res.json({
      status:'success'
    });
  });
});

function checkSession(req,res,next){
  if(!req.session.user){
    res.status(403).json({
      message:'Please login first'
    });
    return;
  }
  next();
}
app.get('/private',checkSession,function(req,res){
  res.json({
    message:'Private text'
  });
});
app.get('/',function(req,res){
  res.json({
    message:'Public text'
  });
});

console.log(`Server is running at ${commander.host}:${commander.port}`);
app.listen(commander.port);

