/** @notice Library imports */
import { Kafka, type Producer } from "kafkajs";
/// Local imports
import {
  type RentalEventPayload,
  type IRentalMessageProducer,
} from "../../interfaces";
import { OrbitSphereTopics } from "../../constants";

export class RentalMessageProducer implements IRentalMessageProducer {
  /// Holders
  private producer: Producer;

  constructor(clientId: string, brokers: string[]) {
    /// Initializing Kafka instance
    const kafka = new Kafka({
      clientId,
      brokers,
    });
    /// Other initializers
    this.producer = kafka.producer();
  }

  public async connect() {
    await this.producer.connect();
  }

  public async disconnect() {
    await this.producer.disconnect();
  }

  public async publish(data: RentalEventPayload): Promise<void> {
    await this.producer.send({
      topic: OrbitSphereTopics.RENTAL_EVENT,
      messages: [
        {
          value: JSON.stringify(data),
        },
      ],
    });
  }

  public async bulkPublish(data: RentalEventPayload[]): Promise<void> {
    await this.producer.send({
      topic: OrbitSphereTopics.RENTAL_EVENT,
      messages: data.map((d) => ({
        value: JSON.stringify(d),
      })),
    });
  }
}
