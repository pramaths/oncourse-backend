const db = require('../db');
const OpenAI = require('openai');

const openai = new OpenAI(apiKey = process.env.OPENAI_API_KEY);

exports.getPatientdetailsinfo = async (req, res) => {
  try {
    const { id } = req.params;
    const patientResult = await db.query('SELECT * FROM "Patients" WHERE id = $1', [id]);
    const patient = patientResult.rows[0];
    
    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant tell about yourself." },
        { 
          role: "user", 
          content: `This is a patient with the following details: ${JSON.stringify(patient)}, provide this info to the doctor like how the patient is feeling, what are the symptoms, what is the history, what is the additional info. Assume you are a patient, based on data you need to tell about yourself. This is my details. Your response should purely be in string format, not in JSON format, just give a string, don't mention other things like how it looks, something like that.` 
        }
      ],
      model: "gpt-4o-mini",
    });

    console.log(JSON.stringify(completion));
    res.status(200).json(completion.choices[0].message.content);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching patient details info.' });
  }
};

exports.getAllPatients = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM "Patients"');
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching patients.' });
  }
};

exports.createPatient = async (req, res) => {
  try {
    const { name, age, gender, history, symptoms, additionalInfo } = req.body;
    const result = await db.query(
      `INSERT INTO "Patients" (name, age, gender, history, symptoms, additional_info, created_at, updated_at)
       VALUES ($1, $2, $3, $4, $5, $6, NOW(), NOW()) RETURNING *`,
      [name, age, gender, history, symptoms, additionalInfo]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while creating the patient.' });
  }
};

exports.updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, age, gender, history, symptoms, additionalInfo } = req.body;
    
    const patientResult = await db.query('SELECT * FROM "Patients" WHERE id = $1', [id]);
    const patient = patientResult.rows[0];

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    const result = await db.query(
      `UPDATE "Patients" 
       SET name = $1, age = $2, gender = $3, history = $4, symptoms = $5, additional_info = $6, updated_at = NOW() 
       WHERE id = $7 RETURNING *`,
      [name, age, gender, history, symptoms, additionalInfo, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while updating the patient.' });
  }
};

exports.getPatient = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query('SELECT * FROM "Patients" WHERE id = $1', [id]);
    const patient = result.rows[0];

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found.' });
    }

    res.status(200).json(patient);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred while fetching the patient.' });
  }
};
