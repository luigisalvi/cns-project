
export interface Stream {
  id: string,
  name: string,
  description: string,
  ref: string,
  resolutions: [string],
  isLive: boolean
}

export interface View {
  streamId: string,
  sessionId: string,
  timestamp: string,
}

export interface StreamAnalytics {
  totalStreamedBytes: number,
  totalStreamedTime: number,
  viewList: View[]
}

export interface MediaLevel {
  _id: number,
  duration: number,
}

export interface SessionAnalytics {
  streamId: string,
  totalStreamedBytes: number,
  totalStreamedTime: number,
  rebufferingEvents: number,
  rebufferingTime: number,
  levels: MediaLevel[],
  screenSizes: string[]
}
