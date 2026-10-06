import React from 'react';
import Groups from '~/components/admin/groups/Groups';
import Layout from '~/components/admin/Layout';
import Link from 'next/link';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import useDashboard from '~/lib/swr/useDashboard';

const GroupsTab = () => {
  let { data, isLoading, isError } = useDashboard({ param: 'groups' });

  return (
    <Layout activeTab="groups">
      <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3 border-bottom">
        <h1 className="h2">Groups</h1>
        <div className="btn-toolbar mb-2 mb-md-0">
          <div className="btn-group mr-2">
            <Link href="/admin/groups/new" passHref>
              <button type="button" className="btn btn-sm btn-outline-secondary">
                <FontAwesomeIcon icon={faPlus} size="1x" /> New Group
              </button>
            </Link>
          </div>
        </div>
      </div>
      {isError && <small className="text-muted">{`Uh oh, we've hit an error.`}</small>}
      <Groups isLoading={isLoading} isError={isError} data={data && data.result && data.result.status === 200 ? data.result : []} />
    </Layout>
  );
};

export default GroupsTab;
