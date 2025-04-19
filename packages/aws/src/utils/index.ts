export const enum AWSImageIds {
  UBUNTU = "ami-00bb6a80f01f03502",
  AMAZON_LINUX = "ami-05c179eced2eb9b5b",
}

export const enum AWSSecurityGroups {
  EXPOSE_EVERYTHING = "sg-0fbd003f43aa2fe72",
}

export const getCustomSSHKeySetupCommand = (sshKey: string) => {
  const script = `#!/bin/bash
        mkdir -p /home/ubuntu/.ssh
        echo "${sshKey}" >> /home/ubuntu/.ssh/authorized_keys
        chmod 600 /home/ubuntu/.ssh/authorized_keys
        chown ubuntu:ubuntu /home/ubuntu/.ssh/authorized_keys
    `;
  return script;
};
