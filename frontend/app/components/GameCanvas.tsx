"use client"

import { useEffect, useRef } from "react"
import { submitScore } from "../lib/api"

export default function GameCanvas({ onGameOver, playerId }: any) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current!
    const ctx = canvas.getContext("2d")!

    canvas.width = window.innerWidth
    canvas.height = window.innerHeight

    let meteors: any[] = []
    let bullets: any[] = []
    let explosions: any[] = []
    let frame = 0

    const scoreRef = { current: 1 }
    let isGameOver = false
    let animation: any

    const bg = new Image()
    bg.src = "/assets/alam.jpg"

    const plane = new Image()
    plane.src = "/assets/planes.png"

    const meteor1 = new Image()
    meteor1.src = "/assets/meteor1.png"

    const meteor2 = new Image()
    meteor2.src = "/assets/meteor2.png"

    const bulletImg = new Image()
    bulletImg.src = "/assets/peluru.png"

    const explosionImg = new Image()
    explosionImg.src = "/assets/ledakan.png"

    const player = {
      x: canvas.width / 2 - 60,
      y: canvas.height - 150,
      w: 120,
      h: 120,
      speed: 7
    }

    let keys: any = {}

    window.addEventListener("keydown", e => {
      keys[e.key] = true

      if (e.key === " " && !isGameOver) {
        bullets.push({
          x: player.x + player.w / 2 - 10,
          y: player.y,
          w: 20,
          h: 40,
          speed: 10
        })
      }
    })

    window.addEventListener("keyup", e => {
      keys[e.key] = false
    })

    function emitScore(score: number) {
      window.dispatchEvent(
        new CustomEvent("score-update", {
          detail: score
        })
      )
    }

    function spawn() {
      const isBig = Math.random() > 0.5

      const size = isBig
        ? 80 + Math.random() * 40
        : 40 + Math.random() * 20

      meteors.push({
        x: Math.random() * (canvas.width - size),
        y: -size,
        w: size,
        h: size,
        speed: isBig ? 2 : 4,
        img: Math.random() > 0.5 ? meteor1 : meteor2,
        type: isBig ? "big" : "small"
      })
    }

    function createExplosion(x: number, y: number, size: number) {
      explosions.push({ x, y, size, frame: 0 })
    }

    function loop() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.drawImage(bg, 0, 0, canvas.width, canvas.height)

      if (!isGameOver) {
        if (keys["ArrowLeft"]) player.x -= player.speed
        if (keys["ArrowRight"]) player.x += player.speed
        if (keys["ArrowUp"]) player.y -= player.speed
        if (keys["ArrowDown"]) player.y += player.speed
      }

      player.x = Math.max(0, Math.min(canvas.width - player.w, player.x))
      player.y = Math.max(0, Math.min(canvas.height - player.h, player.y))

      if (!isGameOver) {
        ctx.drawImage(plane, player.x, player.y, player.w, player.h)
      }

      if (frame % 25 === 0 && !isGameOver) spawn()

      bullets.forEach((b, bi) => {
        b.y -= b.speed
        ctx.drawImage(bulletImg, b.x, b.y, b.w, b.h)

        if (b.y < 0) bullets.splice(bi, 1)
      })

      meteors.forEach((m, mi) => {
        m.y += m.speed
        ctx.drawImage(m.img, m.x, m.y, m.w, m.h)

        if (
          !isGameOver &&
          player.x < m.x + m.w &&
          player.x + player.w > m.x &&
          player.y < m.y + m.h &&
          player.y + player.h > m.y
        ) {
          isGameOver = true

          createExplosion(player.x, player.y, 120)
          meteors.splice(mi, 1)

          setTimeout(async () => {
            try {
              console.log(playerId,scoreRef.current);
              
              await submitScore(playerId, scoreRef.current)
              onGameOver(scoreRef.current)
            } catch (err) {
              console.error(err)
              onGameOver(scoreRef.current)
            }
          }, 500)
        }

        bullets.forEach((b, bi) => {
          if (
            b.x < m.x + m.w &&
            b.x + b.w > m.x &&
            b.y < m.y + m.h &&
            b.y + b.h > m.y
          ) {
            createExplosion(m.x, m.y, m.w)

            meteors.splice(mi, 1)
            bullets.splice(bi, 1)

            if (m.type === "big") {
              scoreRef.current += 10
            } else {
              scoreRef.current += 5
            }

            emitScore(scoreRef.current)
          }
        })

        if (m.y > canvas.height) meteors.splice(mi, 1)
      })

      explosions.forEach((ex, i) => {
        ctx.drawImage(explosionImg, ex.x, ex.y, ex.size, ex.size)
        ex.frame++

        if (ex.frame > 10) explosions.splice(i, 1)
      })

      frame++
      animation = requestAnimationFrame(loop)
    }

    loop()

    return () => cancelAnimationFrame(animation)
  }, [playerId, onGameOver])

  return <canvas ref={canvasRef} style={{ display: "block" }} />
}