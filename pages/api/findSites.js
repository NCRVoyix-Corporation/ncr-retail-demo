// This probably can be under sites.js...but this was quicker.
import haversine from 'haversine';
import _ from 'lodash';
import { findNearby } from '~/lib/sites';

export default async function handler(req, res) {
  if (req.query.latitude && req.query.longitude) {
    let response = await findNearby(req.query.latitude, req.query.longitude);
    if (response.status == 200) {
      let sites = response.data.sites;
      let activeSites = [];
      const start = {
        latitude: req.query.latitude,
        longitude: req.query.longitude
      };
      sites.forEach((site) => {
        let end = {
          latitude: site.coordinates.latitude,
          longitude: site.coordinates.longitude
        };
        site['distanceTo'] = haversine(start, end, { unit: 'mile' });
        if (site.status == 'ACTIVE') {
          activeSites.push(site);
        }
      });
      let orderedSites = _.orderBy(activeSites, ['distanceTo'], ['asc']);
      if (orderedSites.length == 0) {
        let response = await findNearby();
        res.status(response.status).json({ response, logs: [response.log] });
      } else {
        response.data.pageContent = orderedSites;
        res.status(response.status).json({ response, logs: [response.log] });
      }
    } else {
      res.status(response.status).json({ response, logs: [response.log] });
    }
  } else {
    try {
      let response = await findNearby();
      return res.status(response.status).json({ response, logs: [response.log] });
    } catch (error) {
      console.log(error);
    }
  }
}
