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

export interface SessionAnalytics {
  streamId: string,
  totalStreamedBytes: number,
  totalStreamedTime: number,
  bufferingEvents: number,
  bufferingTime: number,
  levels: MediaLevel[],
  screenSizes: string[]
  //NON DOVREMMO INCLUDERE?
  //bandwidth: number
  //downloadRate: number
}

export interface Session {
  sessionId: string,
}
