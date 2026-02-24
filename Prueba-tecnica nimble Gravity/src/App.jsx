import { useEffect, useState, useCallback } from "react"
import config from "./config.json"
import { JobsList } from "./components/JobsList"

const BASE = config.BASE_URL
const GET_URL = `${BASE}/api/jobs/get-list`
const POST_URL = `${BASE}/api/candidate/apply-to-job`
const CANDIDATE_URL = `${BASE}/api/candidate/get-by-email?email=${encodeURIComponent(config.MAIL)}`

function App() {
  const [jobList, setJobList] = useState([])
  const [jobsLoading, setJobsLoading] = useState(true)
  const [jobsError, setJobsError] = useState("")

  const [loadingId, setLoadingId] = useState(null)

  const [candidateInfo, setCandidateInfo] = useState(null)
  const [candidateLoading, setCandidateLoading] = useState(true)
  const [candidateError, setCandidateError] = useState("")

  const candidateReady =
    !!candidateInfo?.uuid && !!candidateInfo?.candidateId && !!candidateInfo?.applicationId

  const handleApply = useCallback(async (jobId, githubUrl) => {
    const repoUrl = githubUrl.trim()
    if (!repoUrl) return
    if (!candidateReady) {
      alert("Todavía no se cargaron tus datos de candidato")
      return
    }

    setLoadingId(jobId)
    try {
      const res = await fetch(POST_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          uuid: candidateInfo.uuid,
          jobId,
          candidateId: candidateInfo.candidateId,
          applicationId: candidateInfo.applicationId,
          repoUrl,
        }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => null)
        throw new Error(err?.error ?? "Error al enviar la postulación")
      }

      setJobList(prev =>
        prev.map(job => (job.id === jobId ? { ...job, applied: true } : job))
      )
    } catch (e) {
      alert(e.message ?? "Error al enviar la postulación")
    } finally {
      setLoadingId(null)
    }
  }, [candidateInfo, candidateReady])

  useEffect(() => {
    const ctrl = new AbortController()
    setJobsLoading(true)
    setJobsError("")

    fetch(GET_URL, { signal: ctrl.signal })
      .then(res => res.json())
      .then(setJobList)
      .catch(err => {
        if (err.name !== "AbortError") setJobsError("No se pudo cargar la lista de jobs")
      })
      .finally(() => setJobsLoading(false))

    return () => ctrl.abort()
  }, [])

  useEffect(() => {
    const ctrl = new AbortController()
    setCandidateLoading(true)
    setCandidateError("")

    fetch(CANDIDATE_URL, { signal: ctrl.signal })
      .then(res => res.json())
      .then(setCandidateInfo)
      .catch(err => {
        if (err.name !== "AbortError") setCandidateError("No se pudo cargar el candidato")
      })
      .finally(() => setCandidateLoading(false))

    return () => ctrl.abort()
  }, [])

  return (
    <main className="flex flex-col items-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold my-10">Lista de posiciones - Nimble Gravity</h1>

      {(jobsLoading || candidateLoading) && <p>Cargando...</p>}
      {(jobsError || candidateError) && <p className="text-red-600">{jobsError || candidateError}</p>}

      <JobsList
        jobs={jobList}
        apply={handleApply}
        loadingId={loadingId}
        candidateReady={candidateReady}
      />
    </main>
  )
}

export default App