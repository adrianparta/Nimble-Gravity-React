import { useState } from "react"

export function Job({ job, apply, loading }) {
  const { id, title, applied } = job
  const [githubUrl, setGithubUrl] = useState("")
  const handleSubmit = (e) => {
    e.preventDefault()
    apply(id, githubUrl)
  }
  return (
    <li key={id} className="bg-white rounded-lg shadow-md p-6 mb-4 w-3xl">
      <form onSubmit={handleSubmit}>
        <h2 className="text-2xl font-semibold mb-4">{title}</h2>
        <input
          type="text"
          placeholder="Ingrese la URL del repositorio de Github..."
          className="w-full p-2 border border-gray-300 rounded mb-4"
          value={githubUrl}
          onChange={(e) => setGithubUrl(e.target.value)}
        />
        <button
          type="submit"
          className="text-blue-400 hover:text-blue-700 font-semibold py-2 px-4 border border-blue-400 hover:border-blue-700 rounded
          disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:text-blue-400 disabled:hover:border-blue-400"
          disabled={applied || loading || githubUrl.trim() === ""}
        >
          {applied ? "Aplicado" : loading ? "Aplicando..." : "Aplicar"}
        </button>
      </form>
    </li>
  )
}
