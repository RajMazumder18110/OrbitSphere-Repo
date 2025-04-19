/** @notice library imports */
import { bigint, json, text, timestamp, varchar } from "drizzle-orm/pg-core";

export const timestamps = {
  createdAt: timestamp().notNull().defaultNow(),
  updatedAt: timestamp()
    .notNull()
    .notNull()
    .$onUpdate(() => new Date()),
};

export const blockchainFields = {
  data: text().notNull(),
  transactionHash: varchar({ length: 66 }).notNull(),
  blockNumber: bigint({ mode: "bigint" }).notNull(),
  topics: json().$type<ReadonlyArray<string>>().notNull(),
};
