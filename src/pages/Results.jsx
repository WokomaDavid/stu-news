import { useState } from 'react';
import { getStudentByReg } from '../services/studentService';
import { getResultsForStudent } from '../services/resultService';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';

const Results = () => {
  const [reg, setReg] = useState('');
  const [student, setStudent] = useState(null);
  const [results, setResults] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { data: studentData } = await getStudentByReg(reg);
    if (studentData) {
      setStudent(studentData);
      const { data: resultData } = await getResultsForStudent(studentData.id);
      setResults(resultData);
    } else {
      alert('Student not found');
    }
  };

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit} className="space-y-2">
        <FormInput value={reg} onChange={(e) => setReg(e.target.value)} placeholder="Enter Reg Number" required />
        <FormButton type="submit">Check Results</FormButton>
      </form>

      {student && (
        <div className="mt-4">
          <h2 className="font-bold text-lg">Results for {student.name}</h2>
          <ul className="list-disc ml-4">
            {results.map((r) => (
              <li key={r.id}>{r.subject}: {r.score}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Results;
