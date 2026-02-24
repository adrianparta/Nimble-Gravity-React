import { Job } from "./Job";

export function JobsList({ jobs, apply: onApply, loadingId }) {
  return (
    <ul>
      {jobs.map((job) => (
        <Job job={job} key={job.id} apply={onApply} loading={loadingId === job.id} />
      ))}
    </ul>
  )
}
