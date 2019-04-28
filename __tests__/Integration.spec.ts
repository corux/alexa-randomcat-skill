import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("Integration", () => {
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

  test("Randomcat", async () => {
    let result = await alexa.launch();
    expect(result.response.outputSpeech.ssml)
      .toContain("Hallo! Ich habe ein zufälliges Katzenbild an deine Alexa App gesendet.");
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.intend("AMAZON.YesIntent");
    expect(result.response.outputSpeech.ssml).toContain("Ok. Möchtest du ein weiteres Bild?");
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.intend("AMAZON.NextIntent");
    expect(result.response.outputSpeech.ssml).toContain("Ok. Möchtest du ein weiteres Bild?");
    expect(result.response.shouldEndSession).toBe(false);

    result = await alexa.intend("AMAZON.StopIntent");
    expect(result.response.outputSpeech.ssml).toContain("Bis bald!");
    expect(result.response.shouldEndSession).toBe(true);
  });
});
