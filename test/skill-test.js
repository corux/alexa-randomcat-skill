import test from 'ava';
import { handler as Skill } from '../build/skill';
import Request from 'alexa-request';
import chai from 'chai';
import chaiSubset from 'chai-subset';

const expect = chai.expect;
chai.use(chaiSubset);

test('LaunchRequest', () => {
  const event = Request.launchRequest().build();

  return Skill(event).then(response => {
    expect(response.response.outputSpeech.text).to.contain('Hallo');
    expect(response).to.containSubset({
      response: {
        shouldEndSession: false,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('AMAZON.StopIntent', () => {
  const event = Request.intent('AMAZON.StopIntent').build();

  return Skill(event).then(response => {
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('AMAZON.CancelIntent', () => {
  const event = Request.intent('AMAZON.CancelIntent').build();

  return Skill(event).then(response => {
    expect(response).to.containSubset({
      response: {
        shouldEndSession: true,
        outputSpeech: { type: 'PlainText' }
      }
    });
  });
});

test('SessionEndedRequest', () => {
  const event = Request.sessionEndedRequest().build();
  return Skill(event).then(response => {
    expect(response).to.deep.equal({});
  });
});
