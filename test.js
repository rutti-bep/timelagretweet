console.log("runnning TRT")
var trtButtonList = [];
function addElement(){
  console.log("addElement");
  var elm = document.getElementsByClassName("stream-item-footer");
  
  trtButtonList.forEach(function(ele){
    ele.remove();
  });

  for (var i = 0;i<elm.length;i++){
    var TRT = document.createElement('div');
    TRT.classList.add('ProfileTweet-action');
    var button = document.createElement('button');
    button.innerHTML = 'o-o';
    button.classList.add('ProfileTweet-actionButton');
    TRT.appendChild(button);
    //TRT.setAttribute("style","width:18px;height:18px;border: 1px solid blue;")
    button.addEventListener("click", function() {
      alert("TRT");
    }, false);
    elm[i].children[1].appendChild(TRT)
    trtButtonList.push(TRT);
  }
}

addElement();
console.log(window.location.href);
//window.addEventListener("popstate",function(){ console.log("href change");}, false);

var urlObserver = new MutationObserver(function (MutationRecords, MutationObserver) {
    console.log('href change...?');
    console.log(window.location.href);
    setTimeout(function(){
    addElement();
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

tlObserver.observe(document.getElementsByClassName("stream-items")[0], {
    childList: true,
});


