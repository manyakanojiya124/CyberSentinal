'use client'

import {
  Children,
  HTMLAttributes,
  ReactNode,
  useLayoutEffect,
  useRef,
  useState,
} from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useTheme } from 'next-themes'

interface StepperProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  initialStep?: number
  onStepChange?: (step: number) => void
  onFinalStepCompleted?: () => void
  backButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  nextButtonProps?: React.ButtonHTMLAttributes<HTMLButtonElement>
  backButtonText?: string
  nextButtonText?: string
  disableStepIndicators?: boolean
}

export default function Stepper({
  children,
  initialStep = 1,
  onStepChange = () => {},
  onFinalStepCompleted = () => {},
  backButtonProps = {},
  nextButtonProps = {},
  backButtonText = 'Back',
  nextButtonText = 'Next',
  disableStepIndicators = false,
  ...rest
}: StepperProps) {
  const [currentStep, setCurrentStep] = useState(initialStep)
  const [direction, setDirection] = useState(0)
  const steps = Children.toArray(children)
  const totalSteps = steps.length
  const isLastStep = currentStep === totalSteps
  const isCompleted = currentStep > totalSteps
  const { resolvedTheme } = useTheme()

  const updateStep = (step: number) => {
    setCurrentStep(step)
    if (step > totalSteps) onFinalStepCompleted()
    else onStepChange(step)
  }

  const goNext = () => {
    if (!isLastStep) {
      setDirection(1)
      updateStep(currentStep + 1)
    }
  }

  const goBack = () => {
    if (currentStep > 1) {
      setDirection(-1)
      updateStep(currentStep - 1)
    }
  }

  return (
    <div className="w-full flex flex-col items-center justify-center" {...rest}>
      <div
        className={`w-full border rounded-xl ${
          resolvedTheme === 'dark'
            ? 'bg-black border-neon-purple'
            : 'bg-white border-gray-300'
        }`}
      >
        {/* Step indicators */}
        <div className="flex items-center justify-between px-6 py-5">
          {steps.map((_, index) => {
            const stepNum = index + 1
            const isActive = stepNum === currentStep
            const isCompleted = stepNum < currentStep
            return (
              <div key={stepNum} className="flex items-center gap-2">
                <motion.div
                  className={`rounded-full w-9 h-9 flex items-center justify-center font-bold text-sm transition-all ${
                    isActive
                      ? 'bg-neon-purple text-white shadow-[0_0_12px_4px_rgba(194,122,255,0.4)]'
                      : isCompleted
                      ? 'bg-green-500 text-white'
                      : resolvedTheme === 'dark'
                      ? 'bg-purple-800 text-white border border-gray-600'
                      : 'bg-gray-200 text-black'
                  }`}
                >
                  {isCompleted ? '✓' : stepNum}
                </motion.div>
                {index !== steps.length - 1 && (
                  <div
                    className={`h-1 transition-all ${
                      currentStep > stepNum
                        ? 'bg-neon-purple'
                        : 'bg-purple-500/40'
                    }`}
                    style={{ width: '53px' }}
                  />
                )}
              </div>
            )
          })}
        </div>

        <StepContentWrapper
          currentStep={currentStep}
          direction={direction}
          isCompleted={isCompleted}
        >
          {steps[currentStep - 1]}
        </StepContentWrapper>

        {!isCompleted && (
          <div className="flex justify-between px-6 py-4">
            {currentStep !== 1 ? (
              <button
                className="text-gray-400 hover:text-gray-200 transition"
                onClick={goBack}
                {...backButtonProps}
              >
                {backButtonText}
              </button>
            ) : (
              <span />
            )}

            <button
              className="bg-neon-purple hover:bg-purple-500 transition px-5 py-2 rounded-md font-semibold text-black dark:text-white"
              onClick={isLastStep ? () => updateStep(totalSteps + 1) : goNext}
              {...nextButtonProps}
            >
              {isLastStep ? 'Register' : nextButtonText}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export function Step({ children }: { children: ReactNode }) {
  return <div className="w-full py-4">{children}</div>
}

function StepContentWrapper({
  currentStep,
  direction,
  isCompleted,
  children,
}: {
  currentStep: number
  direction: number
  isCompleted: boolean
  children: ReactNode
}) {
  const [height, setHeight] = useState(0)
  const contentRef = useRef<HTMLDivElement | null>(null)

  useLayoutEffect(() => {
    if (contentRef.current) setHeight(contentRef.current.offsetHeight)
  }, [currentStep])

  return (
    <motion.div
      animate={{ height: isCompleted ? 0 : height }}
      transition={{ type: 'spring', duration: 0.5 }}
      className="relative overflow-hidden px-6"
    >
      <AnimatePresence initial={false} mode="sync" custom={direction}>
        {!isCompleted && (
          <motion.div
            ref={contentRef}
            key={currentStep}
            initial={{ x: direction > 0 ? '100%' : '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: direction > 0 ? '-50%' : '50%', opacity: 0 }}
            transition={{ duration: 0.4 }}
            className="absolute left-0 right-0"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
