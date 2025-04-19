"use server";
/// Library imports
import forge from "node-forge";

export const generateKeyPair = async () => {
  const keyPair = forge.pki.rsa.generateKeyPair(2048);
  const privateKey = forge.pki.privateKeyToPem(keyPair.privateKey);
  const publicKey = forge.ssh.publicKeyToOpenSSH(
    keyPair.publicKey,
    "OrbitSphere"
  );
  return {
    privateKey,
    publicKey,
  };
};
