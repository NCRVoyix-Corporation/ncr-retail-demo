import sendRequest from './sendRequest';

const baseUrl = `https://gateway-staging.ncrcloud.com/catalog/v2/groups`;

export async function getAllGroups() {
  return sendRequest(`${baseUrl}?pageSize=100`, 'GET', null);
}

export async function createGroup(values) {
  let data = { groups: [values] };
  return sendRequest(`${baseUrl}`, 'PUT', data);
}

export async function getHomepageGroups(groups) {
  return sendRequest(`${baseUrl}?pageSize=100&titlePattern=${groups}`, 'GET');
}

export async function getGroupById(id) {
  return sendRequest(`${baseUrl}/${id}`, 'GET');
}
