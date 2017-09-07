var twitter = chrome.extension.getBackgroundPage().twitter;
var retweetUrl;
var authenticatedPromise;

if(!twitter.oauth.hasToken()){
  alert("twitter認証がされていません。認証ページへ移動します")
    var twitter = chrome.extension.getBackgroundPage().twitter;
  authenticatedPromise = twitter.auth();
}else{
  authenticatedPromise = new Promise((resolve)=>{resolve()});
}

var getReTweetUrl = new Promise((resolve, reject)=> {
  chrome.runtime.sendMessage({method:"getValue",key:"retweetUrl"},function (response){
    console.log(response);
    if(!response){reject();}
    retweetUrl = "https://twitter.com"+response["value"];
    resolve();
  });
});

authenticatedPromise
.then(()=>{return getReTweetUrl})
  .then(()=>{
    return new Promise((resolve,reject)=>{
      var tweetCardRequest = new XMLHttpRequest();
      var url = "https://publish.twitter.com/oembed?url="+retweetUrl+"&omit_script=true";
      tweetCardRequest.open("GET",url,true);
      tweetCardRequest.onload = function(){
        if (tweetCardRequest.readyState === 4) {
          if (tweetCardRequest.status === 200) {
            var jsonRes = JSON.parse(tweetCardRequest.responseText)
            var html = jsonRes.html;
            var tweetCard = document.getElementById('tweetcard')
            tweetCard.innerHTML = html;

            var script = document.createElement('script');
            script.src = "https://platform.twitter.com/widgets.js"; 
            
            document.getElementById('tweetcard').appendChild(script);
            
            console.log(html)
            resolve();
          } else {
            reject();
          }
        }
      }
      tweetCardRequest.onerror = () => reject(tweetCardRequest.statusText);
      tweetCardRequest.send(null);
    })
  }).catch((err)=>{return console.log("error",err)})
