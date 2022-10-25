/*
 * Copyright 2022 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 *
 */

import Head from 'next/head';
import Layout from '../components/layout';
import getPages from '../lib/getPages';

export default function Home({ pages }) {
  return (
    <Layout pages={pages}>
      <Head>
        <title>Home</title>
      </Head>
      <section>
        <div className="px-2 py-4 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-2 lg:py-6">
          <h1>Homepage</h1>
        </div>
      </section>
    </Layout>
  );
}

export async function getServerSideProps(context) {
  const pages = await getPages();

  return {
    props: {
      pages,
    },
  };
}
