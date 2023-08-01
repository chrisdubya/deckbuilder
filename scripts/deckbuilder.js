async function _handleBuildDeckSkill(card) {
	console.log(card);
	const context = {
		scryfallApiQueryString: card.value,
	};
	const model = window.models.CreateModel("deckbuilder:scryfallapi");
	window.models.ApplyContextObject(model, context);
	await window.models.CallModel(model);
	window.models.DestroyModel(model);
}

function _handleApiResponse({ response }) {
	const responseObj = JSON.parse(response);
	const name = window.companion.GetCharacterAttribute("name");
	console.log(responseObj);
	const card = JSON.parse(response).name;
	window.hooks.emit("moemate_core:handle_skill_text", {
		name: name,
		value: card,
	});
}

export function init() {
	console.log("init deck builder");
	window.hooks.on("deckbuilder:handle_find_card_skill", _handleBuildDeckSkill);
	window.hooks.on(
		"models:response:deckbuilder:scryfallapi",
		_handleApiResponse
	);
}
