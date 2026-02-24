import { Job } from "./Job";

export function JobsList({ jobs, apply, loadingId }) {
  return (
    <ul>
      {jobs.map((job) => (
        <Job job={job} key={job.id} apply={apply} loading={loadingId === job.id} />
      ))}
    </ul>
  )
}
