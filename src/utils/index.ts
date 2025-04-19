export const getCustomSSHKeySetupCommand = (sshKey: string) => {
  const script = `#!/bin/bash
          mkdir -p /home/ubuntu/.ssh
          echo "${sshKey}" >> /home/ubuntu/.ssh/authorized_keys
          chmod 600 /home/ubuntu/.ssh/authorized_keys
          chown ubuntu:ubuntu /home/ubuntu/.ssh/authorized_keys
      `;
  return script;
};
