/** @notice Library imports */
import {
  Contract,
  toUtf8String,
  JsonRpcProvider,
  WebSocketProvider,
  type EventLog,
  type ContractEventPayload,
} from "ethers";
/// Local imports
import orbitSphereAbi from "./orbitSphereAbi";
import { OrbitSphereEvents } from "./constants";

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

  public async getLastBlockNumber() {
    return this.orbitSphere.runner?.provider?.getBlockNumber()!;
  }

  public async forceTerminate(sphereId: string) {
    console.log("FORCE TERMINATED", sphereId);
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

  public async filterOrbitSphereInstanceRented({
    fromBlock,
  }: {
    fromBlock: number;
  }) {
    const filteredEvents = await this.orbitSphere.queryFilter(
      OrbitSphereEvents.INSTANCE_RENTED,
      fromBlock,
      "latest"
    );

    const allEvents = filteredEvents.map((e) => {
      /// Extracting blockchain data.
      const { blockNumber, data, topics, transactionHash, args } =
        e as EventLog;
      /// Extracting event data
      const [
        region,
        sphereId,
        instanceType,
        sshPublicKey,
        rentedOn,
        willBeEndOn,
        tenant,
        totalCost,
      ] = args as unknown as [
        string,
        bigint,
        string,
        string,
        bigint,
        bigint,
        string,
        bigint
      ];

      return {
        tenant,
        sphereId,
        rentedOn,
        totalCost,
        willBeEndOn,
        region: fromBytes32(region),
        sshPublicKey: fromBytes(sshPublicKey),
        instanceType: fromBytes32(instanceType),
        /// Blockchain
        data,
        topics,
        transactionHash,
        blockNumber: BigInt(blockNumber),
      };
    });

    return allEvents;
  }

  public async filterOrbitSphereInstanceTerminated({
    fromBlock,
  }: {
    fromBlock: number;
  }) {
    const filteredEvents = await this.orbitSphere.queryFilter(
      OrbitSphereEvents.INSTANCE_TERMINATED,
      fromBlock,
      "latest"
    );

    const allEvents = filteredEvents.map((e) => {
      /// Extracting blockchain data.
      const { blockNumber, data, topics, transactionHash, args } =
        e as EventLog;
      /// Extracting event data
      const [tenant, sphereId, actualCost, timeConsumed, refundAmount] =
        args as unknown as [string, bigint, bigint, bigint, bigint];

      return {
        tenant,
        sphereId,
        actualCost,
        timeConsumed,
        refundAmount,
        /// Blockchain
        data,
        topics,
        transactionHash,
        blockNumber: BigInt(blockNumber),
      };
    });

    return allEvents;
  }
}

const fromBytes32 = (value: string) => {
  const data = toUtf8String(value);
  return data.substring(0, data.indexOf("\u0000"));
};

const fromBytes = (value: string) => toUtf8String(value);

/** @notice Exports */
export {
  OrbitSphere,
  OrbitSphereEvents,
  orbitSphereAbi,
  fromBytes32,
  fromBytes,
};
