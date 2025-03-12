/** @notice Library imports */
import {
  Contract,
  toUtf8String,
  JsonRpcProvider,
  WebSocketProvider,
  type ContractEventPayload,
} from "ethers";
/// Local imports
import orbitSphereAbi from "@/orbitSphereAbi";
import { OrbitSphereEvents } from "@/constants";

class OrbitSphere {
  private orbitSphere: Contract;

  constructor(target: string, rpcOrWsUrl: string) {
    /// Creating provider
    let provider: JsonRpcProvider | WebSocketProvider;
    if (rpcOrWsUrl.startsWith("http")) {
      provider = new JsonRpcProvider(rpcOrWsUrl);
    } else {
      provider = new WebSocketProvider(rpcOrWsUrl);
    }
    /// Initializing contract
    this.orbitSphere = new Contract(target, orbitSphereAbi, provider);
  }

  public onOrbitSphereInstanceRented(
    listener: (
      region: string,
      sphereId: bigint,
      instanceType: string,
      sshPublicKey: string,
      rentedOn: bigint,
      willBeEndOn: bigint,
      tenant: string,
      totalCost: bigint,
      payload: ContractEventPayload
    ) => Promise<void>
  ) {
    return this.orbitSphere.on(OrbitSphereEvents.INSTANCE_RENTED, listener);
  }

  public onOrbitSphereInstanceTerminated(
    listener: (
      tenant: string,
      sphereId: bigint,
      actualCost: bigint,
      timeConsumed: bigint,
      refundAmount: bigint,
      payload: ContractEventPayload
    ) => Promise<void>
  ) {
    return this.orbitSphere.on(OrbitSphereEvents.INSTANCE_TERMINATED, listener);
  }
}

const fromBytes32 = (value: string) => {
  const data = toUtf8String(value);
  return data.substring(0, data.indexOf("\u0000"));
};

const fromBytes = (value: string) => toUtf8String(value);

/** @notice Exports */
export { OrbitSphere, orbitSphereAbi, fromBytes32, fromBytes };
