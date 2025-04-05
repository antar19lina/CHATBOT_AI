"use client"

import { useEffect, useRef } from "react"

export default function BackgroundShapes() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Create shapes
    const shapes: Shape[] = []
    const shapeTypes = ["circle", "triangle", "square"]
    const colors = [
      "rgba(59, 130, 246, 0.2)",
      "rgba(99, 102, 241, 0.2)",
      "rgba(139, 92, 246, 0.2)",
      "rgba(14, 165, 233, 0.2)",
    ]

    for (let i = 0; i < 30; i++) {
      const type = shapeTypes[Math.floor(Math.random() * shapeTypes.length)]
      const color = colors[Math.floor(Math.random() * colors.length)]
      const size = Math.random() * 40 + 10
      const x = Math.random() * canvas.width
      const y = Math.random() * canvas.height
      const speedX = (Math.random() - 0.5) * 0.5
      const speedY = (Math.random() - 0.5) * 0.5
      const rotation = Math.random() * Math.PI * 2
      const rotationSpeed = (Math.random() - 0.5) * 0.01

      shapes.push({
        type,
        color,
        size,
        x,
        y,
        speedX,
        speedY,
        rotation,
        rotationSpeed,
      })
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      shapes.forEach((shape) => {
        // Update position
        shape.x += shape.speedX
        shape.y += shape.speedY
        shape.rotation += shape.rotationSpeed

        // Boundary check
        if (shape.x < -shape.size) shape.x = canvas.width + shape.size
        if (shape.x > canvas.width + shape.size) shape.x = -shape.size
        if (shape.y < -shape.size) shape.y = canvas.height + shape.size
        if (shape.y > canvas.height + shape.size) shape.y = -shape.size

        // Draw shape
        ctx.save()
        ctx.translate(shape.x, shape.y)
        ctx.rotate(shape.rotation)
        ctx.fillStyle = shape.color

        if (shape.type === "circle") {
          ctx.beginPath()
          ctx.arc(0, 0, shape.size / 2, 0, Math.PI * 2)
          ctx.fill()
        } else if (shape.type === "triangle") {
          ctx.beginPath()
          ctx.moveTo(0, -shape.size / 2)
          ctx.lineTo(shape.size / 2, shape.size / 2)
          ctx.lineTo(-shape.size / 2, shape.size / 2)
          ctx.closePath()
          ctx.fill()
        } else if (shape.type === "square") {
          ctx.fillRect(-shape.size / 2, -shape.size / 2, shape.size, shape.size)
        }

        ctx.restore()
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full pointer-events-none z-0" />
}

type Shape = {
  type: string
  color: string
  size: number
  x: number
  y: number
  speedX: number
  speedY: number
  rotation: number
  rotationSpeed: number
}

