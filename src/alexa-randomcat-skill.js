import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask, card } from 'alexa-response';
import ssml from 'alexa-ssml-jsx';
import request from 'request-promise-native';

@Skill
export default class AlexaRandomCatSkill {

  async _getPictureUrl() {
    const url = 'http://random.cat/meow';
    const data = JSON.parse(await request(url));
    return `https://crossorigin.me/${data.file}`;
  }

  async _createCard() {
    const image = this._getPictureUrl();
    return card({
      type: 'Standard',
      image: {
        smallImageUrl: image,
        largeImageUrl: image
      }
    });
  }

  @Launch
  launch() {
    return this._createCard()
      .ask('Hallo! Ich habe ein zufälliges Katzenbild auf deine Alexa App gesendet. Möchtest du ein weiteres Bild?');
  }

  @Intent('RandomCat')
  hello() {
    return this._createCard()
      .ask('Ich habe ein zufälliges Katzenbild auf deine Alexa App gesendet. Möchtest du ein weiteres Bild?');
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('Mit diesem Skill kannst du dir zufällige Katzenbilder an deine Alexa App senden lassen. Frage einfach nach einem zufälligen Katzenbild.')
      .reprompt('Du kannst nach einem zufälligen Katzenbild fragen.');
  }

  @Intent('Yes')
  yes() {
    return this._createCard()
      .ask('Ok. Möchtest du noch ein Bild?');
  }

  @Intent('No')
  no() {
    return say('Ok. Bis bald!');
  }

  @Intent('AMAZON.CancelIntent', 'AMAZON.StopIntent')
  stop() {
    return say('Bis bald!');
  }

  @SessionEnded
  sessionEnded() {
    // need to handle session ended event to circumvent error
    return {};
  }

}
