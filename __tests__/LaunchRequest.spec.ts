import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("LaunchRequest Handler", () => {
  let alexa: VirtualAlexa;
  beforeEach(() => {
    alexa = VirtualAlexa.Builder()
      .handler(handler)
      .interactionModelFile("models/de-DE.json")
      .create();
    alexa.filter((requestJSON) => {
      requestJSON.request.locale = "de-DE";
    });
  });

  const expectCard = (result) => {
    expect(result.response.card.image.smallImageUrl)
      .toBe(result.response.card.image.largeImageUrl);
    expect(result.response.card.image.smallImageUrl)
      .toContain("https://i35kgypfrd.execute-api.eu-west-1.amazonaws.com/production/");
  };

  test("LaunchRequest", async () => {
    const result = await alexa.launch();

    expect(result.response.outputSpeech.ssml)
      .toContain("Hallo! Ich habe ein zufälliges Katzenbild an deine Alexa App gesendet.");
    expect(result.response.reprompt.outputSpeech.ssml)
      .toContain("Du kannst mich nach einem zufälligen Katzenbild fragen.");
    expect(result.response.shouldEndSession).toBe(false);
    expectCard(result);
  });

  ["RandomCat", "AMAZON.YesIntent", "AMAZON.NextIntent", "AMAZON.FallbackIntent"].forEach((intent) => {
    test(intent, async () => {
      const result = await alexa.request().intent(intent).set("session.new", false).send();

      expect(result.response.outputSpeech.ssml)
        .toContain("Ok. Möchtest du ein weiteres Bild?");
      expect(result.response.reprompt.outputSpeech.ssml)
        .toContain("Du kannst mich nach einem zufälligen Katzenbild fragen.");
      expect(result.response.shouldEndSession).toBe(false);
      expectCard(result);
    });
  });
});
