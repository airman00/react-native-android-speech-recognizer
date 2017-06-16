
import { NativeModules, NativeAppEventEmitter,Platform } from 'react-native';

const { RNAndroidSpeechRecognizer } = NativeModules;

const {
  SpeechRecognizer,
  RecognizerIntent,
  RecognitionListener,
  isRecognitionAvailable,
  cancel,
  destroy,
  startListening,
  stopListening
} = RNAndroidSpeechRecognizer || {};

let setRecognitionListener;
let createSpeechRecognizer;

if (Platform.OS === 'android') {
  const eventPrefix = 'RNAndroidSpeechRecognizer_';
  RNAndroidSpeechRecognizer.setEventPrefix(eventPrefix);

  let emitterSubscriptions = [];

  setRecognitionListener = listener => {
    const keys = Object.keys(listener);
    emitterSubscriptions.forEach(subscription => subscription.remove());
    RNAndroidSpeechRecognizer.enableEvents(keys);
    emitterSubscriptions = keys.map(key =>
      NativeAppEventEmitter.addListener(eventPrefix + key, listener[key])
    );
   }

  createSpeechRecognizer = (...args) => 
    RNAndroidSpeechRecognizer.createSpeechRecognizer(...args).then(() => ({
      cancel,
      destroy,
      setRecognitionListener,
      startListening,
      stopListening
    }));

  SpeechRecognizer.isRecognitionAvailable = isRecognitionAvailable;
  SpeechRecognizer.createSpeechRecognizer = createSpeechRecognizer;
}

  export {
     SpeechRecognizer,
     RecognizerIntent,
     RecognitionListener,
     isRecognitionAvailable,
     createSpeechRecognizer
   }



export default RNAndroidSpeechRecognizer;
