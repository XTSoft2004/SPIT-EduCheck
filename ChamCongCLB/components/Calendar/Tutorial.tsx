import { useEffect, useState } from 'react'
import { Button } from 'antd'
import {
  ArrowLeftOutlined,
  ArrowRightOutlined,
  CloseOutlined,
  QuestionCircleOutlined,
} from '@ant-design/icons'

interface Step {
  title: string
  content: string
  targetId: string
}

interface TutorialProps {
  steps: Step[]
}

export default function Tutorial({ steps }: TutorialProps) {
  const [current, setCurrent] = useState<number | null>(null)
  const [rect, setRect] = useState<DOMRect | null>(null)

  useEffect(() => {
    if (current !== null) {
      const target = document.getElementById(steps[current]?.targetId)
      if (target) setRect(target.getBoundingClientRect())
    }
  }, [current, steps])

  const handleNext = () => {
    if (current !== null && current < steps.length - 1) setCurrent(current + 1)
  }

  const handlePrev = () => {
    if (current !== null && current > 0) setCurrent(current - 1)
  }

  const handleClose = () => setCurrent(null)

  const currentStep = current !== null ? steps[current] : null
  const overlayWidth = 256
  const overlayHeight = 180

  let top = rect ? rect.top + rect.height + 10 + window.scrollY : 0
  let left = rect ? rect.left + window.scrollX : 0

  if (rect) {
    if (left + overlayWidth > window.innerWidth) {
      left = window.innerWidth - overlayWidth - 10
    }
    if (top + overlayHeight > window.innerHeight + window.scrollY) {
      top = rect.top - overlayHeight - 10 + window.scrollY
    }
    if (top < 0) top = 10
    if (left < 0) left = 10
  }

  return (
    <>
      <Button
        shape="circle"
        icon={<QuestionCircleOutlined />}
        onClick={() => setCurrent(0)}
        className="fixed bottom-4 right-4 z-50 text-blue-600 dark:text-blue-400 text-2xl"
      />

      {currentStep && rect && (
        <div
          className="fixed z-50 bg-white dark:bg-zinc-800 text-black dark:text-white shadow-lg p-4 rounded-lg w-64 border dark:border-zinc-600"
          style={{ top, left }}
        >
          {/* Nút X đóng ở góc trên bên phải */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-red-500"
          >
            <CloseOutlined />
          </button>

          <div className="font-semibold mb-2 pr-6">{currentStep.title}</div>
          <div className="mb-4">{currentStep.content}</div>
          <div className="flex justify-between">
            <Button
              onClick={handlePrev}
              disabled={current === 0}
              icon={<ArrowLeftOutlined />}
            >
              Trước
            </Button>
            {current === steps.length - 1 ? (
              <Button onClick={handleClose} icon={<CloseOutlined />}>
                Đóng
              </Button>
            ) : (
              <Button onClick={handleNext} icon={<ArrowRightOutlined />}>
                Tiếp
              </Button>
            )}
          </div>
        </div>
      )}
    </>
  )
}
