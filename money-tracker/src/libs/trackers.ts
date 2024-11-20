import { ITracker, Trackers } from "../types/tracker";

export const totalMoney = (trackersFiltered: ITracker[]) => {
  return trackersFiltered
    .map((item) => Number(item.nominal))
    .reduce((total, num) => total + num)
    .toLocaleString("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
};

export const dateRangeFilter = (
  trackers: Trackers,
  dateMin: Date,
  dateMax: Date,
  type: string
) => {
  return trackers.trackers
    .filter(
      (item) =>
        new Date(item.date).getTime() <= dateMax.getTime() &&
        new Date(item.date).getTime() >= dateMin.getTime()
    )
    .filter((item) => item.type == type);
};

export const categoryFilter = (
  trackers: Trackers,
  category: string,
  type: string
) => {
  return trackers.trackers
    .filter((item) => item.category == category)
    .filter((item) => item.type == type);
};
