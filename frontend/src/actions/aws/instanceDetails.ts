"use server";
/** @notice Library imports */
import {
  EC2Client,
  DescribeInstanceStatusCommand,
  DescribeInstanceStatusCommandInput,
  InstanceStatus,
} from "@aws-sdk/client-ec2";
/// Local imports
import { AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY } from "@/constants";

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
        accessKeyId: AWS_ACCESS_KEY_ID,
        secretAccessKey: AWS_SECRET_ACCESS_KEY,
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
