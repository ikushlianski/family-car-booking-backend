import { Entity } from 'electrodb';
import { ELECTRO_DB_SERVICE } from '../db.constants';

export const UserModel = new Entity({
  model: {
    entity: 'users',
    version: '1',
    service: ELECTRO_DB_SERVICE,
  },
  attributes: {
    username: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true,
    },
    sessionId: {
      type: 'string',
    },
    roles: {
      type: 'list',
      required: true,
      items: {
        type: 'string',
      },
    },
    availableCarIds: {
      type: 'list',
      required: true,
      items: {
        type: 'string',
      },
    },
    notifications: {
      type: 'map',
      properties: {
        getNotifiedWhenBookingCreated: {
          type: 'boolean',
        },
        getNotifiedWhenBookingChanged: {
          type: 'boolean',
        },
      },
    },
    rideCompletionText: {
      type: 'string',
    },
  },
  indexes: {
    username: {
      pk: {
        field: 'pk',
        composite: ['username'],
      },
      sk: {
        field: 'sk',
        composite: [],
      },
    },
    auth: {
      index: 'gsi1pk-gsi1sk-index',
      pk: {
        field: 'gsi1pk',
        composite: ['sessionId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: [],
      },
    },
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
});
