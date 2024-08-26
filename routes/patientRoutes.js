const express = require('express');
const router = express.Router();
const patientController = require('../controllers/patientController');

router.get('/patients', patientController.getAllPatients);

router.post('/patients', patientController.createPatient);

router.put('/patients/:id', patientController.updatePatient);

router.get('/patients/:id', patientController.getPatientdetailsinfo);

router.get("/patient/:id", patientController.getPatient);

module.exports = router;
