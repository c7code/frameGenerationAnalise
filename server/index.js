import express from 'express'
import cors from 'cors'
import multer from 'multer'
import path from 'path'
import fs from 'fs'
import { fileURLToPath } from 'url'
import ffmpegPath from 'ffmpeg-static'
import ffmpeg from 'fluent-ffmpeg'
import { v4 as uuidv4 } from 'uuid'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

ffmpeg.setFfmpegPath(ffmpegPath)

const app = express()
app.use(cors())

const uploadsDir = path.join(__dirname, 'uploads')
const framesDir = path.join(__dirname, 'frames')
fs.mkdirSync(uploadsDir, { recursive: true })
fs.mkdirSync(framesDir, { recursive: true })

app.use('/frames', express.static(framesDir))

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname}`),
})
const upload = multer({ storage })

app.post('/upload', upload.single('video'), async (req, res) => {
  try {
    const videoPath = req.file?.path
    const intervalSec = Number(req.body?.intervalSec || 1)
    if (!videoPath) return res.status(400).json({ error: 'Video ausente' })
    const id = uuidv4()
    const outDir = path.join(framesDir, id)
    fs.mkdirSync(outDir, { recursive: true })

    const fpsExpr = `fps=1/${Math.max(1, intervalSec)}`
    const outputPattern = path.join(outDir, 'frame-%04d.jpg')

    await new Promise((resolve, reject) => {
      ffmpeg(videoPath)
        .outputOptions(['-vf', fpsExpr, '-qscale:v', '2'])
        .output(outputPattern)
        .on('end', resolve)
        .on('error', reject)
        .run()
    })

    const files = fs
      .readdirSync(outDir)
      .filter((f) => /\.jpg$/i.test(f))
      .sort()
    const baseUrl = `${req.protocol}://${req.get('host')}`
    const frames = files.map((f) => `${baseUrl}/frames/${id}/${f}`)
    res.json({ id, frames })
  } catch (e) {
    res.status(500).json({ error: 'Falha ao extrair frames' })
  }
})

const port = Number(process.env.PORT || 5000)
app.listen(port, () => {})