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
            <li>
              <button
                type="button"
                onClick={async () => {
                  console.log('Button clicked, starting transaction');
                  const transaction = Sentry.startTransaction({ name: 'Frontend - Making API Call' });

                  Sentry.getCurrentHub().configureScope((scope) => scope.setSpan(transaction));

                  console.log('Fetching products in cart...');
                  const products = await fetch(
                    'https://application-monitoring-flask-dot-sales-engineering-sf.appspot.com/products',
                  );
                  console.log("fetched products", products);

                  console.log('Checking out...');
                  const checkoutUrl = 'https://application-monitoring-flask-dot-sales-engineering-sf.appspot.com/checkout';
                  const body = `{\"cart\":{\"items\":[{\"id\":4,\"title\":\"Botana Voice\",\"description\":\"Lets plants speak for themselves.\",\"descriptionfull\":\"Now we don't want him to get lonely, so we'll give him a little friend. Let your imagination just wonder around when you're doing these things. Let your imagination be your guide. Nature is so fantastic, enjoy it. Let it make you happy.\",\"price\":175,\"img\":\"https://storage.googleapis.com/application-monitoring/plant-to-text.jpg\",\"imgcropped\":\"https://storage.googleapis.com/application-monitoring/plant-to-text-cropped.jpg\",\"pg_sleep\":\"\",\"reviews\":[{\"id\":4,\"productid\":4,\"rating\":4,\"customerid\":null,\"description\":null,\"created\":\"2021-06-04 00:12:33.553939\",\"pg_sleep\":\"\"},{\"id\":5,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-06-04 00:12:45.558259\",\"pg_sleep\":\"\"},{\"id\":6,\"productid\":4,\"rating\":2,\"customerid\":null,\"description\":null,\"created\":\"2021-06-04 00:12:50.510322\",\"pg_sleep\":\"\"},{\"id\":13,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:12:43.312186\",\"pg_sleep\":\"\"},{\"id\":14,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:12:54.719873\",\"pg_sleep\":\"\"},{\"id\":15,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:12:57.760686\",\"pg_sleep\":\"\"},{\"id\":16,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:13:00.140407\",\"pg_sleep\":\"\"},{\"id\":17,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:13:00.971730\",\"pg_sleep\":\"\"},{\"id\":18,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:13:01.665798\",\"pg_sleep\":\"\"},{\"id\":19,\"productid\":4,\"rating\":3,\"customerid\":null,\"description\":null,\"created\":\"2021-07-01 00:13:02.278934\",\"pg_sleep\":\"\"}]}],\"quantities\":{\"4\":2},\"total\":350},\"form\":{\"loading\":false}}`;

                  const response = await fetch(checkoutUrl, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: body,
                  })
                  .catch((err) => {
                    return { ok: false, status: 500, statusText: err }
                  })

                  if (!response.ok) {
                    const err = new Error(
                      `API Call to /checkout failed`
                    );

                    Sentry.withScope((scope) => {
                      scope.setTags({
                        status: 500,
                        message: "something went wrong",
                      });
                    });

                    console.log('response was not OK...');
                    Sentry.captureException(err);
                  }
                  console.log('Finishing transaction');
                  transaction.finish();
                }}
              >
                Checkout (4 items)
              </button>
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
