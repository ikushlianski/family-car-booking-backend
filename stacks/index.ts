import { Database } from 'stacks/Database';
import { MyStack } from 'stacks/MyStack';
import { App } from '@serverless-stack/resources';

export default function (app: App) {
  app.setDefaultFunctionProps({
    runtime: 'nodejs16.x',
    srcPath: 'services',
    bundle: {
      format: 'esm',
    },
  });

  app.stack(MyStack).stack(Database);
}
