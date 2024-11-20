export interface ITracker {
  [key: string]: string | number;
  id: number
  title: string
  nominal: string
  type: string
  category: string
  date: string
}

export interface Trackers {
  trackers: ITracker[]
}