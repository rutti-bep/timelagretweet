console.log("runnning TRT")
var timelagRetweetButtonList = [];
function addElement(){
  console.log("addElement");
  var elm = document.getElementsByClassName("stream-item-footer");
  
  timelagRetweetButtonList.forEach(function(ele){
    ele.remove();
  });

  var tweetElment = document.getElementsByClassName('js-tweet-text-container');
  for (var i = 0;i < tweetElment.length; i++){
    var header = tweetElment[i].parentNode.firstElementChild;
    var footer = tweetElment[i].parentNode.lastElementChild;
    if(footer.className == "context"){
      console.log(footer)
      continue;
    }
    var tweetUrl = header.children[1].firstElementChild.href;
    var timelagRetweetElement = document.createElement('div');
    timelagRetweetElement.classList.add('ProfileTweet-action');
    var timelagRetweetButton = document.createElement('button');
    timelagRetweetButton.innerHTML = "TRT";
    timelagRetweetButton.value = tweetUrl;
    timelagRetweetButton.classList.add('ProfileTweet-actionButton');
    timelagRetweetElement.appendChild(timelagRetweetButton);
    timelagRetweetButton.addEventListener("click",function(e){
      alert(e.target.value);
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


