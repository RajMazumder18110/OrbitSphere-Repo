/** @notice Library imports */
import {
  EC2Client,
  _InstanceType,
  RunInstancesCommand,
  StopInstancesCommand,
  DescribeInstancesCommand,
  TerminateInstancesCommand,
  DescribeInstanceStatusCommand,
  type Instance,
  type InstanceStatus,
  type RunInstancesCommandInput,
  type StopInstancesCommandInput,
  type StopInstancesCommandOutput,
  type TerminateInstancesCommandInput,
  type TerminateInstancesCommandOutput,
  type DescribeInstanceStatusCommandInput,
} from "@aws-sdk/client-ec2";
/// Local imports
import {
  AWSImageIds,
  AWSSecurityGroups,
  getCustomSSHKeySetupCommand,
} from "./utils";
import type { LaunchInstanceParams, RunningInstanceParams } from "./types";
export * from "./types";

export class OrbitSphereAWSInstance {
  constructor(private accessKeyId: string, private secretAccessKey: string) {}

  public async getInstanceStatus(
    data: RunningInstanceParams
  ): Promise<InstanceStatus | undefined> {
    return new Promise((resolve, reject) => {
      /// Initializing instance
      const client = new EC2Client({
        region: data.region,
        credentials: {
          accessKeyId: this.accessKeyId,
          secretAccessKey: this.secretAccessKey,
        },
      });

      /// Input
      const params: DescribeInstanceStatusCommandInput = {
        InstanceIds: [data.instanceId],
      };

      client
        .send(new DescribeInstanceStatusCommand(params))
        .then((response) => {
          const instanceStatus = response.InstanceStatuses?.at(0);
          resolve(instanceStatus);
        })
        .catch((err) => {
          reject(err);
        });
    });
  }

  public async launch(data: LaunchInstanceParams): Promise<Instance> {
    return new Promise((resolve, reject) => {
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
      client
        .send(new RunInstancesCommand(params))
        .then((response) => {
          const instanceId = response.Instances?.at(0)?.InstanceId!;
          if (!instanceId) reject(new Error("Unable to run instance!"));
          /// Wait for deployment.
          return this.wait(client, instanceId);
        })
        .then((instance) => {
          resolve(instance);
        })
        .catch((err) => reject(err));
    });
  }

  public async terminate(
    data: RunningInstanceParams
  ): Promise<TerminateInstancesCommandOutput> {
    return new Promise((resolve, reject) => {
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
      client
        .send(new TerminateInstancesCommand(params))
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  }

  public async stop(
    data: RunningInstanceParams
  ): Promise<StopInstancesCommandOutput> {
    return new Promise((resolve, reject) => {
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

      client
        .send(new StopInstancesCommand(params))
        .then((response) => {
          resolve(response);
        })
        .catch((err) => reject(err));
    });
  }

  /// PRIVATE
  private async wait(client: EC2Client, instanceId: string): Promise<Instance> {
    return new Promise(async (resolve, reject) => {
      while (true) {
        const describeCommand = new DescribeInstancesCommand({
          InstanceIds: [instanceId],
        });

        try {
          const describeResponse = await client.send(describeCommand);
          const instance =
            describeResponse.Reservations?.at(0)?.Instances?.at(0);
          const publicIp = instance?.PublicIpAddress;

          if (publicIp) {
            return resolve(instance);
          }
        } catch (error) {
          return reject(error);
        }

        // Wait 10 seconds before retrying
        await new Promise((res) => setTimeout(res, 10000));
      }
    });
  }
}
