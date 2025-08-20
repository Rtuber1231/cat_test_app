import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

// NOTE: These are placeholder components. You would create these in a /components folder.
const Timer = ({ timeLeft }) => <div className="font-bold text-xl">{new Date(timeLeft * 1000).toISOString().substr(14, 5)}</div>;
const QuestionPalette = ({ questions, current, navigateTo }) => (
  <div className="grid grid-cols-5 gap-2">
    {questions.map((_, index) => (
      <button key={index} onClick={() => navigateTo(index)} className={`h-10 w-10 rounded ${index === current ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>{index + 1}</button>
    ))}
  </div>
);


const TestPage = () => {
  const { testId } = useParams();
  const navigate = useNavigate();
  const [test, setTest] = useState(null);
  const [currentQues, setCurrentQues] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(null);

  useEffect(() => {
    const fetchTest = async () => {
      // IMPORTANT: Replace with your backend URL
      const response = await axios.get(`YOUR_BACKEND_URL/api/test/${testId}`);
      setTest(response.data);
      setTimeLeft(response.data.duration * 60); // Convert minutes to seconds
    };
    fetchTest();
  }, [testId]);

  useEffect(() => {
    if (timeLeft === 0) handleSubmit();
    if (!timeLeft) return;
    const intervalId = setInterval(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [timeLeft]);

  const handleAnswer = (questionIndex, answer) => {
    setAnswers({ ...answers, [questionIndex]: answer });
  };
  
  const handleSaveAndNext = () => {
      if (currentQues < test.questions.length - 1) {
          setCurrentQues(currentQues + 1);
      }
  };

  const handleSubmit = async () => {
    // IMPORTANT: Replace with your backend URL
    const response = await axios.post(`YOUR_BACKEND_URL/api/test/submit`, { testId, answers });
    const { resultId } = response.data;
    navigate(`/results/${resultId}`);
  };

  if (!test) return <div>Loading Test...</div>;

  const question = test.questions[currentQues];

  return (
    <div className="flex h-screen p-4 space-x-4">
      {/* Main Question Panel */}
      <div className="w-3/4 p-6 bg-white rounded-lg shadow">
        <div className="flex justify-between mb-4">
            <h3 className="font-semibold">Question {currentQues + 1}</h3>
        </div>
        <p className="mb-6">{question.questionText}</p>
        
        {question.questionType === 'MCQ' ? (
          <div className="space-y-3">
            {question.options.map((opt, index) => (
              <label key={index} className="flex items-center p-3 border rounded-lg">
                <input type="radio" name={`q_${currentQues}`} value={opt} onChange={(e) => handleAnswer(currentQues, e.target.value)} className="mr-3"/>
                {opt}
              </label>
            ))}
          </div>
        ) : (
          <textarea 
            className="w-full p-2 border rounded" 
            placeholder="Type your answer here..."
            onChange={(e) => handleAnswer(currentQues, e.target.value)}
          />
        )}
      </div>

      {/* Right Sidebar */}
      <div className="w-1/4 p-6 bg-white rounded-lg shadow flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6">
              <span className="font-semibold">Time Left:</span>
              <Timer timeLeft={timeLeft} />
          </div>
          <QuestionPalette questions={test.questions} current={currentQues} navigateTo={setCurrentQues} />
        </div>
        <div className="space-y-3">
            <button onClick={handleSaveAndNext} className="w-full py-2 text-white bg-blue-600 rounded">Save & Next</button>
            <button onClick={handleSubmit} className="w-full py-2 text-white bg-green-600 rounded">Finish Test</button>
        </div>
      </div>
    </div>
  );
};

export default TestPage;
