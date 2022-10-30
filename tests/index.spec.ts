import * as execa from 'execa';
import * as fs from 'fs';
import * as os from 'os';
import * as podIpTools from '../src/ip';

describe('isInKubernetesSync', () => {
  const mock = jest.spyOn(execa, 'commandSync');
  beforeEach(() => {
    mock.mockReset();
  });
  afterAll(() => {
    mock.mockRestore();
  });
  test('returns true if inside pod', () => {
    mock.mockReturnValueOnce({
      stdout: 'KUBERNETES_SERVER_PORT=443',
      stderr: 'error',
    } as unknown as execa.ExecaSyncReturnValue<Buffer>);
    expect(podIpTools.isInKubernetesSync()).toBe(true);
  });

  test('returns false if inside pod', () => {
    mock.mockReturnValueOnce({
      stdout: 'HOSTNAME=RABC',
      stderr: 'error',
    } as unknown as execa.ExecaSyncReturnValue<Buffer>);
    expect(podIpTools.isInKubernetesSync()).toBe(false);
    expect(mock).toBeCalledTimes(1);
  });
});

describe('isInKubernetes', () => {
  const mock = jest.spyOn(execa, 'command');
  beforeEach(() => {
    mock.mockReset();
  });
  afterAll(() => {
    mock.mockRestore();
  });
  test('returns true if inside pod', async () => {
    mock.mockResolvedValueOnce({
      stdout: 'KUBERNETES_SERVER_PORT=443',
      stderr: 'error',
    } as unknown as execa.ExecaReturnValue<Buffer>);
    await expect(podIpTools.isInKubernetes()).resolves.toBe(true);
    expect(mock).toBeCalledTimes(1);
  });

  test('returns false if inside pod', async () => {
    mock.mockResolvedValueOnce({
      stdout: 'HOSTNAME=RABC',
      stderr: 'error',
    } as unknown as execa.ExecaReturnValue<Buffer>);

    await expect(podIpTools.isInKubernetes()).resolves.toBe(false);
    expect(mock).toBeCalledTimes(1);
  });
});

describe('isInDockerSync', () => {
  const mock = jest.spyOn(fs, 'readFileSync');
  beforeEach(() => {
    mock.mockReset();
  });
  afterAll(() => {
    mock.mockRestore();
  });
  test('returns true if inside docker', () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValueOnce('linux');
    mock.mockReturnValueOnce(
      '2:cpu:/docker/7e5b8976101572b85e0aeea155d3350ce2f3fbaf068bd894c094977a004002ac\n' +
        '1:cpuset:/docker/7e5b8976101572b85e0aeea155d3350ce2f3fbaf068bd894c094977a004002ac\n'
    );
    expect(podIpTools.isInDockerSync()).toBe(true);
    platformMock.mockReset();
  });

  test('returns false if inside docker', () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValueOnce('linux');
    mock.mockReturnValueOnce('2:cpu:/\n' + '1:cpuset:/\n');
    expect(podIpTools.isInDockerSync()).toBe(false);
    expect(mock).toBeCalledTimes(1);
    platformMock.mockReset();
  });

  test('returns false if the platform is not linux', () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValueOnce('darwin').mockReturnValueOnce('win32');
    expect(podIpTools.isInDockerSync()).toBe(false);
    platformMock.mockRestore();
  });
});

describe('isInDocker', () => {
  const mock = jest.spyOn(fs.promises, 'readFile');
  beforeEach(() => {
    mock.mockReset();
  });
  afterAll(() => {
    mock.mockRestore();
  });
  test('returns true if inside docker', async () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValue('linux');
    mock.mockResolvedValue(
      '2:cpu:/docker/7e5b8976101572b85e0aeea155d3350ce2f3fbaf068bd894c094977a004002ac\n' +
        '1:cpuset:/docker/7e5b8976101572b85e0aeea155d3350ce2f3fbaf068bd894c094977a004002ac\n'
    );
    await expect(podIpTools.isInDocker()).resolves.toBe(true);
    expect(mock).toBeCalledTimes(1);
    platformMock.mockReset();
  });

  test('returns false if inside docker', async () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValue('linux');
    jest.spyOn(os, 'platform').mockReturnValue('linux');
    mock.mockResolvedValue('2:cpu:/\n' + '1:cpuset:/\n');
    await expect(podIpTools.isInDocker()).resolves.toBe(false);
    expect(mock).toBeCalledTimes(1);
    platformMock.mockReset();
  });

  test('returns false if the platform is not linux', async () => {
    const platformMock = jest.spyOn(os, 'platform').mockReturnValueOnce('darwin').mockReturnValueOnce('win32');
    await expect(podIpTools.isInDocker()).resolves.toBe(false);
    platformMock.mockRestore();
  });
});

describe('ip', () => {
  test('Synchronized methods return IP addresses', () => {
    const isInKubernetesMock = jest.spyOn(podIpTools, 'isInKubernetesSync').mockReturnValue(true);
    const isInDockerMock = jest.spyOn(podIpTools, 'isInDockerSync').mockReturnValue(true);
    const commandMock = jest.spyOn(execa, 'commandSync').mockReturnValue({
      stdout: 'test-ip',
      stderr: 'error',
    } as unknown as execa.ExecaSyncReturnValue<Buffer>);

    expect(podIpTools.ipSync()).toEqual('test-ip');

    isInKubernetesMock.mockRestore();
    isInDockerMock.mockRestore();
    commandMock.mockRestore();
  });

  test('Asynchronous methods return IP addresses', async () => {
    const isInKubernetesMock = jest.spyOn(podIpTools, 'isInKubernetes').mockResolvedValue(true);
    const isInDockerMock = jest.spyOn(podIpTools, 'isInDocker').mockResolvedValue(true);
    const commandMock = jest.spyOn(execa, 'command').mockResolvedValueOnce({
      stdout: 'test-ip',
      stderr: 'error',
    } as unknown as execa.ExecaReturnValue<Buffer>);

    await expect(podIpTools.ip()).resolves.toEqual('test-ip');

    isInKubernetesMock.mockRestore();
    isInDockerMock.mockRestore();
    commandMock.mockRestore();
  });

  test('Synchronized methods throw errors if they are executed outside container', () => {
    const isInKubernetesMock = jest.spyOn(podIpTools, 'isInKubernetesSync').mockReturnValue(false);
    const isInDockerMock = jest.spyOn(podIpTools, 'isInDockerSync').mockReturnValue(false);
    expect(() => podIpTools.ipSync()).toThrow(new Error('Attempted to call the method from outside docker container or kubernetes pod!'));
    isInKubernetesMock.mockRestore();
    isInDockerMock.mockRestore();
  });

  test('Asynchronous methods throw errors if they are executed outside container', async () => {
    const isInKubernetesMock = jest.spyOn(podIpTools, 'isInKubernetes').mockResolvedValue(false);
    const isInDockerMock = jest.spyOn(podIpTools, 'isInDocker').mockResolvedValue(false);
    await expect(() => podIpTools.ip()).rejects.toEqual(
      new Error('Attempted to call the method from outside docker container or kubernetes pod!')
    );
    isInKubernetesMock.mockRestore();
    isInDockerMock.mockRestore();
  });
});
