import sendMail from './email';
import { Log } from './envSetup';
import { fetchThomanData } from './process';
import { transformToHTML } from './toHTML';

Log.info(`NODE version: ${process.version}`);

const thomanProducts = await fetchThomanData();

console.log(thomanProducts);

const html = transformToHTML(thomanProducts);

await sendMail(html);
