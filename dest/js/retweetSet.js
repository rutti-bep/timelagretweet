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
.then(()=>{return getReTweetUrl;})
.then(()=>{
  return new Promise((resolve,reject)=>{
    var tweetCardRequest = new XMLHttpRequest();
    var url = "https://publish.twitter.com/oembed?url="+retweetUrl+"&omit_script=true&maxwidth=300";
    tweetCardRequest.open("GET",url,true);
    tweetCardRequest.onload = function(){
      if (tweetCardRequest.readyState === 4) {
        if (tweetCardRequest.status === 200) {
          var jsonRes = JSON.parse(tweetCardRequest.responseText);
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
})
.then(()=>{
  return new Promise((resolve,reject)=>{
    var submitButton = document.getElementById("retweet-submit");
    submitButton.addEventListener('click', submit, false);

    function submit(){
      var time = document.getElementById('retweet-time').value;
      var comment = document.getElementById('comment').value;
      console.log(time,comment);

      var timeArray = String(time).split(':');
      var now = new Date();
      var timeleft = ((Number(timeArray[0])-now.getHours())*60+(Number(timeArray[1])-now.getMinutes()))*60*1000-(now.getSeconds()*1000);
      if(timeleft < 0){
        timeleft += 24*60*60*1000;
      }

      var request = {method:"setRetweet","tweetUrl":retweetUrl,"timeleft":timeleft};
      if(!comment == false){request["comment"] = comment}
      console.log("retweetRequest :",request) 

      chrome.runtime.sendMessage(request,function (response){
        console.log(response["status"]);
        if(!response["status"]){reject();}
        resolve();
      });
    }
  });
})
.catch((err)=>{return alert("errorが発生しました "+err+" リロードで治る可能性があります...")})
.then(()=>{return new Promise((resolve)=>{
  alert("settingが完了しました。ページを閉じます");
  window.close();
  resolve();

})})
