import React, { useState, useRef, useEffect } from "react";
function QuestionForm() {
  const [prompt, setPrompt] = useState("");
  const [answers, setAnswers] = useState(["", "", "", ""]);
  const [correctIndex, setCorrectIndex] = useState(0);
  const isMounted = useRef(true);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
    };
  }, []);

  function handleSubmit(e) {
    e.preventDefault();
    fetch("http://localhost:4000/questions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt,
        answers,
        correctIndex: parseInt(correctIndex, 10),
      }),
    }).then(() => {
      if (isMounted.current) {
        setPrompt("");
        setAnswers(["", "", "", ""]);
        setCorrectIndex(0);
      }
    });
  }

  function handleAnswerChange(index, value) {
    const newAnswers = [...answers];
    newAnswers[index] = value;
    setAnswers(newAnswers);
  }

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Prompt:
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          aria-label="Prompt"
        />
      </label>
      {answers.map((answer, idx) => (
        <label key={idx}>
          Answer {idx + 1}:
          <input
            type="text"
            value={answer}
            onChange={(e) => handleAnswerChange(idx, e.target.value)}
            aria-label={`Answer ${idx + 1}`}
          />
        </label>
      ))}
      <label>
        Correct Answer:
        <select
          value={correctIndex}
          onChange={(e) => setCorrectIndex(e.target.value)}
          aria-label="Correct Answer"
        >
          {answers.map((_, idx) => (
            <option key={idx} value={idx}>
              Answer {idx + 1}
            </option>
          ))}
        </select>
      </label>
      <button type="submit">Add Question</button>
    </form>
  );
}

export default QuestionForm;