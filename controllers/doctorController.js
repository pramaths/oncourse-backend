const db = require('../db');

exports.createUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Insert the new user into the Users table
    const result = await db.query(
      `INSERT INTO "Users" (email, password, created_at, updated_at) 
       VALUES ($1, $2, NOW(), NOW()) 
       RETURNING *`,
      [email, password]
    );

    const user = result.rows[0];

    res.status(201).json({
      message: 'User created successfully',
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      message: 'Error creating user',
      error: error.message,
    });
  }
};

exports.getUser = async (req, res) => {
  try {
    const { email } = req.params;

    // Fetch the user by email
    const result = await db.query(
      `SELECT * FROM "Users" WHERE email = $1`,
      [email]
    );

    const user = result.rows[0];

    if (user) {
      res.status(200).json({
        message: 'User fetched',
        data: user,
      });
    } else {
      res.status(404).json({
        message: 'User not found',
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'Error fetching user',
      error: error.message,
    });
  }
};
