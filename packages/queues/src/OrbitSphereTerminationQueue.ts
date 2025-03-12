/** @notice Library imports */
/// Local imports
import { OrbitSphereExchange } from "./OrbitSphereExchange";
import { Exchanges, ExchangeRoutes, Queues } from "@/constants";

/// Interface
type TerminatePayload = {
  region: string;
  instanceId: string;
  actualCost: string;
  timeConsumed: string;
  refundAmount: string;
};

export class OrbitSphereTerminationQueue extends OrbitSphereExchange {
  public async publish(data: TerminatePayload) {
    this.channel!.publish(
      Exchanges.OrbitSphereExchange,
      ExchangeRoutes.TO_TERMINATION_QUEUE,
      Buffer.from(JSON.stringify(data))
    );
  }

  public async consume(handler: (data: TerminatePayload) => Promise<void>) {
    await this.channel!.consume(Queues.TERMINATION_QUEUE, async (msg) => {
      if (!msg) return;
      await handler(JSON.parse(msg.content.toString()));
      this.channel!.ack(msg);
    });
  }
}
