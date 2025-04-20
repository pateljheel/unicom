// pages/load-test.tsx
"use client"
import React, { useState } from 'react'

type Results = {
  successCount: number
  failureCount: number
  avg: number
  p95: number
  p99: number
}

const LoadTestPage: React.FC = () => {
  const [endpoint, setEndpoint] = useState<string>('https://cd7uddw0wf.execute-api.us-east-1.amazonaws.com/api/posts')
  const [method, setMethod] = useState<'GET' | 'POST'>('GET')
  const [body, setBody] = useState<string>('')
  const [totalRequests, setTotalRequests] = useState<number>(100)
  const [concurrency, setConcurrency] = useState<number>(10)
  const [running, setRunning] = useState<boolean>(false)
  const [results, setResults] = useState<Results | null>(null)

  const runTest = async () => {
    setRunning(true)
    const durations: number[] = []
    let successCount = 0
    let failureCount = 0

    const batchSize = concurrency
    const batches = Math.ceil(totalRequests / batchSize)

    for (let i = 0; i < batches; i++) {
      const currentBatchSize = Math.min(batchSize, totalRequests - i * batchSize)
      const batch = Array.from({ length: currentBatchSize }).map(async () => {
        const start = performance.now()
        try {
          const res = await fetch(endpoint, {
            method,
            headers: {
              'Content-Type': 'application/json',
            },
            body: method === 'POST' ? body : undefined,
          })
          const end = performance.now()
          durations.push(end - start)
          if (res.ok) successCount++
          else failureCount++
        } catch {
          const end = performance.now()
          durations.push(end - start)
          failureCount++
        }
      })
      // wait for this batch to finish before launching the next
      // so we cap concurrent fetches at your `concurrency`
      // count
      // (if you want full fan‑out, remove the await)
      // but typically you want to limit it
      // so your browser / server isn’t swamped all at once
      // and you get meaningful CPU‐bound behavior.
      // Adjust as needed.
      // 
      // Warning: browsers may cap actual simultaneous
      // connections per domain—so real concurrency might
      // be lower than this number.
      await Promise.all(batch)
    }

    // compute stats
    durations.sort((a, b) => a - b)
    const sum = durations.reduce((a, b) => a + b, 0)
    const avg = sum / durations.length || 0
    const p95 = durations[Math.floor(durations.length * 0.95)] || 0
    const p99 = durations[Math.floor(durations.length * 0.99)] || 0

    setResults({ successCount, failureCount, avg, p95, p99 })
    setRunning(false)
  }

  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
      <h1>🔋 Load Tester</h1>

      <label>
        Endpoint URL:
        <input
          type="text"
          value={endpoint}
          onChange={e => setEndpoint(e.target.value)}
          style={{ width: '100%', marginBottom: 12 }}
        />
      </label>

      <label style={{ display: 'block', marginBottom: 12 }}>
        Method:
        <select value={method} onChange={e => setMethod(e.target.value as any)}>
          <option>GET</option>
          <option>POST</option>
        </select>
      </label>

      {method === 'POST' && (
        <label>
          JSON Body:
          <textarea
            rows={4}
            value={body}
            onChange={e => setBody(e.target.value)}
            style={{ width: '100%', marginBottom: 12 }}
          />
        </label>
      )}

      <label>
        Total Requests:
        <input
          type="number"
          value={totalRequests}
          onChange={e => setTotalRequests(+e.target.value)}
          style={{ width: '100%', marginBottom: 12 }}
        />
      </label>

      <label>
        Concurrency:
        <input
          type="number"
          value={concurrency}
          onChange={e => setConcurrency(+e.target.value)}
          style={{ width: '100%', marginBottom: 12 }}
        />
      </label>

      <button onClick={runTest} disabled={running} style={{ padding: '8px 16px', marginBottom: 24 }}>
        {running ? 'Running…' : 'Start Load Test'}
      </button>

      {results && (
        <div>
          <h2>Results</h2>
          <ul>
            <li>✅ Successes: {results.successCount}</li>
            <li>❌ Failures: {results.failureCount}</li>
            <li>⏱️ Avg Latency: {results.avg.toFixed(1)} ms</li>
            <li>📈 P95 Latency: {results.p95.toFixed(1)} ms</li>
            <li>🚀 P99 Latency: {results.p99.toFixed(1)} ms</li>
          </ul>
        </div>
      )}
    </div>
  )
}

export default LoadTestPage


// stress-test.ts
// import autocannon, { Options } from 'autocannon'

// const config: Options = {
//   url: 'https://cd7uddw0wf.execute-api.us-east-1.amazonaws.com/api/posts',
//   connections: 20,
//   duration: 15,
//   pipelining: 1,
//   method: 'POST',
//   headers: {
//     'Authorization': 'Bearer YOUR_JWT_HERE',
//     'Content-Type': 'application/json',
//   },
//   body: JSON.stringify({
//     category: 'SELL',
//     title: 'Stress Item',
//     description: 'Stress testing this endpoint',
//     price: 10.5,
//     item: 'Autocannon Widget',
//   }),
// }

// function runBench(opts: Options) {
//   const inst = autocannon(opts, (err, result) => {
//     if (err) {
//       console.error('❌ Error:', err)
//       return
//     }
//     console.log('\n✅ Final Results:\n', autocannon.printResult(result))
//   })

//   autocannon.track(inst, { renderProgressBar: true })
// }

// runBench(config)
