const { OpenAIService } = require("../services/gptService");
const { Conversations } = require("../services/converstaion");
const { createOrUpdateConversation } = require("../controllers/conversationController");

const chatHandler = (io, socket, patientId, userEmail, initialMessage) => {
  const conversationHistory = new Conversations();
  const gptService = new OpenAIService({
    apiKey: process.env.OPENAI_API_KEY,
    model: process.env.DEFAULT_MODEL || 'gpt-4', 
  });

  const storeOrUpdateConversation = async (messages, userEmail, patientId) => {
    try {
      await createOrUpdateConversation({
        conversation: messages,
        totalScore: 0, 
        maxTotalScore: 10,
        userEmail,
        patientId,
      });
    } catch (error) {
      console.error("Error storing or updating conversation:", error);
      socket.emit("error", { message: "Error saving conversation" });
    }
  };
  

  const handleGPTResponse = async (response, conversation) => {
    console.log("Response from OpenAI:", JSON.stringify(response));
    console.log("essages:", JSON.stringify(response.choices[0]))
    if (response.function_call) {
      const functionCall = response.message.function_call;
      const functionName = functionCall.name;
      const functionArgs = JSON.parse(functionCall.arguments);

      const secondResponse = await gptService.sendMessage({
        system: "",
        messages: [
          ...conversation,
          {
            role: "function",
            name: functionName,
            content: JSON.stringify(functionArgs)
            }
        ],
      });
      return secondResponse.choices[0].message.content;
    } else {
      return response.choices[0].message.content;
    }
  };

  socket.on("start_conversation", async ({patientNaturalLanguageDetails,userEmail, patientId}) => {
    try {
      const initialMessage = `Patient Details: ${patientNaturalLanguageDetails}`;
      conversationHistory.addMessage("system", initialMessage);
      const response = await gptService.sendMessage({
        system: `You are an AI senior doctor mentoring NEET PG students. You have been given patient details. Your task is to ask one question at a time to the student regarding either a test or diagnosis for that particular patient.
      
      Your response should always be a plain string containing only a single question. Do not include any JSON formatting, markdown, or additional explanations.
      You can ask only questions at a time and never answer about the diagnosis or tests before the student answers your question. and for alwasy ensure you allocate marks for only test and diagnosis based question and 
      you can ask only two questions for a particular patient ensure return score for that questioin out 5.
      
      Example outputs:
      "What specific blood test would you recommend for this patient given their symptoms?"
      or
      "Based on the patient's medical history and current symptoms, what is your preliminary diagnosis?"
      
      IMPORTANT: Your response must be a simple string containing only one question. Do not include any other text, formatting, or structures.`,
        messages: conversationHistory.getConversation(),
      });
      
      const assistantResponse = await handleGPTResponse(response, conversationHistory.getConversation());
      console.log("Assistant response:", assistantResponse);
      socket.emit("assistant_response", assistantResponse);
      conversationHistory.addMessage("assistant", assistantResponse);
      await storeOrUpdateConversation(conversationHistory.getConversation(), userEmail, patientId);
    } catch (error) {
      console.error("Error in start_conversation:", error);
      socket.emit("error", { message: "Error processing your request" });
    }
  });

  socket.on("chat_message", async (userMessage) => {
    try {
      const { message, userEmail, patientId } = userMessage;
      conversationHistory.addMessage("user", message);
      const conversation = conversationHistory.getConversation();
      if (!conversation || conversation.length === 0) {
        throw new Error("No messages to send");
      }

      const response = await gptService.sendMessage({
        system: "",
        messages: conversation,
      });
      
      const assistantResponse = await handleGPTResponse(response, conversation);
      socket.emit("assistant_response", assistantResponse);
      conversationHistory.addMessage("assistant", assistantResponse);
      
      await storeOrUpdateConversation(conversationHistory.getConversation(), userEmail, patientId);
    } catch (error) {
      console.error("Error in chat_message:", error);
      socket.emit("error", { message: "Error processing your message" });
    }
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
};

module.exports = chatHandler;