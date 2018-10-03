import { Skill, Launch, Intent, SessionEnded } from 'alexa-annotations';
import { say, ask } from 'alexa-response';
import request from 'request-promise-native';

@Skill
export default class AlexaRandomCatSkill {

  /**
   * Gets a random element from an array.
   */
  _getRandomEntry(array) {
    return array[Math.floor(Math.random() * (array.length + 1))];
  }

  _isValidUrl(url) {
    const validExtensions = ['.jpg', '.jpeg', '.png'];
    return validExtensions.some(ext => url.trim().toLowerCase().endsWith(ext));
  }

  async _getPictureUrl() {
    let data;
    do {
      const url = 'https://aws.random.cat/meow';
      data = JSON.parse(await request(url));
    } while (!this._isValidUrl(data.file));
    return `https://gobetween.oklabs.org/pipe/${data.file}`;
  }

  async _createCard(response) {
    const image = await this._getPictureUrl();
    return response.card({
      type: 'Standard',
      image: {
        smallImageUrl: image,
        largeImageUrl: image
      }
    });
  }

  @Launch
  launch() {
    return this._createCard(ask('Hallo! Ich habe ein zufälliges Katzenbild auf deine Alexa App gesendet. Möchtest du ein weiteres Bild?'));
  }

  @Intent('RandomCat')
  hello() {
    return this._createCard(ask('Ich habe ein zufälliges Katzenbild auf deine Alexa App gesendet. Möchtest du ein weiteres Bild?'));
  }

  @Intent('AMAZON.HelpIntent')
  help() {
    return ask('Mit diesem Skill kannst du dir zufällige Katzenbilder an deine Alexa App senden lassen. Frage einfach nach einem zufälligen Katzenbild.')
      .reprompt('Du kannst nach einem zufälligen Katzenbild fragen.');
  }

  @Intent('AMAZON.YesIntent', 'Yes')
  yes() {
    const texts = [
      'Ok. Möchtest du noch ein Bild?',
      'Ok. Möchtest du ein weiteres Bild?',
      'Alles klar. Noch eines?',
      'Alles klar. Willst du noch eines?'
    ];
    return this._createCard(ask(this._getRandomEntry(texts)));
  }

  @Intent('AMAZON.NoIntent', 'No')
  no() {
    return say('Bis bald!');
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
