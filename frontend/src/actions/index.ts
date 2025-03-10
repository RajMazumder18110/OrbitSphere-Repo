/// Types
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
