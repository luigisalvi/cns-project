export interface Stream {
  id: string,
  name: string,
  description: string,
  ref: string,
  resolutions: [string],
  isLive: boolean
}
