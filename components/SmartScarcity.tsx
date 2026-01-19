"use client"

import { useEffect, useState, useRef } from "react"
import * as tf from "@tensorflow/tfjs"

const getScrollPercent = () => {
  const scrollTop = window.scrollY
  const docHeight = document.body.scrollHeight - window.innerHeight
  return docHeight > 0 ? scrollTop / docHeight : 0
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
}

export default function SmartScarcity() {
  const [model, setModel] = useState<tf.LayersModel | null>(null)
  const [showScarcity, setShowScarcity] = useState(false)
  const [secondsLeft, setSecondsLeft] = useState(15 * 60)

  const startTimeRef = useRef(Date.now())
  const clicksRef = useRef(0)
  const lastProbabilityRef = useRef(0)

  // 🖱️ Click tracker
  useEffect(() => {
    const handleClick = () => clicksRef.current++
    window.addEventListener("click", handleClick)
    return () => window.removeEventListener("click", handleClick)
  }, [])

  // ⏱️ Countdown
  useEffect(() => {
    if (!showScarcity) return
    const timer = setInterval(() => {
      setSecondsLeft(s => (s > 0 ? s - 1 : 0))
    }, 1000)
    return () => clearInterval(timer)
  }, [showScarcity])

  // 📦 Load model
  useEffect(() => {
    tf.loadLayersModel("/scarcity/model/model.json")
      .then(m => {
        console.log("✅ Modelo cargado correctamente")
        setModel(m)
      })
      .catch(console.error)
  }, [])

  // 🔔 Solicitar permiso para notificaciones
  useEffect(() => {
    if ("Notification" in window && Notification.permission === "default") {
      Notification.requestPermission()
    }
  }, [])

  // 🧠 Re-evaluación continua
  useEffect(() => {
    if (!model || showScarcity) return

    const evaluateUser = async () => {
      const timeOnPage = (Date.now() - startTimeRef.current) / 1000 / 60

      const X = tf.tensor2d([[
        getScrollPercent(),
        Math.min(timeOnPage / 10, 1),
        Math.min(clicksRef.current / 30, 1),
        0,
        0,
      ]])

      const prediction = model.predict(X) as tf.Tensor
      const probability = (await prediction.data())[0]

      X.dispose()
      prediction.dispose()

      // 📈 Nunca permitir que baje
      if (probability > lastProbabilityRef.current) {
        lastProbabilityRef.current = probability
      }

      console.log("🔥 Probabilidad compra:", lastProbabilityRef.current)

      if (lastProbabilityRef.current >= 0.1) {
        setShowScarcity(true)

        // 🔔 Mostrar notificación del navegador
        if ("Notification" in window && Notification.permission === "granted") {
          new Notification("¡Última oportunidad!", {
            body: "Quedan solo 3 unidades disponibles. ¡No pierdas la oportunidad!",
            icon: "/icon.png",
            tag: "scarcity",
          })
        }
      }
    }

    const interval = setInterval(evaluateUser, 8000)
    return () => clearInterval(interval)
  }, [model, showScarcity])

  if (!showScarcity) return null

  return (
    <div className="fixed bottom-4 right-4 z-50 bg-red-600 text-white p-4 rounded-lg shadow-lg animate-pulse max-w-xs">
      <p className="font-bold text-lg mb-2">🔥 ¡Última oportunidad hoy!</p>
      <p className="text-sm mb-1">⏳ Quedan <strong>solo 3 unidades</strong></p>
      <p className="text-sm">Finaliza en <strong>{formatTime(secondsLeft)}</strong></p>
    </div>
  )
}
