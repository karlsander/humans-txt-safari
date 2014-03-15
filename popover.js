safari.self.height = 600;
safari.self.width = 500;

var pre_div = document.querySelector("#pre_link")

if (safari.extension.settings.wrap_text === false) {
	pre_div.classList.remove("wrap");
}
else if (!pre_div.classList.contains("wrap")) {
	pre_div.classList.add("wrap");
}
