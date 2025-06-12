'use client'

import { Suspense, lazy } from 'react'
const Spline = lazy(() => import('@splinetool/react-spline'))

interface SplineSceneProps {
  scene: string
  className?: string
}

export function SplineScene({ scene, className }: SplineSceneProps) {
  return (
    <div className="spline-container w-full h-full pointer-events-auto relative z-1">
      <Suspense 
        fallback={
          <div className="w-full h-full flex items-center justify-center pointer-events-none">
            <span className="loader"></span>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={`${className} pointer-events-auto`}
          style={{ pointerEvents: 'auto', position: 'relative', zIndex: 1 }}
        />
      </Suspense>
    </div>
  )
}