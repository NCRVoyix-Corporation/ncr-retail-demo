import sendRequest from './sendRequest';

const baseUrl = `https://gateway-staging.ncrcloud.com/catalog`;

/**
 * Fetches all catalog items (not site specific).
 *
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function getCatalogItems(hideInactive = false) {
  if (hideInactive) {
    return await sendRequest(`${baseUrl}/items?itemStatus=ACTIVE`, 'GET');
  } else {
    return await sendRequest(`${baseUrl}/items`, 'GET');
  }
}

/**
 * Creates one or more catalog items.
 *
 * @param {string} values The body in format { "items": [Items] }
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function createCatalogItems(values) {
  return await sendRequest(`${baseUrl}/items/`, 'PUT', values);
}

/**
 * Creates or updates an item with the provided itemCode. If the item exists, it will update only
 * if the version number is higher than the previous version.
 *
 * @param {string} itemCode itemCode of the provided item
 * @param {string} values The stringified body of the item
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function createOrUpdateCatalogItem(itemCode, values) {
  return await sendRequest(`${baseUrl}/items/${itemCode}`, 'PUT', values);
}

/**
 * Fetches the item by itemCode.
 *
 * @param {string} itemCode The itemCode for the item
 */
export async function getCatalogItemByItemCode(itemCode) {
  return await sendRequest(`${baseUrl}/items/${itemCode}`, 'GET');
}

/**
 * Creates one or more catalog item prices.
 *
 * @param {string} itemPrices The body in format { "itemPrices": [ItemPrices] }
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function createCatalogPricesItem(itemPrices) {
  return await sendRequest(`${baseUrl}/item-prices`, 'PUT', itemPrices);
}

/**
 * Creates one or more catalog item attributes.
 *
 * @param {string} values The stringified body in format { "itemAttributes": [ItemAttributes] }
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function createCatalogAttributesItem(values) {
  return await sendRequest(`${baseUrl}/item-attributes`, 'PUT', values);
}

/**
 * Fetches a catalog item at an nep-enterprise-unit.
 *
 * @param {string} siteId The nep-enterprise-unit id
 * @param {string} itemCode itemCode for the catalog item.
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function getSiteCatalogItem(siteId, itemCode) {
  return await sendRequest(`${baseUrl}/items/${itemCode}`, 'GET', null, siteId);
}

/**
 * Fetches the item-details by itemCode for a site.
 *
 * @param {string} siteId The nep-enterprise-unit
 * @param {string} itemCode itemCode of the catalog item
 */
export async function getSiteCatalogItemDetailsByItemCode(siteId, itemCode) {
  return await sendRequest(`${baseUrl}/item-details/${itemCode}`, 'GET', null, siteId);
}

/**
 * Fetches item details for an nep-enterprise-unit.
 * Optional search pattern by short description.
 *
 * @param {string} siteId The nep-enterprise-unit id
 * @param {string} query Optional search pattern query by shortDescription value.
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function getSiteCatalogItemDetails(siteId, query = null) {
  if (query != null) {
    let data = await sendRequest(`${baseUrl}/item-details/search?shortDescriptionPattern=*${query}*&itemStatus=ACTIVE&sortField=ITEM_CODE&sortDirection=ASC`, 'GET', null, siteId);
    return data;
  } else {
    let data = await sendRequest(`${baseUrl}/item-details/search?itemStatus=ACTIVE&sortField=ITEM_CODE&sortDirection=ASC`, 'GET', null, siteId);
    return data;
  }
}

/**
 * Fetches item prices by array of itemCodes.
 *
 * @param {string} siteId The nep-enterprise-unit
 * @param {array} itemCodes Object of array of itemCodes to fetch
 */
export async function getSiteCatalogItemPricesByItemCodes(siteId, itemCodes) {
  return await sendRequest(`${baseUrl}/item-prices/get-multiple`, 'POST', itemCodes, siteId);
}

/**
 * Fetches item attributes by array of itemCodes.
 *
 * @param {string} siteId The nep-enterprise-unit
 * @param {string} itemCodes Object of array of itemCodes to fetch
 */
export async function getSiteCatalogItemAttributesByItemCodes(siteId, itemCodes) {
  return await sendRequest(`${baseUrl}/item-attributes/get-multiple`, 'POST', itemCodes, siteId);
}

/**
 * Fetches item details for an nep-entperise-unit by category id.
 *
 * @param {string} siteId The nep-enterprise-unit id
 * @param {string} category The nodeId/nodeCode of the category.
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function getSiteCatelogItemsByMerchandiseCategoryId(siteId, category) {
  return await sendRequest(`${baseUrl}/item-details/search?merchandiseCategoryId=${category}&itemStatus=ACTIVE&sortField=ITEM_CODE&sortDirection=ASC`, 'GET', null, siteId);
}

/**
 * Updates an item-price for a nep-enterprise-unit and item.
 *
 * @param {string} siteId The nep-enterprise-unit id
 * @param {string} itemCode itemCode for the item
 * @param {string} priceCode priceCode for the item
 * @param {string} values The stringified body to update the itemPrice
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function updateSiteCatalogItemPricesByItemCode(siteId, itemCode, priceCode, values) {
  return await sendRequest(`${baseUrl}/item-prices/${itemCode}/${priceCode}`, 'PUT', values, siteId);
}

/**
 * Updates item-attributes for a nep-enterprise-unit and item.
 *
 * @param {string} siteId The nep-enterprise-unit id
 * @param {string} itemCode itemCode for the item
 * @param {string} values The stringified body to update the itemAttribute
 * @returns {object} The response as { status: string, data: JSON }
 */
export async function updateSiteCatalogItemAttributesByItemCode(siteId, itemCode, values) {
  return await sendRequest(`${baseUrl}/item-attributes/${itemCode}`, 'PUT', values, siteId);
}

/**
 * Gets homepage list of 10 items.
 */
export async function getHomepageCatalogItems() {
  return await sendRequest(`${baseUrl}/items?pageSize=10&itemStatus=ACTIVE&sortField=ITEM_CODE&sortDirection=ASC`, 'GET');
}

export async function getCatalogItemsByGroup(siteId, group) {
  return await sendRequest(`${baseUrl}/item-details/search?groupCode=${group}`, 'GET', null, siteId);
}

export async function getHomepageCatalogItemsByGroup(siteId, group) {
  return await sendRequest(`${baseUrl}/item-details/search?groupCode=${group}`, 'GET', null, siteId);
}
