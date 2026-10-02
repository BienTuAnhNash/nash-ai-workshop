import type { CreateScheduleDto, Schedule } from '@/types/schedule'
import type { PaginationResponse } from '@/types/response'
import { sleep } from '@/libs/utils'

import { axiosClient } from '../libs/axios'

const SCHEDULES_BASE_URL = '/schedules'

export const schedulesService = {
  async getAll(page = 1, limit = 10): Promise<PaginationResponse<Schedule>> {
    const response = await axiosClient.get<PaginationResponse<Schedule>>(
      SCHEDULES_BASE_URL,
      {
        params: {
          page,
          limit,
        },
      },
    )
    return response.data
  },

  async getById(id: string) {
    const response = await axiosClient.get<Schedule>(
      `${SCHEDULES_BASE_URL}/${id}`,
    )
    return response.data
  },

  async createSchedule(payload: CreateScheduleDto) {
    const response = await axiosClient.post(SCHEDULES_BASE_URL, payload)
    // TODO: Remove this after implementing the actual backend logic
    await sleep(3000)
    return response.data
  },

  async deleteSchedule(id: string) {
    const response = await axiosClient.delete(`${SCHEDULES_BASE_URL}/${id}`)
    return response.data
  },

  async pauseSchedule(id: string) {
    const response = await axiosClient.patch(
      `${SCHEDULES_BASE_URL}/${id}/pause`,
    )
    return response.data
  },

  async cancelSchedule(id: string) {
    const response = await axiosClient.patch(
      `${SCHEDULES_BASE_URL}/${id}/cancel`,
    )
    return response.data
  },
}
