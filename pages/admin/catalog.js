import React from 'react';
import Catalog from '~/components/admin/catalog/Catalog';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import Layout from '~/components/admin/Layout';
import useDashboard from '~/lib/swr/useDashboard';

const CatalogTab = () => {
  let { data, isLoading, isError } = useDashboard({ param: 'catalog' });

  return (
    <Layout activeTab="catalog">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Global Catalog</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <Link href="/admin/catalog/new" passHref>
              <button type="button" className="btn btn-sm btn-outline-secondary">
                <FontAwesomeIcon icon={faPlus} size="1x" /> New Catalog Item
              </button>
            </Link>
          </div>
        </div>
      </div>
      {isError && <small className="text-muted">{`Uhoh, we've hit an error.`}</small>}
      <Catalog isLoading={isLoading} isError={isError} data={data && data.catalog && data.catalog.status == 200 ? data.catalog : []} />
    </Layout>
  );
};

export default CatalogTab;
