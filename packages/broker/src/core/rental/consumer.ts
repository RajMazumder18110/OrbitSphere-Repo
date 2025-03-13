/** @notice Library imports */
import { Kafka, type Consumer } from "kafkajs";
/// Local imports
import {
  type RentalEventPayload,
  type IRentalMessageConsumer,
} from "@/interfaces";
import { OrbitSphereTopics } from "@/constants";

export class RentalMessageConsumer implements IRentalMessageConsumer {
  /// Holders
  private consumer: Consumer;

  constructor(clientId: string, brokers: string[], groupId: string) {
    /// Initializing Kafka instance
    const kafka = new Kafka({
      clientId,
      brokers,
    });
    /// Other initializers
    this.consumer = kafka.consumer({
      groupId,
    });
  }

  public async connect() {
    await this.consumer.connect();
    await this.consumer.subscribe({
      topics: [OrbitSphereTopics.RENTAL_EVENT],
      fromBeginning: true,
    });
  }

  public async disconnect() {
    await this.consumer.disconnect();
  }

  public async consume(
    handler: (payload: RentalEventPayload) => Promise<void>
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const parsedPayload: RentalEventPayload = JSON.parse(
          message.value!.toString()
        );
        await handler(parsedPayload);
      },
    });
  }
}
