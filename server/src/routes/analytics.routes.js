const router = require('express').Router();
const { getOverview, getBySource, getTimeSeries, getAppointmentStats, getRecentActivity } = require('../controllers/analytics.controller');

router.get('/overview', getOverview);
router.get('/by-source', getBySource);
router.get('/time-series', getTimeSeries);
router.get('/appointments', getAppointmentStats);
router.get('/recent', getRecentActivity);

module.exports = router;
