var twitter = chrome.extension.getBackgroundPage().twitter;
if(!twitter.oauth.hasToken()){
  alert("twitter認証がされていません。認証ページへ移動します")
  location.href=chrome.extension.getURL("dest/html/oauthPage.html")
}else{
  console.log(twitter)
}
