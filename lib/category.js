import sendRequest from './sendRequest';
import _ from 'lodash';

const baseUrl = `https://gateway-staging.ncrcloud.com/catalog/v2`;

export function listAllCategories(categories) {
  let copy = categories.slice();
  let output = [];
  let level = 0;
  while (copy.length > 0) {
    let current = copy.shift();
    output.push({
      id: current.nodeCode,
      title: current.title.value,
      level: current.level ? current.level : 0
    });
    if (current.children && Object.keys(current.children).length > 1) {
      if (current.level) {
        level = current.level + 1;
      } else {
        level = 1;
      }
      for (const key in current.children) {
        if (key !== 'array') {
          let currentCopy = JSON.parse(JSON.stringify(current.children[key]));
          currentCopy['level'] = level;
          copy.push(currentCopy);
        }
      }
    }
  }
  return output;
}

export async function createCategory(values) {
  let data = await sendRequest(`${baseUrl}/category-nodes`, 'PUT', values);
  return data;
}

export async function updateCategory(values) {
  let data = await sendRequest(`${baseUrl}/category-nodes`, 'PUT', values);
  return data;
}

export async function getCategoryNodes() {
  let response = await sendRequest(`${baseUrl}/category-nodes`, 'GET');
  return response;
}

export async function getCategoryNodesForMenu() {
  let { categories, logs } = await getAllCategoryNodes(false, false);
  if (categories && categories.length > 0) {
    categories.forEach((element) => {
      if (element.children.array.length > 0) {
        let children = element.children.array;
        let sortedC = [];
        children.forEach((child) => {
          if (element.children[child].children) {
            let grandchildren = element.children[child].children;
            let sortedGC = [];
            Object.keys(grandchildren).forEach((index) => sortedGC.push(grandchildren[index]));
            sortedGC = _.sortBy(sortedGC, function (c) {
              return c.nodeCode;
            });
            element.children[child].children = sortedGC;
          }
          sortedC.push(element.children[child]);
        });
        sortedC = _.sortBy(sortedC, function (c) {
          return c.nodeCode;
        });
        element.children = sortedC;
      }
    });
    categories = _.sortBy(categories, function (c) {
      return c.nodeCode;
    });
  }
  return {
    categories,
    logs
  };
}

export async function getAllCategoryNodes(flatten = false, includeDepartmentNodes = true) {
  let logs = [];
  let response = await sendRequest(`${baseUrl}/category-nodes`, 'GET');
  logs.push(response.log);
  if (response.status == 200) {
    let parentCategoriesResponse = response.data.pageContent;
    let allCategories = [];
    let parentCategories = [];
    parentCategoriesResponse.forEach((category) => {
      if (!includeDepartmentNodes && !category.departmentNode) {
        parentCategories.push(category);
        allCategories.push(category);
      } else if (includeDepartmentNodes) {
        parentCategories.push(category);
        allCategories.push(category);
      }
    });

    let parentCategoriesMap = {};
    const promises = parentCategories.map(async (category) => {
      const children = await getCategoriesByParentId(category.nodeCode);
      logs.push(children.log);
      let nodeCode = category.nodeCode;
      let childrenData = children.data.pageContent;
      let output = {};
      let outputArray = [];
      childrenData.forEach((child) => {
        output[child.nodeCode] = child;
        outputArray.push(child.nodeCode);
        allCategories.push(child);
      });
      parentCategoriesMap[nodeCode] = output;
      parentCategoriesMap[nodeCode]['array'] = outputArray;
      return children;
    });

    await Promise.all(promises);

    let result = [];
    parentCategories.forEach((category) => {
      category['children'] = parentCategoriesMap[category.nodeCode];
      result.push(category);
    });

    // We know it is only 3 layers deep so shortcutting this.
    let finalResult = [];
    let currentResult = result.slice();
    let promiseOne = currentResult.map(async (root) => {
      // Deep copy the object
      let copied = JSON.parse(JSON.stringify(root));
      const children = root.children;
      const promiseTwo = children.array.map(async (child) => {
        const grandChildren = await getCategoriesByParentId(child);
        logs.push(grandChildren.log);
        let grandChildrenData = grandChildren.data.pageContent;
        let output = {};
        grandChildrenData.forEach((grandChild) => {
          output[grandChild.nodeCode] = grandChild;
          allCategories.push(grandChild);
        });
        parentCategoriesMap[copied.nodeCode][child] = output;
        return grandChildren;
      });

      await Promise.all(promiseTwo);
      children.array.forEach((child) => {
        copied.children[child]['children'] = parentCategoriesMap[root.nodeCode][child];
      });
      finalResult.push(copied);
    });

    await Promise.all(promiseOne);

    if (flatten) {
      return { categories: allCategories, logs: logs };
    }
    return { categories: finalResult, logs: logs };
  } else {
    return { categories: [], logs: logs };
  }
}

export async function getCategoryById(id) {
  let response = await sendRequest(`${baseUrl}/category-nodes/${id}`, 'GET');
  return response;
}

export async function getCategoriesByParentId(parentId) {
  let response = await sendRequest(`${baseUrl}/category-nodes?parentId=${parentId}`, 'GET');
  return response;
}

export async function getCatalogItemCategoryAncestorsByMerchandiseCategory(nodeId) {
  let response = await sendRequest(`${baseUrl}/category-nodes/${nodeId}/ancestors`, 'GET');
  if (response.status == 200) {
    // Organize in parent-child-order.
    let nodes = response.data.nodes;
    let hierarchicalNodes = [];
    while (hierarchicalNodes.length != nodes.length) {
      if (hierarchicalNodes.length == 0) {
        _.find(nodes, function (element) {
          if (!element.parentId) {
            hierarchicalNodes.push(element);
            return false;
          }
        });
      } else {
        let lastNode = hierarchicalNodes[hierarchicalNodes.length - 1];
        _.find(nodes, function (element) {
          if (element.parentId && element.parentId.nodeId == lastNode.nodeCode) {
            hierarchicalNodes.push(element);
            return false;
          }
        });
      }
    }
    response.data.nodes = hierarchicalNodes;
    return response;
  } else {
    return {};
  }
}

export async function getSiteCatalogItemPricesByItemCodes(siteId, itemCodes) {
  let itemIds = {};
  itemIds.itemIds = itemCodes;
  let response = await sendRequest(`${baseUrl}/item-prices/get-multiple`, 'POST', itemIds, siteId);
  return response;
}

export async function getSiteCatalogItemAttributesByItemCodes(siteId, itemCodes) {
  let itemIds = {};
  itemIds.itemIds = itemCodes;
  let response = await sendRequest(`${baseUrl}/item-attributes/get-multiple`, 'POST', itemIds, siteId);
  return response;
}

export async function getCatalogItemByItemCode(id) {
  let response = await sendRequest(`${baseUrl}/items/${id}`, 'GET');
  return response;
}
