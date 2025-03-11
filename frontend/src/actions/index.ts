"use server";
import { toHex } from "viem";

/// Types
export type Instance = {
  id: string;
  instanceId: string;
  region: string;
  instanceType: string;
  status: "RUNNING" | "TERMINATED";
};

export interface IRegion {
  name: string;
  value: string;
  isEnabled: boolean;
}

export interface ISphere {
  name: string;
  hourlyRate: number;
  noOfCPUs: number;
  noOfGPUs: number;
  memoryGBs: number;
  sGiB: number;
  isEnabled: boolean;
}

export interface UtilizationData {
  time: string;
  percentCpu: number;
  percentMem: number;
}

export const getUtilizationData = async (): Promise<UtilizationData[]> =>
  new Promise((resolve) =>
    resolve([
      { time: "10:00", percentCpu: 10, percentMem: 10 },
      { time: "10:05", percentCpu: 35, percentMem: 10 },
      { time: "10:10", percentCpu: 37, percentMem: 10 },
      { time: "10:15", percentCpu: 73, percentMem: 10 },
      { time: "10:20", percentCpu: 65, percentMem: 10 },
      { time: "10:25", percentCpu: 73, percentMem: 10 },
      { time: "10:30", percentCpu: 73, percentMem: 10 },
    ])
  );

export const getInstancesById = async (id: string): Promise<Instance> =>
  new Promise((resolve) =>
    resolve({
      id: "1",
      instanceId: id,
      region: "Mumbai",
      instanceType: "t2.micro",
      status: "TERMINATED",
    })
  );

export const getInstancesBy = async (type: string): Promise<Instance[]> =>
  new Promise((resolve) => {
    const runningInstances = Array.from({ length: 9 }).map((_, i) => ({
      id: i.toString(),
      instanceId: "i-0b22a22eec53b9321" + i,
      region: "Mumbai",
      instanceType: "t2.micro",
      status: "RUNNING",
    }));

    const terminatedInstances = Array.from({ length: 7 }).map((_, i) => ({
      id: i.toString(),
      instanceId: "i-0b22a22eec53b9321",
      region: "Mumbai",
      instanceType: "t2.micro",
      status: "TERMINATED",
    }));

    const instances = runningInstances.concat(terminatedInstances);

    resolve(
      instances.filter(
        (i) => i.status === (type ?? "running").toUpperCase()
      ) as Instance[]
    );
  });

// Actions
export const getAllActiveRegions = async (): Promise<IRegion[]> =>
  new Promise((resolve) =>
    resolve([
      {
        name: "Asia (Mumbai)",
        value: "ap-south-1",
        isEnabled: true,
      },
      {
        name: "US (California)",
        value: "us-west-1",
        isEnabled: true,
      },
    ])
  );

export const getAllActiveSpheres = async (): Promise<ISphere[]> =>
  new Promise((resolve) =>
    resolve([
      {
        name: "t2.micro",
        hourlyRate: 0.02, // 0.02 USDT
        noOfCPUs: 1,
        noOfGPUs: 0,
        memoryGBs: 1,
        sGiB: 8,
        isEnabled: true,
      },
      {
        name: "t2.small",
        hourlyRate: 0.03, // 0.03 USDT
        noOfCPUs: 1,
        noOfGPUs: 0,
        memoryGBs: 2,
        sGiB: 8,
        isEnabled: false,
      },
      {
        name: "t2.medium",
        hourlyRate: 0.05, // 0.05 USDT
        noOfCPUs: 2,
        noOfGPUs: 0,
        memoryGBs: 4,
        sGiB: 8,
        isEnabled: false,
      },
      {
        name: "t2.large",
        hourlyRate: 0.12, // 0.12 USDT
        noOfCPUs: 2,
        noOfGPUs: 0,
        memoryGBs: 8,
        sGiB: 8,
        isEnabled: false,
      },
      {
        name: "t2.xlarge",
        hourlyRate: 0.22, /// 0.22 USDT
        noOfCPUs: 4,
        noOfGPUs: 0,
        memoryGBs: 16,
        sGiB: 8,
        isEnabled: false,
      },
    ])
  );
