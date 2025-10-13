export interface Login {
  token: string
  username: string
  name: string
  pswNeedChange: boolean
  status: string
  departmentId: number
  departmentName: string
  email: string
  phone: string
  mobile: string
  position: string
}

export interface RefreshToken {
  token: string
  refreshToken: string
}
