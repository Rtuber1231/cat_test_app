import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const ResultsPage = () => {
  const { resultId } = useParams();
  const [results, setResults] = useState(null);
  
  useEffect(() => {
    const fetchResults = async () => {
      // IMPORTANT: Replace with your backend URL
      const response = await axios.get(`YOUR_BACKEND_URL/api/results/${resultId}`);
      setResults(response.data);
    };
    fetchResults();
  }, [resultId]);

  if (!results) return <div>Loading Results...</div>;

  // Simple score calculation logic (this could also be done on the backend)
  const score = results.test.questions.reduce((acc, question, index) => {
      return results.userAnswers[index] === question.correctAnswer ? acc + 1 : acc;
  }, 0);

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="p-6 mb-8 bg-white rounded-lg shadow">
        <h1 className="text-3xl font-bold text-center mb-2">Test Results</h1>
        <p className="text-xl text-center text-gray-700">
          Your Score: <span className="font-bold text-blue-600">{score} / {results.test.questions.length}</span>
        </p>
      </div>
      
      <div className="space-y-4">
        {results.test.questions.map((question, index) => (
          <div key={index} className="p-4 bg-white rounded-lg shadow">
            <p className="font-semibold mb-2">Q{index + 1}: {question.questionText}</p>
            <p className="text-sm"><strong>Correct Answer:</strong> {question.correctAnswer}</p>
            <p className={`text-sm font-medium ${results.userAnswers[index] === question.correctAnswer ? 'text-green-600' : 'text-red-600'}`}>
              <strong>Your Answer:</strong> {results.userAnswers[index] || 'Not Answered'}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ResultsPage;
