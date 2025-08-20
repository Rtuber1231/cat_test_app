const Result = require('../models/Result');

exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId).populate('testId');

    if (!result) return res.status(404).json({ message: 'Result not found' });
    
    // Rename 'testId' to 'test' for consistency with the frontend prototype
    const response = {
      ...result.toObject(),
      test: result.testId
    };
    delete response.testId;

    res.status(200).json(response);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};
