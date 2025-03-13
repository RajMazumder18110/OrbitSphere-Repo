/** @notice Library imports */
import { Kafka, type Consumer } from "kafkajs";
/// Local imports
import {
  type TerminateEventPayload,
  type ITerminateMessageConsumer,
} from "@/interfaces";
import { OrbitSphereTopics } from "@/constants";

export class TerminationMessageConsumer implements ITerminateMessageConsumer {
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
      topics: [OrbitSphereTopics.TERMINATION_EVENT],
      fromBeginning: true,
    });
  }

  public async disconnect() {
    await this.consumer.disconnect();
  }

  public async consume(
    handler: (payload: TerminateEventPayload) => Promise<void>
  ): Promise<void> {
    await this.consumer.run({
      eachMessage: async ({ message }) => {
        const parsedPayload: TerminateEventPayload = JSON.parse(
          message.value!.toString()
        );
        await handler(parsedPayload);
      },
    });
  }
}
