/** @notice Library imports */
import amqplib, { type Channel, type ChannelModel } from "amqplib";
/// Local imports
import { Exchanges, ExchangeRoutes, Queues } from "@/constants";

export class OrbitSphereExchange {
  protected connection: ChannelModel | undefined;
  protected channel: Channel | undefined;

  public async initialize(connectionUrl: string) {
    /// Initialize connection
    this.connection = await amqplib.connect(connectionUrl);
    this.channel = await this.connection.createChannel();

    /// Creating exchange
    await this.channel.assertExchange(Exchanges.OrbitSphereExchange, "direct", {
      durable: true,
    });
    /// Creating queues
    await this.channel.assertQueue(Queues.RENTAL_QUEUE, { durable: true });
    await this.channel.assertQueue(Queues.TERMINATION_QUEUE, { durable: true });

    /// Creating routes
    await this.channel.bindQueue(
      Queues.RENTAL_QUEUE,
      Exchanges.OrbitSphereExchange,
      ExchangeRoutes.TO_RENTAL_QUEUE
    );
    await this.channel.bindQueue(
      Queues.TERMINATION_QUEUE,
      Exchanges.OrbitSphereExchange,
      ExchangeRoutes.TO_TERMINATION_QUEUE
    );
  }
}
