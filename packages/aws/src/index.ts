/** @notice Library imports */
import {
  EC2Client,
  _InstanceType,
  RunInstancesCommand,
  StopInstancesCommand,
  TerminateInstancesCommand,
  type RunInstancesCommandInput,
  type StopInstancesCommandInput,
  type TerminateInstancesCommandInput,
} from "@aws-sdk/client-ec2";
/// Local imports
import {
  AWSImageIds,
  AWSSecurityGroups,
  getCustomSSHKeySetupCommand,
} from "@/utils";
import type { LaunchInstanceParams, RunningInstanceParams } from "@/types";

class OrbitSphereAWSInstance {
  constructor(private accessKeyId: string, private secretAccessKey: string) {}

  public async launch(data: LaunchInstanceParams) {
    /// Initializing instance
    const client = new EC2Client({
      region: data.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
    /// Preparing data
    const params: RunInstancesCommandInput = {
      MinCount: 1,
      MaxCount: 1,
      ImageId: AWSImageIds.UBUNTU,
      SecurityGroupIds: [AWSSecurityGroups.EXPOSE_EVERYTHING],
      UserData: Buffer.from(
        getCustomSSHKeySetupCommand(data.sshPublicKey)
      ).toString("base64"),
      InstanceType: data.instanceType as _InstanceType,
    };

    /// Running instance
    return await client.send(new RunInstancesCommand(params));
  }

  public async terminate(data: RunningInstanceParams) {
    /// Initializing instance
    const client = new EC2Client({
      region: data.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
    /// Preparing data
    const params: TerminateInstancesCommandInput = {
      InstanceIds: [data.instanceId],
    };

    /// Terminating instance
    return await client.send(new TerminateInstancesCommand(params));
  }

  public async stop(data: RunningInstanceParams) {
    /// Initializing instance
    const client = new EC2Client({
      region: data.region,
      credentials: {
        accessKeyId: this.accessKeyId,
        secretAccessKey: this.secretAccessKey,
      },
    });
    /// Preparing data
    const params: StopInstancesCommandInput = {
      InstanceIds: [data.instanceId],
    };

    /// Terminating instance
    return await client.send(new StopInstancesCommand(params));
  }
}

export default OrbitSphereAWSInstance;
