import { createQueue } from 'kue';
import createPushNotificationsJobs from './8-job';
import { expect } from 'chai';

describe('createPushNotificationsJobs', () => {
  let queue;

  before(() => {
    // Create a Kue queue with test mode enabled
    queue = createQueue({ name: 'push_notification_code_test' });
    queue.testMode.enter();
  });

  after(() => {
    // Clear the queue and exit test mode
    queue.testMode.exit();
    queue.shutdown(1000, err => {
      if (err) {
        console.error('Error shutting down Kue queue:', err);
      } else {
        console.log('Kue queue shut down successfully');
      }
    });
  });

  afterEach(() => {
    // Remove all jobs from the queue after each test
    queue.testMode.clear();
  });

  it('creates a job for each input object', () => {
    const jobs = [
      {
        phoneNumber: '2348094560',
        message: 'This is the code 1234 to verify your account',
      },
      {
        phoneNumber: '2348095641',
        message: 'This is the code 9845 to verify your account',
      },
      {
        phoneNumber: '2348098021',
        message: 'This is the code 6904 to verify your account',
      },
      {
        phoneNumber: '2348078943',
        message: 'This is the code 0094 to verify your account',
      },
    ];

    createPushNotificationsJobs(jobs, queue);

    // Get all jobs from the queue
    queue.on('job complete', (id, result) => {
      queue.testMode.jobs((err, jobs) => {
        if (err) throw err;

        expect(jobs.length).to.be.equal(4);

        // Check that each job has the expected data
        jobs.forEach(job => {
          expect(job.type).to.be.equal('push_notification_code_3');
          expect(job.data.phoneNumber).to.be.defined;
          expect(job.data.message).to.be.defined;
        });
      });
    });
  });

  it('throws an error if jobs is not an array', () => {
    expect(() => {
      createPushNotificationsJobs({}, queue);
    }).to.throw('Jobs is not an array');
  });
});
