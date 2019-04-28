import { VirtualAlexa } from "virtual-alexa";
import { handler } from "../src";

describe("AMAZON.HelpIntent Handler", () => {
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

  test("Provide help message", async () => {
    const result = await alexa.intend("AMAZON.HelpIntent");
    expect(result.response.outputSpeech.ssml)
      .toContain("Mit diesem Skill kannst du dir zufällige Katzenbilder an deine Alexa App senden lassen.");
    expect(result.response.shouldEndSession).toBe(false);
  });
});
