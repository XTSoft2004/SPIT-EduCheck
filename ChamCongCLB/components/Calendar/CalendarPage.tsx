'use client'
import React, { useState, useEffect } from 'react'
import { Calendar, Form, message } from 'antd'
import type { Dayjs } from 'dayjs'
import dayjs from 'dayjs'

import EventModal from '@/components/Calendar/Event/EventModal'
import EventList from '@/components/Calendar/Event/EventList'
import { ITimesheet } from '@/types/timesheet'
import { getTimesheets } from '@/actions/timesheet.actions'
import { getClasses } from '@/actions/class.actions'
import { IClass } from '@/types/class'

import CalendarDayView from '@/components/Calendar/CalendarDayView'
import SpinLoading from '../ui/Loading/SpinLoading'
import Tutorial from './Tutorial'

const CalendarPage: React.FC = () => {
  const [events, setEvents] = useState<
    Record<string, { id: number; type: string; content: string }[]>
  >({})
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Dayjs | null>(dayjs())
  const [timesheets, setTimesheets] = useState<ITimesheet[]>([])
  const [classes, setClasses] = useState<IClass[]>([])
  const [selectedEvent, setSelectedEvent] = useState<ITimesheet | null>(null)
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [timesheetRes, classRes] = await Promise.all([
          getTimesheets(),
          getClasses(),
        ])
        if (timesheetRes.ok) setTimesheets(timesheetRes.data)
        if (classRes.ok) setClasses(classRes.data)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  useEffect(() => {
    if (classes.length === 0) return
    const formattedEvents: Record<
      string,
      { id: number; type: string; content: string }[]
    > = {}
    timesheets.forEach(({ id, classId, date, status }) => {
      const dateStr = dayjs(date.toString()).format('DD/MM/YYYY')
      const nameClass =
        classes.find((c) => c.id === classId)?.name || 'Lớp không xác định'
      if (!formattedEvents[dateStr]) {
        formattedEvents[dateStr] = []
      }
      formattedEvents[dateStr].push({ id, type: status, content: nameClass })
    })
    setEvents({ ...formattedEvents })
  }, [timesheets, classes])

  const [calendarDate, setCalendarDate] = useState<Dayjs>(dayjs())

  // Sửa đổi `steps` để bao gồm bước "Chọn ngày điểm danh muốn sửa"
  const [steps, setSteps] = useState([
    {
      title: 'Chọn ngày điểm danh muốn thêm',
      content: 'Vui lòng chọn ngày trên lịch để điểm danh.',
      targetId: 'current-day',
    }
  ])

  return (
    <>
      {loading || classes.length === 0 ? (
        <SpinLoading />
      ) : (
        <>
          <div className="hidden sm:block">
            <Tutorial steps={steps} />
            <Calendar
              value={calendarDate}
              cellRender={(currentDate, info) => {
                const isToday = currentDate.isSame(dayjs(), 'day')

                if (info.type === 'date') {
                  return (
                    <div
                      id={isToday ? 'current-day' : undefined}
                      className={`${isToday ? 'bg-red-500 text-white' : ''}`}
                    >
                      <EventList
                        timesheets={timesheets}
                        value={currentDate}
                        events={events}
                        form={form}
                        setIsModalOpen={setIsModalOpen}
                        setSelectedEvent={setSelectedEvent}
                        setSelectedDate={setSelectedDate}
                      />
                    </div>
                  )
                }
                return info.originNode
              }}
              onSelect={(date, { source }) => {
                if (date.isAfter(dayjs(), 'day')) {
                  message.error('Không thể chọn ngày trước hôm nay')
                  return
                }
                if (source !== 'date') return

                setSelectedDate(date)
                setIsModalOpen(true)
              }}
              onPanelChange={(date) => setCalendarDate(date)}
            />
          </div>

          <div className="sm:hidden">
            <CalendarDayView
              timesheets={timesheets}
              events={events}
              form={form}
              selectedDate={selectedDate}
              setIsModalOpen={setIsModalOpen}
              setSelectedEvent={setSelectedEvent}
              setSelectedDate={setSelectedDate}
              setTimesheets={setTimesheets}
            />
          </div>

          <EventModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            selectedDate={selectedDate}
            selectedEvent={selectedEvent}
            form={form}
            setIsModalOpen={setIsModalOpen}
            setSelectedEvent={setSelectedEvent}
            classes={classes}
            setTimesheets={setTimesheets}
          />
        </>
      )}
    </>
  )
}

export default CalendarPage
