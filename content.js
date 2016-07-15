// content.js

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "clicked_browser_action" ) {
      console.log("message received by handler");
      chrome.runtime.sendMessage({"message": "open_new_tab", "url": "www.rummycircle.com"});
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "AUTHENTICATED" ) {
      try{
        var innercontent=document.body.innerText;
        var content = JSON.parse(innercontent);
      }
      catch(ex)
      {
        console.log(ex);
      }
     chrome.runtime.sendMessage({"message": "SAVE_AUTH_TOKEN", "access_token": content.access_token,"tab_id":request.tab_id});
    }
  }
);

chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {
    if( request.message === "GOT_GIST_DATA" ) {
    showModal(); 
}
});




