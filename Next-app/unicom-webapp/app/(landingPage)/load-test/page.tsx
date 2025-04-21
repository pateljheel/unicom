// // pages/load-test.tsx
// "use client"
// import React, { useState } from 'react'

// type Results = {
//   successCount: number
//   failureCount: number
//   avg: number
//   p95: number
//   p99: number
// }

// const LoadTestPage: React.FC = () => {
//   const [endpoint, setEndpoint] = useState<string>('https://cd7uddw0wf.execute-api.us-east-1.amazonaws.com/api/posts')
//   const [method, setMethod] = useState<'GET' | 'POST'>('GET')
//   const [body, setBody] = useState<string>('')
//   const [totalRequests, setTotalRequests] = useState<number>(100)
//   const [concurrency, setConcurrency] = useState<number>(10)
//   const [running, setRunning] = useState<boolean>(false)
//   const [results, setResults] = useState<Results | null>(null)

//   const runTest = async () => {
//     setRunning(true)
//     const durations: number[] = []
//     let successCount = 0
//     let failureCount = 0

//     const batchSize = concurrency
//     const batches = Math.ceil(totalRequests / batchSize)

//     for (let i = 0; i < batches; i++) {
//       const currentBatchSize = Math.min(batchSize, totalRequests - i * batchSize)
//       const batch = Array.from({ length: currentBatchSize }).map(async () => {
//         const start = performance.now()
//         try {
//           const res = await fetch(endpoint, {
//             method,
//             headers: {
//               'Content-Type': 'application/json',
//             },
//             body: method === 'POST' ? body : undefined,
//           })
//           const end = performance.now()
//           durations.push(end - start)
//           if (res.ok) successCount++
//           else failureCount++
//         } catch {
//           const end = performance.now()
//           durations.push(end - start)
//           failureCount++
//         }
//       })
//       // wait for this batch to finish before launching the next
//       // so we cap concurrent fetches at your `concurrency`
//       // count
//       // (if you want full fan‑out, remove the await)
//       // but typically you want to limit it
//       // so your browser / server isn’t swamped all at once
//       // and you get meaningful CPU‐bound behavior.
//       // Adjust as needed.
//       // 
//       // Warning: browsers may cap actual simultaneous
//       // connections per domain—so real concurrency might
//       // be lower than this number.
//       await Promise.all(batch)
//     }

//     // compute stats
//     durations.sort((a, b) => a - b)
//     const sum = durations.reduce((a, b) => a + b, 0)
//     const avg = sum / durations.length || 0
//     const p95 = durations[Math.floor(durations.length * 0.95)] || 0
//     const p99 = durations[Math.floor(durations.length * 0.99)] || 0

//     setResults({ successCount, failureCount, avg, p95, p99 })
//     setRunning(false)
//   }

//   return (
//     <div style={{ padding: 24, fontFamily: 'sans-serif', maxWidth: 600, margin: '0 auto' }}>
//       <h1>🔋 Load Tester</h1>

//       <label>
//         Endpoint URL:
//         <input
//           type="text"
//           value={endpoint}
//           onChange={e => setEndpoint(e.target.value)}
//           style={{ width: '100%', marginBottom: 12 }}
//         />
//       </label>

//       <label style={{ display: 'block', marginBottom: 12 }}>
//         Method:
//         <select value={method} onChange={e => setMethod(e.target.value as any)}>
//           <option>GET</option>
//           <option>POST</option>
//         </select>
//       </label>

//       {method === 'POST' && (
//         <label>
//           JSON Body:
//           <textarea
//             rows={4}
//             value={body}
//             onChange={e => setBody(e.target.value)}
//             style={{ width: '100%', marginBottom: 12 }}
//           />
//         </label>
//       )}

//       <label>
//         Total Requests:
//         <input
//           type="number"
//           value={totalRequests}
//           onChange={e => setTotalRequests(+e.target.value)}
//           style={{ width: '100%', marginBottom: 12 }}
//         />
//       </label>

//       <label>
//         Concurrency:
//         <input
//           type="number"
//           value={concurrency}
//           onChange={e => setConcurrency(+e.target.value)}
//           style={{ width: '100%', marginBottom: 12 }}
//         />
//       </label>

