import { useEffect } from 'react'
import './App.css'
import { Route, Routes } from 'react-router'
import InterviewerApi from './services/InterviewerApi'

const TestOne = () => <div>One</div>
const TestTwo = () => {
  useEffect(() => {
    InterviewerApi.post('/vacancy-session', {
      "operation": "get_vacancies",
      "payload": {}
    }).then(console.log)
  }, []);
  return <div>Two</div>
}

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<TestOne />} />
        <Route path="/about" element={<TestTwo />} />
      </Routes>
    </>
  )
}

export default App
