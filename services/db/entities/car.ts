import { Entity } from 'electrodb';
import { ELECTRO_DB_SERVICE } from '../db.constants';

export const CarModel = new Entity({
  model: {
    entity: 'cars',
    version: '1',
    service: ELECTRO_DB_SERVICE,
  },
  attributes: {
    carId: {
      type: 'string', // license plate
      required: true,
    },
    username: {
      type: 'string',
      required: true,
    },
  },
  indexes: {
    carById: {
      pk: {
        field: 'pk',
        composite: ['carId'],
      },
      sk: {
        field: 'sk',
        composite: [],
      },
    },
  },
});
