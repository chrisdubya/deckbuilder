/**
 * The Deckbuilder Module
 * Gives the companion the ability to fetch Magic: The Gathering card information from Scryfall
 */

async function _handleFetchCardSkill(keywords) {
	console.log('got it', keywords)
    const context = {
        cardName: keywords.value
    }
    const model = window.models.CreateModel('deckbuilder:scryfallapi')
    window.models.ApplyContextObject(model, context);
    await window.models.CallModel(model);
    window.models.DestroyModel(model);
}
 
function _handleApiResponse({response}) {
    const responseObj = JSON.parse(response);
    const name = window.companion.GetCharacterAttribute('name');

    // Send card details
    const cardDetails = `Card Name: ${responseObj.name}\nType: ${responseObj.type_line}\nOracle Text: ${responseObj.oracle_text}`;
    window.hooks.emit('moemate_core:handle_skill_text', {name: name, value: cardDetails});
}
 
export function init() {
	console.log('init new deckbuilder')
    window.hooks.on('deckbuilder:handle_fetch_card_skill', _handleFetchCardSkill)
    window.hooks.on('models:response:deckbuilder:scryfallapi', _handleApiResponse)
}