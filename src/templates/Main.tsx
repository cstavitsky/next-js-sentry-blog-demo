import React, { ReactNode } from 'react';

import * as Sentry from '@sentry/nextjs';
import Link from 'next/link';

import { Navbar } from '../navigation/Navbar';
import { Config } from '../utils/Config';

type IMainProps = {
  meta: ReactNode;
  children: ReactNode;
};

const Main = (props: IMainProps) => (
  <div className="antialiased w-full text-gray-700 px-3 md:px-0">
    {props.meta}

    <div className="max-w-screen-md mx-auto">
      <div className="border-b border-gray-300">
        <div className="pt-16 pb-8">
          <div className="font-semibold text-3xl text-gray-900">{Config.title}</div>
          <div className="text-xl">{Config.description}</div>
        </div>
        <div>
          <Navbar>
            <button
              type="button"
              onClick={() => {
                throw new Error('Sentry Frontend Error');
              }}
            >
              Throw error&nbsp;&nbsp;&nbsp;
            </button>
            <button
              type="button"
              onClick={() => {
                try {
                  return 1 / 0;
                } catch (exception) {
                  Sentry.captureException(exception);
                  return false;
                }
              }}
            >
              Handled error&nbsp;&nbsp;&nbsp;
            </button>
            <button
              type="button"
              onClick={async () => {
                console.log('Button clicked, starting transaction');
                const transaction = Sentry.startTransaction({ name: 'Frontend - Making API Call' });

                Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));

                console.log('Calling api');
                const response = await fetch('/api/error');
                console.log(response.ok);
                if (!response.ok) {
                  const { status: statusCode, statusText } = response;

                  const err = new Error(
                    `API Call to /api/error failed: ${statusCode} ${statusText}`,
                  );

                  Sentry.withScope((scope) => {
                    scope.setTags({
                      statusCode,
                      statusText,
                    });
                  });

                  console.log('response was not OK...');
                  Sentry.captureException(err);
                }
                console.log('Response data:', response.json());
                console.log('Finishing transaction');
                transaction.finish();
              }}
            >
              Generate Server Error
            </button>
            <li className="mr-6">
              <Link href="/">
                <a>Home</a>
              </Link>
            </li>
            <li className="mr-6">
              <Link href="/about/">
                <a>About</a>
              </Link>
            </li>
            <li className="mr-6">
              <a href="https://github.com/ixartz/Next-js-Blog-Boilerplate">GitHub</a>
            </li>
          </Navbar>
        </div>
      </div>

      <div className="text-xl py-5">{props.children}</div>

      <div className="border-t border-gray-300 text-center py-8 text-sm">
        © Copyright
        {' '}
        {new Date().getFullYear()}
        {' '}
        {Config.title}
        . Powered with
        {' '}
        <span role="img" aria-label="Love">
          ♥
        </span>
        {' '}
        by
        {' '}
        <a href="https://creativedesignsguru.com">CreativeDesignsGuru</a>
        {/*
         * PLEASE READ THIS SECTION
         * We'll really appreciate if you could have a link to our website
         * The link doesn't need to appear on every pages, one link on one page is enough.
         * Thank you for your support it'll mean a lot for us.
         */}
      </div>
    </div>
  </div>
);

export { Main };