//       <button onClick={runTest} disabled={running} style={{ padding: '8px 16px', marginBottom: 24 }}>
//         {running ? 'Running…' : 'Start Load Test'}
//       </button>

//       {results && (
//         <div>
//           <h2>Results</h2>
//           <ul>
//             <li>✅ Successes: {results.successCount}</li>
//             <li>❌ Failures: {results.failureCount}</li>
//             <li>⏱️ Avg Latency: {results.avg.toFixed(1)} ms</li>
//             <li>📈 P95 Latency: {results.p95.toFixed(1)} ms</li>
//             <li>🚀 P99 Latency: {results.p99.toFixed(1)} ms</li>
//           </ul>
//         </div>
//       )}
//     </div>
//   )
// }

// export default LoadTestPage


// stress-test.ts
import autocannon, { Options } from 'autocannon'
import { run } from 'node:test'
// import infra_config from '../../../public/infra_config.json';

const config: Options = {
  url: "https://hj6ixh9aba.execute-api.us-east-1.amazonaws.com/api/posts",
  connections: 20,
  duration: 15,
  pipelining: 1,
  method: 'POST',
  headers: {
    'Authorization': 'Bearer eyJraWQiOiJxUDBWQmplM2RRY1hTWGJBczJPdEgzeEJQKzhvbkdcLzFoTVpkZVo0dlRGaz0iLCJhbGciOiJSUzI1NiJ9.eyJhdF9oYXNoIjoiQ0hndHllU1dMN2xtaEVvLVZyR1FYdyIsInN1YiI6IjI0ZThjNDc4LWQwMjEtNzA1Yy0xMzgyLTBmYjgzYjEzY2ZmZSIsImVtYWlsX3ZlcmlmaWVkIjp0cnVlLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV9WWllmaUo5a2oiLCJjb2duaXRvOnVzZXJuYW1lIjoiMjRlOGM0NzgtZDAyMS03MDVjLTEzODItMGZiODNiMTNjZmZlIiwiYXVkIjoiN203ZGtncTIyaHZrMTJxMjdjaDdqdjJscGUiLCJldmVudF9pZCI6ImQ2ZjFkZDM0LWQ5NWQtNGIzMi04NmIyLWZjZTNlNjNmN2M5NSIsInRva2VuX3VzZSI6ImlkIiwiYXV0aF90aW1lIjoxNzQ1MTg5ODAyLCJleHAiOjE3NDUyNzYyMDIsImlhdCI6MTc0NTE4OTgwMiwianRpIjoiNjQ4NWFmOTQtNGVhNi00YTFjLThkMmEtYzNjYjAxNGYyZjY5IiwiZW1haWwiOiJqcDk5NTlAZy5yaXQuZWR1In0.ju1IkVoYA-8AGwD3-At6VC8TXft-I0aUn8wGZOa0JOzMX68dG38kQur5KybyY4UW1qjH6ELij84FVr47Li9H6oeVL8k-YS8uWrDIyf_0wKxv2VLNAq5yfUpNRkoFgS4zmoczfraX_iiT72zuDoXfqrsOppoHLL9EsHVqC-BKCj7LKI31MS0peLjmMIsKHKMQ0eSRBtBkT5VzxcxJDzJ77aCtfDW7pGYApDp1D_3AikAp0hrxf06IejkEAeIA0H5c77VL2_wbLl1Fm_c_KmoKctuKa8eD-RbvrrxXAEoz_Wxs_5r6qcTk65oZFGIVSUGH7nfRBcb7Yevuuh9pl2OHqg',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    category: 'SELL',
    title: 'Stress Item',
    description: 'Stress testing this endpoint',
    price: 10.5,
    item: 'Autocannon Widget',
  }),
}

function runBench(opts: Options) {
  const inst = autocannon(opts, (err, result) => {
    if (err) {
      console.error('❌ Error:', err)
      return
    }
    console.log('\n✅ Final Results:\n', autocannon.printResult(result))
  })

  autocannon.track(inst, { renderProgressBar: true })
}

runBench(config)