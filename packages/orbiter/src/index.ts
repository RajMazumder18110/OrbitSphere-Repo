/** @notice Library imports */
import {
  Contract,
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

/** @notice Exports */
export { OrbitSphere, orbitSphereAbi };
