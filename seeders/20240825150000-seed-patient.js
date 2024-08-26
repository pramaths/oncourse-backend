'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Patients', [
      {
        name: 'Jane Doe',
        age: 32,
        gender: 'Female',
        history: 'Pregnant',
        symptoms: 'Mild bleeding and pain',
        additionalInfo: 'Uterus is tender, fetal heart sounds are absent',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John Smith',
        age: 5,
        gender: 'Male',
        history: 'Diagnosed with posterior superior retraction pocket',
        symptoms: 'None specified',
        additionalInfo: 'Posterior superior retraction pocket present',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Robert Johnson',
        age: 48,
        gender: 'Male',
        history: 'None specified',
        symptoms: 'Exquisitely painful, raised, red lesion on the dorsal surface of left hand',
        additionalInfo: 'Histologic examination shows nests of round, regular cells within connective tissue associated with branching vascular spaces',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Patients', null, {});
  }
};
