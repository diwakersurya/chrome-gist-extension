var jsAjax=jsAjax||function(){
var defaultOptions={
	method:"get",
	url:null,
	successCallback:null,
	errorCallback:null,
	timeoutCallback:null,//extension
	async:true,
	data:null,
	header:null //extension
}

var mergeDefaultRecursive = function(userSuppliedOption, defaultOption) {
 for (var prop in defaultOption) {
        if(!userSuppliedOption[prop]){
            userSuppliedOption[prop]=defaultOption[prop];
        }
        if( Object.prototype.toString.call( userSuppliedOption[prop] ) === '[object Array]' ){
        	;//it is array do nothing because user option has to be kept instead of default
        }
        // Property in destination object set; update its value.
        else if (typeof defaultOption[prop] === "object") {
            mergeDefaultRecursive(userSuppliedOption[prop], defaultOption[prop]);
        } 
        else {
            userSuppliedOption[prop] = (!userSuppliedOption[prop]) ? defaultOption[prop] : userSuppliedOption[prop];
        }
    }
}
var clone = function(obj) {
  if (obj === null || typeof(obj) !== 'object' || 'isActiveClone' in obj)
    return obj;

  if (obj instanceof Date)
    var temp = new obj.constructor(); //or new Date(obj);
  else
    var temp = obj.constructor();

  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      obj['isActiveClone'] = null;
      temp[key] =   clone (obj[key]);
      delete obj['isActiveClone'];
    }
  }

  return temp;
}

var request=function(options) {
	var xhttp= new XMLHttpRequest();
	//prepare for requests other than post
	//in case of post request data will be sent directly
	if(["post","POST"].indexOf(options.method)===-1)
	{
		if(data){
			//for get request append data in the url as query string
			if(options.url.indexOf("?")===-1){
				options.url=options.url+"?"
			}
			else{
				options.url=options.url+"&";
			}
			var arrData=[];
			for(var prop in data){
				if(data.hasOwnProperty(prop)){
					arrData.push(prop+"="+data[prop]);
				}
			}
			options.url=options.url+arrData.join("&");

		}
	}
	//attach handlers to the xmlhttp request.
	xhttp.onreadystatechange=function() {
		//request has been processed by server successfully
        if (xhttp.readyState == 4 ) {
        	if ([200,201].indexOf(xhttp.status)!==-1) {
        		var responseData=xhttp.responseText;
        		try{
        			responseData=JSON.parse(responseData);
        		}
        		catch(ex){
        			responseData=xhttp.responseText;
        		}
        		options.successCallback && options.successCallback(responseData);
        	}
        	else{
        		options.errorCallback && options.errorCallback({status:xhttp.status, error:xhttp.statusText});
        	}
        }
    };
	xhttp.open(options.method, options.url, options.async);
	xhttp.send((["post","POST"].indexOf(options.method)!==-1)?options.data:"");
}


return {
	post:function(options) {
		options.method="POST";
		mergeDefaultRecursive(options,clone( defaultOptions));
		request(options);
	},
	get:function(options) {
		options.method="GET";
		mergeDefaultRecursive(options,clone( defaultOptions));
		request(options);
	},
	request:function(options) {
		mergeDefaultRecursive(options,clone( defaultOptions));
		request(options);
	}
}
}();