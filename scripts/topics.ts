import { Kafka } from "kafkajs";
import { OrbitSphereTopics } from "../packages/broker/src/constants";

const kafka = new Kafka({
  clientId: "Seeder",
  brokers: [process.env.KAFKA_CONNECTION_URL!],
});

const admin = kafka.admin();
await admin.connect();

await admin.createTopics({
  topics: [
    {
      numPartitions: 5,
      topic: OrbitSphereTopics.RENTAL_EVENT,
    },
    {
      numPartitions: 5,
      topic: OrbitSphereTopics.TERMINATION_EVENT,
    },
  ],
});

await admin.disconnect();
