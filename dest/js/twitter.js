window.onload = function() {
    ChromeExOAuth.initCallbackPage();
}

var getReTweetUrl = new Promise((resolve, reject)=> {
  chrome.runtime.sendMessage({method:"getValue",key:"retweetUrl"},function (response){
    console.log(response);
    if(!response){reject();}
    url = response["value"];
    resolve();
  })
})

