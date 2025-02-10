// src/services/scheduler.js
import cron from 'node-cron';
import { resetAllNomorAntrean } from './antreanService';

let cronJobStarted = false;

const scheduleResetAntrean = () => {
    if (!cronJobStarted) {
        // Atur cron job untuk mereset antrean pada pukul 09:00
        cron.schedule('0 9 * * *', async () => {  // Jam 09:00
            try {
                const result = await resetAllNomorAntrean();
                console.log("Scheduled reset executed at 09:00:", result.message);
            } catch (error) {
                console.error('Error in scheduled reset at 09:00:', error.message);
            }
        });

        // Atur cron job untuk mereset antrean pada pukul 09:53
        cron.schedule('53 9 * * *', async () => {  // Jam 09:53
            try {
                const result = await resetAllNomorAntrean();
                console.log("Scheduled reset executed at 09:53:", result.message);
            } catch (error) {
                console.error('Error in scheduled reset at 09:53:', error.message);
            }
        });

        cronJobStarted = true;
        console.log("Scheduled antrean reset at 09:00 and 09:53.");
    } else {
        console.log("Cron job already started, skipping initialization.");
    }
};

export default scheduleResetAntrean;