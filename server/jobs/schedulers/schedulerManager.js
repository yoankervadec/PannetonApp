//
// server/jobs/schedulers/schedulerManager.js

import { query } from "../configs/db.config.js";

class SchedulerManager {
  constructor(jobName, executeTask) {
    this.jobName = jobName;
    this.executeTask = executeTask;
    this.schedulerInterval = null;
    this.configRefreshInterval = null;
    this.cachedConfig = null;
  }

  async updateSchedulerStatus(active) {
    await query(
      `
      UPDATE
        schedulers
      SET
        active = ?
      WHERE
        job_name = ?
      `,
      [active ? 1 : 0, this.jobName]
    );
  }

  async refreshSchedulerConfig() {
    const [config] = await query(
      `
      SELECT
        scheduler_id,
        job_name,
        active,
        interval_ms,
        run_times,
        priority
      FROM
        schedulers
      WHERE
        job_name = ?
      `,
      [this.jobName]
    );
    this.cachedConfig = config;
    // console.log(
    //   `Config for ${this.jobName} refreshed: ${JSON.stringify(config)}`
    // );
  }

  async logJobRun(status, message = null, error = null) {
    await query(
      `
      UPDATE
        schedulers
      SET
        last_run = NOW(),
        last_log = ?,
        last_error = ?
      WHERE
        job_name = ?
      `,
      [
        status === "success" ? message : null,
        status === "error" ? error : null,
        this.jobName,
      ]
    );
  }

  start() {
    if (this.schedulerInterval) {
      console.log(`${this.jobName} scheduler already running.`);
      return;
    }

    this.runScheduler();
    this.configRefreshInterval = setInterval(
      () => this.refreshSchedulerConfig(),
      1 * 60 * 1000 // every minute
    );
  }

  async runScheduler() {
    await this.refreshSchedulerConfig();
    if (!this.cachedConfig || !this.cachedConfig.active) {
      console.log(`Scheduler ${this.jobName} is innactive...`);
      return;
    }
    if (this.cachedConfig.run_times) {
      console.log(`Starting fixed-time scheduler for ${this.jobName}...`);
      const runTimes = Array.isArray(this.cachedConfig.run_times)
        ? this.cachedConfig.run_times
        : [];

      this.schedulerInterval = setInterval(async () => {
        const now = new Date();
        const currentTime = `${String(now.getHours()).padStart(
          2,
          "0"
        )}:${String(now.getMinutes()).padStart(2, "0")}`;

        if (!this.cachedConfig.active) {
          console.log(`${this.jobName} scheduler deactivating. Stopping...`);
          this.stop();
          return;
        }

        if (runTimes.includes(currentTime)) {
          console.log(`Running scheduled job: ${this.jobName}...`);
          try {
            await this.executeTask();
            await this.logJobRun(
              "success",
              `${this.jobName} executed successfully at ${currentTime}.`
            );
          } catch (error) {
            await this.logJobRun("error", null, error.message);
            console.error(
              `Failed to execute ${this.jobName}: ${error.message}`
            );
          }
        }
      }, 60 * 1000);
    } else if (this.cachedConfig.interval_ms) {
      const jobOffset = (this.cachedConfig.priority - 1) * 2000; // 2s per priority
      const now = Date.now();

      // Calculate next aligned start time
      const nextExecution =
        Math.ceil(now / this.cachedConfig.interval_ms) *
          this.cachedConfig.interval_ms +
        jobOffset;
      const initialDelay = nextExecution - now;

      console.log(
        `${this.jobName} - Next execution: ${new Date(
          nextExecution
        ).toLocaleString()}, Initial Delay: ${initialDelay}`
      );

      setTimeout(() => {
        this.schedulerInterval = setInterval(async () => {
          if (!this.cachedConfig.active) {
            console.log(`${this.jobName} scheduler deactivated. Stopping...`);
            this.stop();
            return;
          }
          console.log(`Running interval-based job: ${this.jobName}...`);

          try {
            await this.executeTask();
            await this.logJobRun(
              "success",
              `Interval-based job executed successfully at ${new Date()}.`
            );
          } catch (error) {
            await this.logJobRun("error", null, error.message);
            console.error(`Failed to execute ${this.jobName}:`, error.message);
          }
        }, this.cachedConfig.interval_ms);
      }, initialDelay);
    }
  }

  async stop() {
    if (!this.schedulerInterval) {
      console.log(`${this.jobName} scheduler is not running.`);
      return;
    }

    clearInterval(this.schedulerInterval);
    clearInterval(this.configRefreshInterval);
    this.schedulerInterval = null;
    this.configRefreshInterval = null;

    console.log(
      `${this.jobName} scheduler stopped. Deactivating it in the database...`
    );
    await this.updateSchedulerStatus(false);
    this.cachedConfig.active = false;
  }

  async triggerNow() {
    console.log(`Manually triggering job: ${this.jobName} =>`);
    try {
      await this.executeTask();
      await this.logJobRun(
        "success",
        `Job manually triggered and executed successfully at ${new Date()}.`
      );
    } catch (error) {
      await this.logJobRun("error", null, error.message);
      console.error(
        `Failed to manually trigger ${this.jobName}:`,
        error.message
      );
    }
  }
}

export default SchedulerManager;
