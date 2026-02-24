import { useEffect, useState } from "react"
import config from "./config.json"
import { JobsList } from "./components/JobsList"

function App() {
  const [jobList, setJobList] = useState([])
  const [loadingId, setLoadingId] = useState(null)
  const [candidateInfo, setCandidateInfo] = useState({
    uuid: "",
    candidateId: "",
    applicationId: "",
    firstName: "",
    lastName: "",
    email: ""
  })
  
  const GET_URL = config.BASE_URL + "/api/jobs/get-list"
  const POST_URL = config.BASE_URL + "/api/candidate/apply-to-job"
  const CANDIDATE_URL = config.BASE_URL + "/api/candidate/get-by-email?email=" + config.MAIL
  
  const handleApply = async (jobId, githubUrl) => {
    setLoadingId(jobId)
    try{
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: candidateInfo.uuid,
          jobId: jobId,
          candidateId: candidateInfo.candidateId,
          repoUrl: githubUrl,
          applicationId: candidateInfo.applicationId,
        })
      })
      if (res.ok) {
        setJobList(prev => prev.map(job => job.id === jobId ? {...job, applied: true} : job))
      } else {
        alert("Error al enviar la postulación")
      }
    } catch (error) {
      alert("Error al enviar la postulación")
    }
    finally {
      setLoadingId(null)
    }
  }

  useEffect(() => {
    fetch(GET_URL)
      .then((res) => res.json())
      .then((data) => setJobList(data))
  }, [])

  useEffect(() => {
    fetch(CANDIDATE_URL)
      .then((res) => res.json())
      .then((data) => setCandidateInfo(data))
  }, [])

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold my-10">
        Lista de posiciones - Nimble Gravity
      </h1>
      <JobsList jobs={jobList} apply={handleApply} loadingId={loadingId}/>
    </main>
  )
}

export default App
