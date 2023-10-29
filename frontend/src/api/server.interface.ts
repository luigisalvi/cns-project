//Here there is a list of interfaces which defines the expexted structure
//for each structured variables used in the whole project.
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
  _id?: number,
  resolution: string,
  bandwidth: number,
  level: number,
  media: string,
  totalStreamedTime?: number,
  '%totalStreamedTime'?: number
}

export interface ScreenSize {
  _id?: number,
  size: {width: number, height: number},
  totalStreamedTime?: number,
  '%totalStreamedTime'?: number
}

export interface SessionAnalytics {
  _id: string,
  sessionId: string,
  clientIp: string,
  userAgent: string,
  totalStreamedBytes: number,
  totalStreamedTime: number,
  bufferingEvents: number,
  bufferingTime: number,
  mediaLevels: MediaLevel[],
  downloadRate: number,
  bandwidth: number,
  screenSizes: ScreenSize[]
}

export interface Session {
  sessionId: string,
}
