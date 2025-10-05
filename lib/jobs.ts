
interface Job {
  id: string;
  status: 'pending' | 'completed' | 'failed';
  data?: any;
  error?: string;
}

const jobStore = new Map<string, Job>();

export const createJob = (id: string): void => {
  jobStore.set(id, { id, status: 'pending' });
};

export const getJob = (id: string): Job | undefined => {
  return jobStore.get(id);
};

export const updateJobStatus = (id: string, status: Job['status'], data?: any, error?: string): void => {
  const job = getJob(id);
  if (job) {
    job.status = status;
    if (data) job.data = data;
    if (error) job.error = error;
  }
};
