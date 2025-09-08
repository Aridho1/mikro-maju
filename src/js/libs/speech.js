export const speech = new SpeechSynthesisUtterance();
speech.lang = "id-ID";
speech.volume = 1;
speech.rate = 1;
speech.pitch = 1;
speech.text = "";

export const readText = (text) => ((speech.text = text), window.speechSynthesis.speak(speech));
