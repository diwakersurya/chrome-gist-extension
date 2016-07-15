var showModal=function() {
	// Get the modal
	// 
	setupModal();
} 

var StringToNode = function(htmlString) {
    var container = document.createElement("div");
    container.innerHTML = htmlString;
    return container.children[0];
}
var UniqueId = function() {
    //generate a nearly random string
    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
            .toString(16)
            .substring(1);
    }
    return '_' + s4() + s4() + '_' + s4() + '_' + s4() + '_' +
        s4() + '_' + s4() + s4() + s4();
}
var setupModal=function() {
	var uid="_"+UniqueId();
	var div=StringToNode('<!-- The Modal --> <div><div id="myModal" class="modal"> <!-- Modal content --> <div class="modal-content"> <span class="close">x</span><!-- Text input--> <div class="form-group"> <label class="col-md-4 control-label" for="gistname">Gist Name</label> <div class="col-md-4"> <input id="gistname" name="gistname" type="text" placeholder="gist-to-do-x" class="form-control input-md" required=""> <span class="help-block">Give a name to the gist.</span> </div> </div> <!-- Select Basic --> <div class="form-group"> <label class="col-md-4 control-label" for="gisttype">Gist Type</label> <div class="col-md-4"> <select id="gisttype" name="gisttype" class="form-control"> <option value="js">javascript</option> <option value="css">css</option> <option value="py">python</option> <option value="rb">ruby</option> <option value="go">go</option> <option value="html">html</option> <option value="txt">text</option> </select> </div> </div> <!-- Textarea --> <div class="form-group"> <label class="col-md-4 control-label" for="description">Description</label> <div class="col-md-4"> <textarea class="form-control" id="description" name="description">This is a gist created by chrome gist extension. It ...</textarea> </div> </div> <!-- Button --> <div class="form-group"> <label class="col-md-4 control-label" for="submit"></label> <div class="col-md-4"> <button id="submit" name="submit" class="btn btn-success">Submit</button> </div> </div></div> </div><div>'); 
	div.setAttribute("class",uid);
	var modal = div.querySelector('#myModal');
	var modalContent=div.querySelector('.modal-content');
	var close = div.querySelector(".close");
	var gistName=div.querySelector("#gistname");
	var gistType=div.querySelector("#gisttype");
	var gistDescription=div.querySelector("#description");
	// When the user clicks on <span> (x), close the modal
	close.onclick = function() {
		document.body.removeChild(div);
	    //modal.style.display = "none";
	}
	// When the user clicks anywhere outside of the modal, close it
	window.onclick = function(event) {
	    if (event.target == modal) {
	    	modal.classList.remove("active-modal");
	    	modalContent.classList.remove("active-modal-content");
	    	setTimeout(function() {
	    		document.body.removeChild(div);
	    	},1000)
	    	
	    }
	}
	var submitHandler=function(e) {
		e.preventDefault();
		var name=gistName.value||"";
		var type= gistType.options[gistType.selectedIndex].value||"";
		var description=gistDescription.value||"";
		alert(name+">>>>>>>>"+type+">>>>>>>>>"+description);
		close.click();

		chrome.runtime.sendMessage({"message": "SAVE_GIST",name:name,type:type,description:description});
	}
	var submitButton=div.querySelector("#submit");
	submitButton.addEventListener("click",submitHandler,false);
	document.body.appendChild(div);
	modal.classList.add("active-modal");
	modalContent.classList.add("active-modal-content");
	document.body.appendChild(div);
	modal.classList.add("active-modal");
	modalContent.classList.add("active-modal-content");




}





