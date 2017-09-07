chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  var response = {"status":true};
  switch (request.method){
    case "setRetweet":// sec,url,comment
      setTimeout(Retweet(request.url,request.comment),sec);
      break;
    case "setValue":
      localStorage.setItem(request.key,request.value);
      response["key"] = request.key;
      response["value"] = localStorage.getItem(request.key);
      break;
    case "getValue":
      response["value"] = localStorage.getItem(request.key);
      break;
    case "getTwitter":
      response["twitter"] = twitter();
      break;
    default:
      console.log('no method' + request.method);
      response["status"] = false
        break;
  }
  sendResponse(response);
})

var config = {};
var twitter;

var getConfig = new Promise((resolve, reject)=> {
  var file = 'config.json';
  var xhr = new XMLHttpRequest();
  xhr.addEventListener('loadend', function() {
    if(xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
      _config = JSON.parse(xhr.responseText);
      config = _config["twitter"];
      console.log("xhr end");
      resolve();    
    }else{
      reject("xhr error");
    }
  });
  xhr.open('GET', chrome.extension.getURL(file), true);
  xhr.send();
})

getConfig
.catch((err)=>{return console.log("error",err)})
.then(()=>{
  class Twitter {
    static init() {
      var oauth = ChromeExOAuth.initBackgroundPage(config);
      oauth.callback_page = 'dest/html/oauthPage.html';
      return new this(oauth);
    }

    constructor(oauth /* ChromeExOAuth */) {
      this.oauth = oauth;
    }

    auth() {
      return new Promise((resolve, reject) => {
        this.oauth.authorize((/* token, secret */) => {
          resolve(/* {token, secret} */);
        })
      })
    }

    request(method, url, data) {
      return new Promise((resolve, reject) => {
        if (!this.oauth.hasToken()) return reject();
        this.oauth.sendSignedRequest(
            url,
            (res) => {
              try {
                let data = JSON.parse(res);
                if (data.errors && data.errors.length) return reject();
                else resolve(data);
              } catch (err) { reject(err); }
            },
            {method, method}
            );
      })
    }
  }
  twitter = Twitter.init();
  console.log("twitter",twitter)
})
//.then(()=>{twitter.auth()})
//.then((token)=>{return console.log(token)})
.catch((err)=>{return console.log(err)})
