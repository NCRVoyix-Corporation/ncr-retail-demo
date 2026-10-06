export default async function handler(_, res) {
  const unavailable = { message: 'Service unavailable' };

  let homepage = await fetch(process.env.NEXTAUTH_URL);
  if (homepage.status !== 200) {
    res.status(502).json(unavailable);
    return;
  }

  let sites = await fetch(`${process.env.NEXTAUTH_URL}/api/findSites`);
  if (sites.status !== 200) {
    res.status(502).json(unavailable);
    return;
  }

  let sitesResponse = await sites.json();
  if (!sitesResponse.response || !sitesResponse.response.data || !sitesResponse.response.data.pageContent) {
    res.status(502).json(unavailable);
    return;
  }

  let firstSite = sitesResponse.response.data.pageContent[0].id;

  let catalog = await fetch(`${process.env.NEXTAUTH_URL}/api/catalog?id=${firstSite}`);
  if (catalog.status !== 200) {
    res.status(502).json(unavailable);
    return;
  }

  let catalogResponse = await catalog.json();

  if (!catalogResponse.catalogItems || !catalogResponse.catalogItems.data || !catalogResponse.catalogItems.data.pageContent) {
    res.status(502).json(unavailable);
    return;
  }

  let firstCatalogItem = catalogResponse.catalogItems.data.pageContent[0];

  let catalogItem = await fetch(`${process.env.NEXTAUTH_URL}/api/catalog/${firstSite}/${firstCatalogItem.item.itemId.itemCode}`);
  if (catalogItem.status !== 200) {
    res.status(502).json(unavailable);
    return;
  }

  res.status(200).json({ message: 'Welcome to NCR Voyix Retail Demo.' });
}
