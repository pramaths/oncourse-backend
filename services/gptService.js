const OpenAI = require("openai");
const { seniorAiTestEvaluator, seniorAiDiagnosisEvaluator, queryContextAnalyzer, generalUserAssistant } = require("../config/tools");
require("dotenv").config();


class OpenAIService {
  constructor({
    apiKey = process.env.OPENAI_API_KEY,
    model = process.env.DEFAULT_MODEL,
  }) {
    this.client = new OpenAI({
      apiKey: apiKey,
    });

    this.conversationId;
    this.model = model;
    this.startTimestamp = Date.now();
  }

  async sendMessage({ system, messages = [], functions =  [seniorAiDiagnosisEvaluator, seniorAiTestEvaluator, queryContextAnalyzer, generalUserAssistant]}) {
    console.log(messages);

    if (messages.length < 1) {
      throw new Error("No messages provided");
    }
    
    const apiMessages = [
      { role: 'system', content: system },
      ...messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }))
    ];

    const clientParams = {
      model: this.model,
      messages: apiMessages,
      functions:functions,
    };
    
  
    try {
      const response = await this.client.chat.completions.create(clientParams );
      console.log("Response from OpenAI:", response)
      return response;
    } catch (error) {
      console.log("Error in OpenAIService.sendMessage", error);
      if (error.name === "AbortError") {
        console.log("Request aborted");
        throw new DOMException("Aborted", "AbortError");
      } else {
        throw error;
      }
    }
  }
}

module.exports = { OpenAIService };
