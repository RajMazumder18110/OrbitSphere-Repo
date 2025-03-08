/// Types
export type LaunchInstanceParams = {
  region: string;
  sshPublicKey: string;
  instanceType: string;
};
export type RunningInstanceParams = {
  region: string;
  instanceId: string;
};
