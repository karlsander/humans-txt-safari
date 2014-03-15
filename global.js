disableIcon();

popover = safari.extension.popovers[0].contentWindow.document;
popover_object = safari.extension.popovers[0];
pre_link = popover.querySelector("#pre_link");

safari.application.addEventListener("activate", reloadPop, true);
safari.application.addEventListener("navigate", reloadPop, true);
safari.extension.settings.addEventListener("change", settingsChanged, true);

function settingsChanged(event) {
	if (event.key == "wrap_text") {
		var pre_div = popover.querySelector("#pre_link")
		
		if (event.newValue === false) {
			pre_div.classList.remove("wrap");
		}
		else if (!pre_div.classList.contains("wrap")) {
			pre_div.classList.add("wrap");
		}
	}
}

function reloadPop() {
	var currentURL = safari.application.activeBrowserWindow.activeTab.url;
	if(currentURL != undefined) {
		getTXT(currentURL);
	}
	else {
		disableIcon();
	}
}

function disableIcon() {
	var itemArray = safari.extension.toolbarItems;
	for (var i = 0; i < itemArray.length; ++i) {
		var item = itemArray[i];
		if (item.identifier == "toolbar_button") {
			item.disabled = true;
		}
	}
}

function enableIcon() {
	var itemArray = safari.extension.toolbarItems;
	for (var i = 0; i < itemArray.length; ++i) {
		var item = itemArray[i];
		if (item.identifier == "toolbar_button") {
			item.disabled = false;
		}
	}
}

function getTXT(check_url) {
	var a = document.createElement('a');
	a.href = check_url;
	if(safari.extension.settings.use_https === false && a.protocol === "https:") {
		disableIcon();
		return;
	}
	var theURL = a.protocol + "//"+ a.host + "/humans.txt";
	request = new XMLHttpRequest();
	request.open('GET', theURL, true);
	
	request.onload = function() {
	  if (request.status >= 200 && request.status < 400){
		if (request.getResponseHeader('content-type').indexOf('text/plain') > -1) {
			if (safari.extension.settings.enable_linkify === false) {
				pre_link.innerHTML = twttr.txt.htmlEscape(request.responseText);
			}
			else {
				pre_link.innerHTML = mailify(twttr.txt.autoLink(twttr.txt.htmlEscape(request.responseText)));
			}
			if(pre_link.offsetHeight < 600) {
				popover_object.height = pre_link.offsetHeight + 40;
			}
			else {
				popover_object.height = 600;
			}
			enableIcon();
		}
		else {
			disableIcon();
		}
		
	  } else {
		disableIcon();
	
	  }
	};
	
	request.onerror = function() {
	  disableIcon();
	};
		
	request.send();
}

function mailify(text) {
	var emailRegex = /([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)/g;
	return text.replace(emailRegex, function(email) {
		return email.link("mailto:" + email);
	});
}