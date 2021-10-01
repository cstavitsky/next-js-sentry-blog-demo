import { withSentry } from '@sentry/nextjs';
import * as Sentry from '@sentry/nextjs';
import type { NextApiRequest, NextApiResponse } from 'next';

const handler = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    console.log('try api');
    console.log('*** Headers ***');
    console.log(req.headers);
    throw new Error('API throw error test');
  } catch (ex) {
    console.log('caught exception');
    Sentry.captureException(ex);
    res.json({});
    res.status(500);
    res.end();
  }
};

export default withSentry(handler);
