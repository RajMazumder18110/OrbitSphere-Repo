"use server";
/// Types
export type Instance = {
  id: string;
  instanceId: string;
  region: IRegion;
  instanceType: string;
  publicIp: string;
  privateIp: string;
  rentedOn: Date;
  totalCost: number;
  willBeEndOn: Date;
  sphere: ISphere;
  status: "RUNNING" | "TERMINATED" | "QUEUED";
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

const fakeInstances: Instance[] = [
  {
    id: "1",
    instanceId: "i-0abcd1234efgh5678",
    region: {
      name: "Asia (Mumbai)",
      value: "ap-south-1",
      isEnabled: true,
    },
    instanceType: "t3.micro",
    publicIp: "54.172.98.23",
    privateIp: "172.31.25.10",
    status: "RUNNING",
    rentedOn: new Date("2025-03-10T14:00:00Z"),
    totalCost: 2.88,
    willBeEndOn: new Date("2025-03-16T14:00:00Z"),
    sphere: {
      name: "t2.micro",
      hourlyRate: 0.02, // 0.02 USDT
      noOfCPUs: 1,
      noOfGPUs: 0,
      memoryGBs: 1,
      sGiB: 8,
      isEnabled: true,
    },
  },
  {
    id: "2",
    instanceId: "i-0wxyz6789abcd1234",
    region: {
      name: "US (California)",
      value: "us-west-1",
      isEnabled: true,
    },
    instanceType: "t2.small",
    publicIp: "18.156.74.11",
    privateIp: "10.0.1.25",
    status: "RUNNING",
    rentedOn: new Date("2025-03-09T08:30:00Z"),
    totalCost: 2.16,
    willBeEndOn: new Date("2025-03-12T08:30:00Z"),
    sphere: {
      name: "t2.small",
      hourlyRate: 0.03, // 0.03 USDT
      noOfCPUs: 1,
      noOfGPUs: 0,
      memoryGBs: 2,
      sGiB: 8,
      isEnabled: false,
    },
  },
  {
    id: "3",
    instanceId: "i-0pqr9876stuv5432",
    region: {
      name: "Asia (Mumbai)",
      value: "ap-south-1",
      isEnabled: true,
    },
    instanceType: "t2.medium",
    publicIp: "52.194.88.32",
    privateIp: "192.168.1.15",
    status: "TERMINATED",
    rentedOn: new Date("2025-03-07T10:15:00Z"),
    totalCost: 3.6,
    willBeEndOn: new Date("2025-03-10T10:15:00Z"),
    sphere: {
      name: "t2.medium",
      hourlyRate: 0.05, // 0.05 USDT
      noOfCPUs: 2,
      noOfGPUs: 0,
      memoryGBs: 4,
      sGiB: 8,
      isEnabled: false,
    },
  },
  {
    id: "4",
    instanceId: "i-0wxyz6789abcd1235",
    region: {
      name: "US (California)",
      value: "us-west-1",
      isEnabled: true,
    },
    instanceType: "t2.micro",
    publicIp: "13.186.74.12",
    privateIp: "10.1.1.27",
    status: "RUNNING",
    rentedOn: new Date("2025-03-09T08:30:00Z"),
    totalCost: 21.6,
    willBeEndOn: new Date("2025-04-09T08:30:00Z"),
    sphere: {
      name: "t2.small",
      hourlyRate: 0.03, // 0.03 USDT
      noOfCPUs: 1,
      noOfGPUs: 0,
      memoryGBs: 2,
      sGiB: 8,
      isEnabled: false,
    },
  },

  {
    id: "5",
    instanceId: "i-0wxyz6789abcd1245",
    region: {
      name: "Asia (Mumbai)",
      value: "ap-south-1",
      isEnabled: true,
    },
    instanceType: "t2.micro",
    publicIp: "13.186.74.12",
    privateIp: "10.1.1.27",
    status: "TERMINATED",
    rentedOn: new Date("2025-03-01T08:30:00Z"),
    totalCost: 4.8,
    willBeEndOn: new Date("2025-03-10T08:30:00Z"),
    sphere: {
      name: "t2.micro",
      hourlyRate: 0.02, // 0.02 USDT
      noOfCPUs: 1,
      noOfGPUs: 0,
      memoryGBs: 1,
      sGiB: 8,
      isEnabled: true,
    },
  },
  {
    id: "6",
    instanceId: "i-0abcd1234efgh5679",
    region: {
      name: "Asia (Mumbai)",
      value: "ap-south-1",
      isEnabled: true,
    },
    instanceType: "t3.micro",
    publicIp: "54.172.98.23",
    privateIp: "172.31.25.10",
    status: "QUEUED",
    rentedOn: new Date("2025-03-10T14:00:00Z"),
    totalCost: 2.88,
    willBeEndOn: new Date("2025-03-16T14:00:00Z"),
    sphere: {
      name: "t2.micro",
      hourlyRate: 0.02, // 0.02 USDT
      noOfCPUs: 1,
      noOfGPUs: 0,
      memoryGBs: 1,
      sGiB: 8,
      isEnabled: true,
    },
  },
];

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
    resolve(fakeInstances.find((i) => i.instanceId === id)!)
  );

export const getInstancesBy = async (type: string): Promise<Instance[]> => {
  console.log(type);
  return new Promise((resolve) =>
    resolve(
      fakeInstances.filter(
        (i) => i.status === (type ?? "running").toUpperCase()
      )
    )
  );
};

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
