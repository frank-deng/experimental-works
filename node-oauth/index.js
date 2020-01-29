const express=require('express'),
  bodyParser=require('body-parser'),
  oauthserver=require('express-oauth-server');

var authData={
  users:{
    'frank':'aaa'
  },
  tokens:new Map(),
  clients:new Map()
}

var app = express();
app.oauth = new oauthserver({
  model:{
    getUser(username,password){
      console.log(username,password);
      return{
        id:'frank',
        username:'frank'
      };
    },
    getClient(){
    },
    saveToken(token,client,user){
      console.log(token);
      authData.clients.set(user.id,{
        accessToken: token.accessToken,
        accessTokenExpiresAt: token.accessTokenExpiresAt,
        clientId: client.clientId,
        refreshToken: token.refreshToken,
        refreshTokenExpiresAt: token.refreshTokenExpiresAt,
        userId: user.id
      });
    },
    saveAuthorizationCode(code,client,user){
      console.log(code);
    },
    getAccessToken(accessToken){
      console.log(accessToken);
    }
  },
  debug:true
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.post('/oauth/token',app.oauth.token());
app.get('/secret',app.oauth.authorize(),function(req,res){
  res.send('Secret data');
});
app.get('/public',function(req,res){
  res.send('Public data');
});
app.listen(2333);

