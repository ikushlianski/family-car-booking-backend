import { Database } from 'stacks/Database';
import { MyStack } from 'stacks/MyStack';
import { App, use } from '@serverless-stack/resources';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });

  app.stack(Database).stack(MyStack);

  const { table } = use(Database);
  const { api } = use(MyStack);

  api.attachPermissions([table]);
}
