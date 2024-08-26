class Conversations {
    constructor() {
        this.conversationHistory = [];
    }

    addMessage(role, content) {
        const message = { role: role, content: content };
        this.conversationHistory.push(message);
    }

    getConversation() {
        return this.conversationHistory;
    }

    clearConversation() {
        this.conversationHistory = [];
    }
}


module.exports = {Conversations};