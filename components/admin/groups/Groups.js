import LoadingTable from '~/components/admin/LoadingTable';
import { Table } from 'reactstrap';

function Groups({ data, isError, isLoading }) {
  const groups = data.data && data.data.pageContent.length > 0 ? data.data.pageContent : [];
  const activeGroups = groups.filter((group) => group.status === "ACTIVE");

  return (
    <div>
      <div className="bg-white pb-2">
        <Table responsive hover striped={!isError && !isLoading} size="sm">
          <thead>
            <tr>
              <th>Group Code</th>
              <th>Name</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>
          {!isError && !isLoading ? (
            <tbody>
              {activeGroups.map((item) => (
                <tr key={item.groupId.groupCode}>
                  <th scope="row">{item.groupId.groupCode}</th>
                  <td>{item.title.value}</td>
                  <td>{item.status}</td>
                  <td>
                    <a href={`/admin/groups/${item.groupId.groupCode}`}>
                      {/* TODO: Fix Edit Groups functionality
                        <FontAwesomeIcon icon={faEdit} color="darkslategrey" />
                      */}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          ) : (
            !isError && <LoadingTable />
          )}
        </Table>
        {activeGroups.length === 0 && !isLoading && !isError && <p className="text-center">No active groups found.</p>}
      </div>
    </div>
  );
}

export default Groups;
