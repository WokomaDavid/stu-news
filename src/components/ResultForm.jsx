import { useState } from 'react';
import { getStudentByReg } from '../services/studentService';
import { getResultsForStudent } from '../services/resultService';
import FormInput from './FormInput';
import FormButton from './FormButton';

const ResultForm = () => {
  const [reg, setReg] = useState('');
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: student } = await getStudentByReg(reg);
    if (student) {
      const { data: res } = await getResultsForStudent(student.id);
      setResults(res);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput label="Registration Number" value={reg} onChange={(e) => setReg(e.target.value)} placeholder="Enter Reg Number" required />
        <FormButton type="submit">Check Results</FormButton>
      </form>
      <ul className="mt-4 space-y-2">
        {results.map((r) => (
          <li key={r.id} className="border p-2 rounded-md">{r.subject}: {r.score}</li>
        ))}
      </ul>
    </div>
  );
};

export default ResultForm;
