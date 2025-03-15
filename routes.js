const express = require("express");
const pool = require("./db");

const router = express.Router();

// Create a new poll
router.post("/polls", async (req, res) => {
  try {
    const { question, options } = req.body;
    const poll = await pool.query(
      "INSERT INTO polls (question) VALUES ($1) RETURNING *",
      [question]
    );

    for (let option of options) {
      await pool.query(
        "INSERT INTO options (poll_id, option_text) VALUES ($1, $2)",
        [poll.rows[0].id, option]
      );
    }

    res.json({ message: "Poll created successfully!" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all polls
router.get("/polls", async (req, res) => {
  try {
    const polls = await pool.query("SELECT * FROM polls");
    res.json(polls.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Vote for an option
router.post("/vote", async (req, res) => {
  try {
      const { optionId } = req.body;
      await pool.query("UPDATE options SET votes = votes + 1 WHERE id = $1", [optionId]);
      res.json({ message: "Vote submitted successfully!" });
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});


// Get poll options
router.get("/polls/:id", async (req, res) => {
  try {
      const pollId = req.params.id;
      const options = await pool.query("SELECT * FROM options WHERE poll_id = $1", [pollId]);
      res.json(options.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});

// Get poll results
router.get("/results/:id", async (req, res) => {
  try {
      const pollId = req.params.id;
      const results = await pool.query("SELECT option_text, votes FROM options WHERE poll_id = $1", [pollId]);
      res.json(results.rows);
  } catch (err) {
      res.status(500).json({ error: err.message });
  }
});




module.exports = router;
