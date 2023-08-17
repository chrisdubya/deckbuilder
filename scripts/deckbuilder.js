/**
 * The Deckbuilder Module
 * Gives the companion the ability to fetch Magic: The Gathering card information from Scryfall
 */

async function _handleFetchCardSkill(event) {
    window.companion.SendMessage({type: "FETCH_CARD", user: event.name, value: event.value});
    const context = {
        cardName: event.value
    }

    const model = window.models.CreateModel('deckbuilder:deckbuilderapi')
    window.models.ApplyContextObject(model, context);
    await window.models.CallModel(model);
    window.models.DestroyModel(model);
}

function summarizeCard(card) {
  const name = card.name;
  const manaCost = card.mana_cost;
  const typeLine = card.type_line;
  const oracleText = card.oracle_text;
  const set = card.set_name;
  const artist = card.artist_ids && card.artist_ids[0] ? card.artist_ids[0] : 'Unknown Artist';
  const rarity = card.rarity;
  const legalities = Object.keys(card.legalities)
    .filter(key => card.legalities[key] === 'banned')
    .join(', ');
  const image = card.image_uris.normal;
  const decks = card.related_uris.tcgplayer_infinite_decks;

  return {
    name,
    manaCost,
    typeLine,
    oracleText,
    set,
    artist,
    rarity,
    legalities,
    image,
    decks
  }
}

function _handleApiResponse(response) {
  if (response.response) {
    const summary = summarizeCard(response.response);
    window.companion.SendMessage({ type: "WEB_IMAGE", user: name, value: summary.image, timestamp: Date.now(), alt: ""});
    setTimeout(() => {
      window.hooks.emit("hack_delay", `Role play that you found information about this card by querying the Scryfall API for me:\nName:${summary.name}\nMana Cost:${summary.manaCost}\nOracle Text:${summary.oracleText}\nRarity: ${summary.rarity}/-Using this information, summarize how this could help me in building a deck for Magic The Gathering, Avoid thanking me, Avoid saying I found them or shared them with you, Avoid giving any other information except for the information provided. Pretend this was all your doing`)
    }, 1000)
    // Send card details
    window.hooks.emit('moemate_core:handle_skill_text', {value: `Here's some decks utilizing ${summary.name}: ${summary.decks},`});
  } else {
    window.hooks.emit("hack_delay", `Role play that you had trouble looking up information about this card by querying the Scryfall API\n-Ask me to try again later.`)
  }
}

export function init() {
	console.log('init deckbuilder')
  window.hooks.on('deckbuilder:handle_fetch_card_skill', _handleFetchCardSkill)
  window.hooks.on('models:response:deckbuilder:deckbuilderapi', _handleApiResponse)
}
