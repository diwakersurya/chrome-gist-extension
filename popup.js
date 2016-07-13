var clientID="2f9d0b425c09004de6ab";
var githubURL="https://github.com/login/oauth/authorize?scope=gist&client_id="+clientID;
//document.querySelector('#github_anchor').setAttribute("href",githubURL);
document.querySelector('#get_token').addEventListener('click', function() {
	chrome.tabs.create({url: githubURL});
	   return false;
});
