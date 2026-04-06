const express = require('express')
const app = express()
app.use(express.json())
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Methods', 'GET,POST,OPTIONS')
  res.header('Access-Control-Allow-Headers', '*')
  if (req.method === 'OPTIONS') return res.sendStatus(200)
  next()
})
app.get('/', (req, res) => res.json({ ok: true, service: 'ResumeWave Proxy' }))
app.post('/api', async (req, res) => {
  const key = process.env.ANTHROPIC_API_KEY
  if (!key) return res.status(500).json({ error: { message: 'API key not set' } })
  try {
    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'x-api-key': key, 'anthropic-version': '2023-06-01' },
      body: JSON.stringify(req.body)
    })
    const data = await r.json()
    res.status(r.status).json(data)
  } catch (e) { res.status(502).json({ error: { message: e.message } }) }
})
app.post('/lead', async (req, res) => res.json({ ok: true }))
app.listen(process.env.PORT || 3000, () => console.log('Proxy running'))
