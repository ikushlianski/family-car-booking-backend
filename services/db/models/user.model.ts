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
    firstName: {
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
    providedCarIds: {
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
          default: false,
        },
        getNotifiedWhenBookingChanged: {
          type: 'boolean',
          default: false,
        },
      },
    },
    tgEnabled: {
      type: 'boolean',
      default: false,
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
    getUserBySessionId: {
      index: 'get-user-by-session-id',
      pk: {
        field: 'gsi1pk',
        composite: ['sessionId'],
      },
      sk: {
        field: 'gsi1sk',
        composite: [],
      },
    },
  },
});
