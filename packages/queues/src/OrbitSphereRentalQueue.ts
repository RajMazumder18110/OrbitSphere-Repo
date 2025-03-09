/** @notice Library imports */
/// Local imports
import { OrbitSphereExchange } from "./OrbitSphereExchange";
import { Exchanges, ExchangeRoutes, Queues } from "@/constants";

/// Interface
type RentalPayload = {
  region: string;
  tenant: string;
  sphereId: string;
  instanceType: string;
  sshPublicKey: string;
};

export class OrbitSphereRentalQueue extends OrbitSphereExchange {
  public async publish(data: RentalPayload) {
    this.channel!.publish(
      Exchanges.OrbitSphereExchange,
      ExchangeRoutes.TO_RENTAL_QUEUE,
      Buffer.from(JSON.stringify(data))
    );
  }

  public async consume(handler: (data: RentalPayload) => Promise<void>) {
    await this.channel!.consume(Queues.RENTAL_QUEUE, async (msg) => {
      if (!msg) return;
      await handler(JSON.parse(msg.content.toString()));
      this.channel!.ack(msg);
    });
  }
}
