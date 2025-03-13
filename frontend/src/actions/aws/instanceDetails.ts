"use server";
/** @notice Library imports */
import {
  EC2Client,
  DescribeInstanceStatusCommand,
  DescribeInstanceStatusCommandInput,
  InstanceStatus,
} from "@aws-sdk/client-ec2";

/// Access keys
const accessKeyId = process.env.AWS_ACCESS_KEY_ID!;
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY!;

/// Get instance state
export const getInstanceStatus = async (
  instanceId: string,
  region: string
): Promise<InstanceStatus | undefined> =>
  new Promise((resolve, reject) => {
    /// Client
    const client = new EC2Client({
      region: region,
      credentials: {
        accessKeyId,
        secretAccessKey,
      },
    });

    /// Input
    const params: DescribeInstanceStatusCommandInput = {
      InstanceIds: [instanceId],
    };

    client
      .send(new DescribeInstanceStatusCommand(params))
      .then((response) => {
        const instanceStatus = response.InstanceStatuses?.at(0);
        resolve(instanceStatus);
      })
      .catch((err) => {
        console.log(err);
        reject(err);
      });
  });
