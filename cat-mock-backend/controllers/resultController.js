const Result = require('../models/Result');

exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findById(req.params.resultId)
      .populate({
        path: 'testId',
        model: 'Test'
      }); // This is key: it fetches the original test data too!

    if (!result) {
      return res.status(404).json({ message: 'Result not found' });
    }
    
    // Rename 'testId' to 'test' for clarity on the frontend
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
