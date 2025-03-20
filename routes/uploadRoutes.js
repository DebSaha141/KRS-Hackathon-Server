require("dotenv").config();
const express = require("express");
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const fs = require("fs");

const router = express.Router();
const papersData = JSON.parse(fs.readFileSync("./data/papers.json"));

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({});
const upload = multer({ storage });

router.post("/", upload.array("files", 5), async (req, res) => {
  const { branch, school, semester, subject, year, examType } = req.body;
  if (!branch || !school || !semester || !subject || !year || !examType || !req.files) {
    return res.status(400).json({ error: "All fields are required" });
  }

  try {
    const uploadedUrls = [];

    for (const file of req.files) {
      const result = await cloudinary.uploader.upload(file.path, { resource_type: "raw" });
      uploadedUrls.push(result.secure_url);
    }

    if (!papersData[branch]) papersData[branch] = {};
    if (!papersData[branch][school]) papersData[branch][school] = {};
    if (!papersData[branch][school][semester]) papersData[branch][school][semester] = {};
    if (!papersData[branch][school][semester].subjects) papersData[branch][school][semester].subjects = {};
    if (!papersData[branch][school][semester].subjects[subject]) papersData[branch][school][semester].subjects[subject] = { years: {} };
    if (!papersData[branch][school][semester].subjects[subject].years[year]) papersData[branch][school][semester].subjects[subject].years[year] = {};
    if (!papersData[branch][school][semester].subjects[subject].years[year][examType]) papersData[branch][school][semester].subjects[subject].years[year][examType] = [];

    papersData[branch][school][semester].subjects[subject].years[year][examType].push(...uploadedUrls);

    fs.writeFileSync("./data/papers.json", JSON.stringify(papersData, null, 2));

    res.json({ message: "Files uploaded", urls: uploadedUrls });
  } catch (error) {
    res.status(500).json({ error: "Upload failed" });
  }
});

module.exports = router;
