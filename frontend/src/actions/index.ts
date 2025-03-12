"use server";

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
