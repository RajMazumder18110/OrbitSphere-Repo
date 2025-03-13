/** @notice Interfaces */
export type RentalEventPayload = {
  region: string;
  tenant: string;
  sphereId: string;
  instanceType: string;
  sshPublicKey: string;
  totalCost: string;
  rentedOn: string;
  willBeEndOn: string;
};

export type TerminateEventPayload = {
  region: string;
  instanceId: string;
  actualCost: string;
  timeConsumed: string;
  refundAmount: string;
};

/// Rental Producer
export interface IRentalMessageProducer {
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /// Produce
  publish: (data: RentalEventPayload) => Promise<void>;
  bulkPublish: (data: RentalEventPayload[]) => Promise<void>;
}

/// Rental Consumer
export interface IRentalMessageConsumer {
  /// Core
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /// Consume
  consume: (
    handler: (payload: RentalEventPayload) => Promise<void>
  ) => Promise<void>;
}

/// Terminator Broker
export interface ITerminateMessageProducer {
  /// Core
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /// Produce
  publish: (data: TerminateEventPayload) => Promise<void>;
  bulkPublish: (data: TerminateEventPayload[]) => Promise<void>;
}

/// Terminator Broker
export interface ITerminateMessageConsumer {
  /// Core
  connect: () => Promise<void>;
  disconnect: () => Promise<void>;
  /// Consume
  consume: (
    handler: (payload: TerminateEventPayload) => Promise<void>
  ) => Promise<void>;
}
