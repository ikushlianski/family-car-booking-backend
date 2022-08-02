import { Entity } from 'electrodb';
import { dynamoDBClient } from '../db.service';
import { ELECTRO_DB_SERVICE, TABLE_NAME } from '../db.constants';

export const BookingModel = new Entity(
  {
    model: {
      entity: 'bookings',
      version: '1',
      service: ELECTRO_DB_SERVICE,
    },
    attributes: {
      username: {
        type: 'string',
        required: true,
      },
      carId: {
        type: 'string',
        required: true,
      },
      startTime: {
        type: 'number',
        required: true,
      },
      endTime: {
        type: 'number',
        required: false,
      },
      description: {
        type: 'string',
        required: false,
      },
      carLocationAfterRideText: {
        type: 'string',
        required: false,
      },
      carLocationAfterRideLat: {
        type: 'string',
        required: false,
      },
      carLocationAfterRideLong: {
        type: 'string',
        required: false,
      },
    },
    indexes: {
      singleBooking: {
        pk: {
          field: 'pk',
          composite: ['username'],
        },
        sk: {
          field: 'sk',
          composite: ['carId', 'startTime'],
        },
      },
      // coworkers: {
      //   index: "gsi1pk-gsi1sk-index",
      //   collection: "workplaces",
      //   pk: {
      //     field: "gsi1pk",
      //     composite: ["office"],
      //   },
      //   sk: {
      //     field: "gsi1sk",
      //     composite: ["team", "title", "employee"],
      //   },
      // },
      // teams: {
      //   index: "gsi2pk-gsi2sk-index",
      //   pk: {
      //     field: "gsi2pk",
      //     composite: ["team"],
      //   },
      //   sk: {
      //     field: "gsi2sk",
      //     composite: ["title", "salary", "employee"],
      //   },
      // },
      // employeeLookup: {
      //   collection: "assignments",
      //   index: "gsi3pk-gsi3sk-index",
      //   pk: {
      //     field: "gsi3pk",
      //     composite: ["employee"],
      //   },
      //   sk: {
      //     field: "gsi3sk",
      //     composite: [],
      //   },
      // },
      // roles: {
      //   index: "gsi4pk-gsi4sk-index",
      //   pk: {
      //     field: "gsi4pk",
      //     composite: ["title"],
      //   },
      //   sk: {
      //     field: "gsi4sk",
      //     composite: ["salary", "employee"],
      //   },
      // },
      // directReports: {
      //   index: "gsi5pk-gsi5sk-index",
      //   pk: {
      //     field: "gsi5pk",
      //     composite: ["manager"],
      //   },
      //   sk: {
      //     field: "gsi5sk",
      //     composite: ["team", "office", "employee"],
      //   },
      // },
    },
  },
  { client: dynamoDBClient, table: TABLE_NAME },
);
