console.log("runnning TLRT")

var timelagRetweetButtonList = [];
function addElement(){
  console.log("addElement");
  
  timelagRetweetButtonList.forEach(function(ele){
    ele.remove();
  });

  var tweetElment = document.getElementsByClassName('stream-item-footer');
  for (var i = 0;i < tweetElment.length; i++){
    var footer = tweetElment[i];
    var timelagRetweetElement = document.createElement('div');
    timelagRetweetElement.classList.add('ProfileTweet-action');
    var timelagRetweetButton = document.createElement('button');
    timelagRetweetButton.innerHTML = "TLRT";
    timelagRetweetButton.classList.add('ProfileTweet-actionButton');
    timelagRetweetElement.appendChild(timelagRetweetButton);
    timelagRetweetButton.addEventListener("click",function(e){
      var tweet = window.location.href.match(RegExp(/^https:\/\/twitter\.com\/\S*\/status\/[0-9]*$/)) ? e.target.parentNode.parentNode.parentNode.parentNode : e.target.parentNode.parentNode.parentNode.parentNode.parentNode;
      var url = tweet.getAttribute("data-permalink-path")//.parentNode;//firstElementChild.children[1].firstElementChild.href;
      //alert(url);
      chrome.runtime.sendMessage({method: 'setValue',key:'retweetUrl', value: url}, function (response) {
        if(response){
            var windowObj = window.open(chrome.extension.getURL("dest/html/retweetSet.html"),"_blank","width=500px,height=250px")
            windowObj.locationbar.visible = false;
        }else{
          console.log(response)
        }
      });
    },false);
    footer.children[1].appendChild(timelagRetweetElement);
    timelagRetweetButtonList.push(timelagRetweetElement)
  }
}

addElement();
console.log(window.location.href);
//window.addEventListener("popstate",function(){ console.log("href change");}, false);
var tlStream = document.getElementsByClassName("stream-items")[0];

var urlObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
    console.log('href change...?');
    console.log(window.location.href);
    setTimeout(function(){
    addElement();
    tlStream = document.getElementsByClassName("stream-items")[0];
    },1000)
});
urlObserver.observe(document.getElementsByClassName("logged-in")[0], {
    attributes: true,
});

var tlObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
    console.log('child add...?');
    addElement();
    //console.log();
});

tlObserver.observe(tlStream, {
    childList: true,
});


