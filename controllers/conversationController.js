const db = require('../db');

const createOrUpdateConversation = async (conversationData) => {
    try {
      const { conversation, totalScore, maxTotalScore, userEmail, patientId } = conversationData;
  
      const result = await db.query(
        `SELECT * FROM "Conversations" WHERE email = $1 AND patient_id = $2`,
        [userEmail, patientId]
      );
  
      let existingConversation = result.rows[0];
      if (existingConversation) {
        const updatedConversationArray = [...existingConversation.conversation, ...conversation];
  
        const updatedConversation = await db.query(
          `UPDATE "Conversations" 
           SET conversation = $1,
               total_score = COALESCE($2, total_score),
               max_total_score = COALESCE($3, max_total_score),
               updated_at = NOW()
           WHERE id = $4
           RETURNING *`,
          [updatedConversationArray, totalScore, maxTotalScore, existingConversation.id]
        );
  
        return { status: 200, data: updatedConversation.rows[0] };
      } else {
        // Create a new conversation
        const newConversation = await db.query(
          `INSERT INTO "Conversations" (conversation, total_score, max_total_score, email, patient_id, created_at, updated_at)
           VALUES ($1, $2, $3, $4, $5, NOW(), NOW()) 
           RETURNING *`,
          [conversation, totalScore, maxTotalScore, userEmail, patientId]
        );
  
        return { status: 201, data: newConversation.rows[0] };
      }
    } catch (error) {
      console.error('Error in createOrUpdateConversation:', error);
      return { status: 500, error: 'Internal server error', message: error.message };
    }
  };

exports.handleCreateOrUpdateConversation = async (req, res) => {
  const result = await createOrUpdateConversation(req.body);

  if (result.error) {
    res.status(result.status).json({ error: result.error, message: result.message });
  } else {
    res.status(result.status).json(result.data);
  }
};

exports.getConversationById = async (req, res) => {
  try {
    const { patientId, userEmail } = req.params;

    const result = await db.query(
      `SELECT * FROM "Conversations" WHERE patient_id = $1 AND email = $2`,
      [patientId, userEmail]
    );

    const conversation = result.rows[0];
    
    if (!conversation) {
      return res.status(404).json({ error: 'Conversation not found' });
    }

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error in getConversationById:', error);
    res.status(500).json({ error: 'Internal server error', message: error.message });
  }
};

module.exports = { createOrUpdateConversation };
