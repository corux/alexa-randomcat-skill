import { HandlerInput } from "ask-sdk-core";
import { Response } from "ask-sdk-model";
import { BaseIntentHandler, getPictureUrl, Intents, Request } from "../utils";

@Request("LaunchRequest")
@Intents("AMAZON.YesIntent", "AMAZON.FallbackIntent", "AMAZON.NextIntent", "RandomCat")
export class LaunchRequestHandler extends BaseIntentHandler {
  public async handle(handlerInput: HandlerInput): Promise<Response> {
    const t = handlerInput.attributesManager.getRequestAttributes().t;

    const pictureUrl = await getPictureUrl();
    const builder = handlerInput.responseBuilder
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
