const Alexa = require('ask-sdk-core');
const axios = require('axios');


const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speakOutput = 'Esta es la IA de programacion creada por CD (CENTRO DE DESARROLLO)';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};


//Function called by Handler, custom function
const PokemonInfoIntentHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
      && Alexa.getIntentName(handlerInput.requestEnvelope) === 'SearchPokemonIntent';
  },
  async handle(handlerInput) {

    //Access to Alexa console slots to a variable called 'pokemon'
    const pokemon = Alexa.getSlotValue(handlerInput.requestEnvelope, 'pokemon') ;
    //API url
    const url = `https://pokeapi.co/api/v2/pokemon/${pokemon}`;
    //Function used to take data 
    const data = await getPokemon(url);  
    //Response from alexa with data and accessing name and height from data.
    const speakOutput = `El pokemon que buscas es: ${data.name}, con un tamaño de: ${data.height}`
    //const speakOutput = 'Hola si entro a PokemonInfoIntentHandler'
      
    //const { pokemon } = handlerInput.requestEnvelope.intent.slots;
    
    
    return handlerInput.responseBuilder
        .speak(speakOutput)
        .reprompt(speakOutput)
        .getResponse();
  }
};


const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'You can say hello to me! How can I help?';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};



const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        const speakOutput = 'Sorry, I don\'t know about that. Please try again.';

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};


const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.error(`Error: ${error.message}`);

    const speakOutput = 'Lo siento, ha ocurrido un error. Por favor, intenta nuevamente.';

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .getResponse();
  },
};

//Custom function to get pokemons o anything from any API url
async function getPokemon(url){
    
    try{
        //Call with functon get to take data
        const response = await axios.get(url)
        //Desestructuring data
        let data = response.data
        //get data clean to take info
        return data
    }catch(error){
        
    }
}

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PokemonInfoIntentHandler,
    FallbackIntentHandler, 
    HelpIntentHandler,
    getPokemon
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
