import * as execa from 'execa';
import * as podIpTools from '../src/ip';

test('Synchronize methods return IP addresses', () => {
  const mock = jest.spyOn(podIpTools, 'isInKubernetesSync').mockReturnValue(true);
  const mock1 = jest.spyOn(podIpTools, 'isInDockerSync').mockReturnValue(true);
  const mock2 = jest.spyOn(execa, 'commandSync').mockReturnValue({
    stdout: 'test-ip',
    stderr: 'error',
  } as unknown as execa.ExecaSyncReturnValue<Buffer>);

  expect(podIpTools.ipSync()).toEqual('test-ip');
});
