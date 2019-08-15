import { BaseRequestHandler, IExtendedHandlerInput, Intents, Request } from "@corux/ask-extensions";
import { Response } from "ask-sdk-model";
import { getPictureUrl } from "../utils";

@Request("LaunchRequest")
@Intents("AMAZON.YesIntent", "AMAZON.FallbackIntent", "AMAZON.NextIntent", "RandomCat")
export class LaunchRequestHandler extends BaseRequestHandler {
  public async handle(handlerInput: IExtendedHandlerInput): Promise<Response> {
    const t = handlerInput.t;

    const pictureUrl = await getPictureUrl();
    const builder = handlerInput.getResponseBuilder()
      .withStandardCard("", "", pictureUrl, pictureUrl);

    if (handlerInput.requestEnvelope.session.new) {
      return builder
        .speak(t("launch"))
        .reprompt(t("help.reprompt"))
        .getResponse();
    }

    return builder
      .speak(t("next"))
      .reprompt(t("help.reprompt"))
      .getResponse();
  }
}
