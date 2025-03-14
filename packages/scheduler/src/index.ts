/** @notice Library imports */
import scheduler, { type Job } from "node-schedule";

/// Types
type TerminationPayload = {
  terminateOn: Date;
  sphereId: string;
  handler: (sphereId: string) => Promise<void>;
};

export class TerminationScheduler {
  /// Holds all the jobs based on instance id
  private jobRecords: Map<string, Job>;

  constructor() {
    this.jobRecords = new Map<string, Job>();
  }

  public async schedule(payload: TerminationPayload) {
    /// Creating the Jon
    const job = scheduler.scheduleJob(
      payload.terminateOn,
      payload.handler.bind(null, payload.sphereId)
    );
    /// Adding into records
    this.jobRecords.set(payload.sphereId, job);

    console.log(this.jobRecords);
  }

  public async cancel(sphereId: string) {
    /// Checking if job available
    if (this.jobRecords.has(sphereId)) {
      const job = this.jobRecords.get(sphereId)!;
      /// Cancels the job and delete from records
      scheduler.cancelJob(job);
      this.jobRecords.delete(sphereId);
    }
  }

  public async reschedule(payload: TerminationPayload) {
    /// Checking if job available
    if (this.jobRecords.has(payload.sphereId)) {
      let job = this.jobRecords.get(payload.sphereId)!;
      /// Reschedule the job
      job = scheduler.rescheduleJob(job, payload.terminateOn);
      /// If job could not be rescheduled
      if (!job) {
        /// Then cancel the job and recreate.
        scheduler.cancelJob(job);
        job = scheduler.scheduleJob(
          payload.terminateOn,
          payload.handler.bind(null, payload.sphereId)
        );
      }

      /// override into records
      this.jobRecords.set(payload.sphereId, job);
    }
  }
}
