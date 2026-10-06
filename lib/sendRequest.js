import generateHMAC from '~/ncr-hmac';

/**
 *
 * @param {string} url URL for API request
 * @param {string} method GET/PUT/POST
 * @param {object} body Optional object to send (not stringified)
 * @param {string} enterpriseUnit Optional enterpriseUnitId
 * @param returnHeaders
 */
export default async function sendRequest(url, method, body = null, enterpriseUnit = null, returnHeaders = false) {
  let date = new Date();

  let headers = {
    url,
    date,
    method,
    contentType: 'application/json',
    organization: process.env.REACT_APP_BSP_ORGANIZATION,
    secretKey: process.env.REACT_APP_BSP_SECRET_KEY
    // content-md5?
  };

  const hmacAccessKey = generateHMAC(headers);

  var requestOptions = {
    method: headers.method,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `AccessKey ${process.env.REACT_APP_BSP_SHARED_KEY}:${hmacAccessKey}`,
      'nep-organization': headers.organization,
      Date: date.toGMTString()
    }
  };
  if (body !== null) {
    requestOptions['body'] = JSON.stringify(body);
  }
  if (enterpriseUnit !== null) {
    requestOptions.headers['nep-enterprise-unit'] = enterpriseUnit;
  }

  const res = await fetch(`${headers.url}`, requestOptions);

  let requestObject = {
    url: headers.url,
    request: requestOptions
  };

  requestObject['request']['headers']['Authorization'] = 'AccessKey ****';
  requestObject['request']['headers']['nep-organization'] = '****';
  if (enterpriseUnit !== null) {
    requestObject['request']['headers']['nep-enterprise-unit'] = '****';
  }

  let log = { req: requestObject, res };
  const status = res.status;
  if (status === 204 || ((status === 201 || headers.method == 'PATCH' || headers.method == 'DELETE') && url.includes('emerald') && !returnHeaders)) {
    return { status, log };
  }
  if (returnHeaders) {
    headers = res.headers;
    log.res = {
      status,
      headers
    };
    return { status, headers, log };
  }

  const data = await res.json();
  log.res = {
    status,
    data
  };
  return { status, data, log };
}
