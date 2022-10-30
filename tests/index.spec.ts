import * as podIpTools from '../src/ip';

test('Synchronize methods return IP addresses', () => {
  const mock = jest.spyOn(podIpTools, 'isInKubernetesSync').mockReturnValue(true);
  const mock1 = jest.spyOn(podIpTools, 'isInDockerSync').mockReturnValue(true);
  const mock2 = jest.mock('execSync', () => () => ({
    stdout: 'test-ip',
    stderr: 'error',
  }));

  expect(podIpTools.ipSync()).resolves.toEqual("test-ip");
});
