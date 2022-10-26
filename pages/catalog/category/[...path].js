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
 */

import Head from 'next/head';
import Error from 'next/error';

import client from '../../../lib/graphqlClient';
import Layout from '../../../components/layout';
import getPages from '../../../lib/getPages';
import ProductCard from '../../../components/ProductCard';
import getCategoryByUID from './getCategoryByUID.graphql';
import getCategoryByRoute from './getCategoryByRoute.graphql';

export default function Category(props) {
    const { category, extension, pages } = props;

    if (!category) {
        return <Error statusCode={404} />
    }

    const { banner, description, styling, highlightedProducts } = extension || {};

    return <Layout pages={pages}>
        <Head>
            <title>{category.name}</title>
        </Head>
        <section>
            <div className="bg-white">
                <div className={`max-w-2xl px-4 py-10 mx-auto sm:py-16 sm:px-6 lg:max-w-7xl lg:px-8 ${styling}`}>
                    <h1 className="pb-5 text-2xl font-extrabold tracking-tight text-gray-900">{category.name}</h1>
                    {banner?._publishUrl && <img className="object-cover h-60 w-full rounded-md" src={banner._publishUrl} alt="Hero" />}
                    {description?.plaintext && <div className="items-center justify-center my-10 px-4 py-6 rounded-md sm:px-6 lg:px-8 bg-slate-100">{description.plaintext}</div>}
                    <div className="grid grid-cols-1 mt-6 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8">
                        {category.products.items.map((product, index) => <ProductCard product={product} highlighted={highlightedProducts?.includes(product.sku)} key={product.sku} priority={index === 0} />)}
                    </div>
                </div>
            </div>
        </section>
    </Layout>;
}

export async function getServerSideProps({ params }) {
    const pages = await getPages();
    let category = null;

    // Find category UID by URL
    const { data : routeData } = await client.query({
        query: getCategoryByRoute,
        variables: {
            url: params.path.join('/') + '.html'
        }
    });
    const uid = routeData.route?.uid || null;
    if (!uid) {
        return { props: { pages, category } };
    }

    // Load category data and extension
    const { data } = await client.query({
        query: getCategoryByUID,
        variables: {
            uid,
        }
    });

    category = data?.categories?.items?.[0] || null;
    const extension = data?.categoryPageExtensionList?.items?.[0] || null;
    return {
        props: { pages, category, extension },
    };
}