const asyncHandler = require('express-async-handler');
const { getCropRecommendations } = require('../utils/chatbotLogic');

// @desc    Process chatbot message
// @route   POST /api/chatbot
// @access  Public
const chat = asyncHandler(async (req, res) => {
  const { message } = req.body;

  if (!message || !message.trim()) {
    res.status(400);
    throw new Error('Please provide a message');
  }

  const response = getCropRecommendations(message);

  res.json({
    userMessage: message,
    botResponse: response.message,
    type: response.type,
    data: {
      crop: response.crop || null,
      seeds: response.seeds || null,
      fertilizers: response.fertilizers || null,
      tips: response.tips || null,
    },
  });
});

module.exports = { chat };
