const express = require("express");
const fs = require("fs");

const router = express.Router();
const papersData = JSON.parse(fs.readFileSync("./data/papers.json"));
const topicsData = JSON.parse(fs.readFileSync("./data/topics.json"));

router.get("/pdf", (req, res) => {
  const { branch, school, semester, subject } = req.query;
  if (!branch || !school || !semester || !subject) {
    return res.status(400).json({ error: "All parameters are required" });
  }

  const subjectData = papersData[branch]?.[school]?.[semester]?.subjects?.[subject];
  if (!subjectData) {
    return res.status(404).json({ error: "No data found for the given parameters" });
  }

    res.json({response:"ok", subjectData });
});

router.get("/topic", (req, res) => {
  const { branch, school, semester, subject, topic } = req.query;
  if (!branch || !school || !semester || !subject || !topic) {
    return res.status(400).json({ error: "All parameters are required" });
  }

  const topicData = topicsData[branch]?.[school]?.[semester]?.subjects?.[subject]?.topics?.[topic];
  if (!topicData) {
    return res.status(404).json({ error: "Topic data not found" });
  }

  res.json({response:"ok", topicData });
});

module.exports = router;
