const Test = require('../models/Test');
const Result = require('../models/Result');
const pdf = require('pdf-parse');
const { GoogleGenerativeAI } = require('@google/generative-ai');

// Initialize Google Gemini AI
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// The core function to create a test from a PDF
exports.createTestFromPdf = async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No PDF file uploaded.' });
  }

  try {
    // 1. Extract text from the PDF buffer
    const data = await pdf(req.file.buffer);
    const pdfText = data.text;

    // 2. Call Gemini AI to parse the text
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    const prompt = `
      You are an expert exam question parser. Analyze the following text extracted from a PDF. 
      Convert all questions into a structured JSON array. Each object in the array must have four fields: 
      "questionText" (string), "questionType" ('MCQ' or 'TITA'), "options" (an array of strings, empty for TITA), 
      and "correctAnswer" (string). Ensure the JSON is valid.
      
      Here is the text:
      ---
      ${pdfText}
      ---
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let jsonText = response.text();
    
    // Clean up the response from AI
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    const questions = JSON.parse(jsonText);

    // 3. Create and save the new test in the database
    const newTest = new Test({
      title: req.file.originalname,
      duration: parseInt(req.body.duration, 10),
      questions: questions,
    });
    
    await newTest.save();
    
    res.status(201).json({ testId: newTest._id });

  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ message: 'Failed to process PDF file.' });
  }
};

// Function to get a specific test by its ID
exports.getTestById = async (req, res) => {
  try {
    const test = await Test.findById(req.params.testId);
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.status(200).json(test);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to handle test submission
exports.submitTest = async (req, res) => {
    try {
        const { testId, answers } = req.body;
        const newResult = new Result({
            testId: testId,
            userAnswers: answers
        });
        await newResult.save();
        res.status(201).json({ resultId: newResult._id });
    } catch (error) {
        console.error('Error submitting test:', error);
        res.status(500).json({ message: 'Failed to submit test.' });
    }
};
