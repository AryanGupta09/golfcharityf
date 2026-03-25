import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Play, FlaskConical, Calendar, Trophy } from 'lucide-react'
import Card from '../../components/Card'
import Button from '../../components/Button'
import Loader from '../../components/Loader'
import { drawService } from '../../services/drawService'
import toast from 'react-hot-toast'
import { format } from 'date-fns'

export default function AdminDraws() {
  const [draws, setDraws] = useState([])
  const [loading, setLoading] = useState(true)
  const [running, setRunning] = useState(false)
  const [simulating, setSimulating] = useState(false)
  const [mode, setMode] = useState('random')
  const [simulation, setSimulation] = useState(null)
  const [nextDrawDate, setNextDrawDate] = useState(null)

  useEffect(() => { fetchData() }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [drawsRes, nextRes] = await Promise.all([
        drawService.getAllDraws(1, 10),
        drawService.getNextDrawDate()
      ])
      setDraws(drawsRes.data || [])
      setNextDrawDate(nextRes.data?.nextDrawDate)
    } catch { toast.error('Failed to load draws') }
    finally { setLoading(false) }
  }

  const handleRunDraw = async () => {
    if (!window.confirm(`Run official ${mode} draw? This cannot be undone.`)) return
    setRunning(true)
    try {
      const res = await drawService.runDraw(mode)
      toast.success(`Draw #${res.data.draw.drawNumber} completed!`)
      setSimulation(null)
      fetchData()
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to run draw')
    } finally { setRunning(false) }
  }

  const handleSimulate = async () => {
    setSimulating(true)
    setSimulation(null)
    try {
      const res = await drawService.simulateDraw(mode)
      setSimulation(res.data)
      toast.success('Simulation complete — not saved')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Simulation failed')
    } finally { setSimulating(false) }
  }

  if (loading) return <Loader />

  return (
    <div className="space-y-8">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Manage Draws</h1>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Run, simulate, and review monthly draws</p>
      </motion.div>

      {/* Controls */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
        <Card>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <div>
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Draw Mode</p>
              <div className="flex gap-2">
                {['random', 'algorithmic'].map(m => (
                  <button key={m} onClick={() => setMode(m)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                      mode === m
                        ? 'bg-primary-600 text-white'
                        : 'bg-gray-100 dark:bg-dark-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-dark-600'
                    }`}>
                    {m}
                  </button>
                ))}
              </div>
              <p className="text-xs text-gray-400 mt-1">
                {mode === 'algorithmic' ? 'Numbers weighted by score frequency across all users' : 'Fully random 5 numbers (1–45)'}
              </p>
            </div>
          </div>

          {nextDrawDate && (
            <div className="flex items-center gap-2 mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <Calendar size={16} className="text-blue-600 dark:text-blue-400" />
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Next scheduled draw: <strong>{format(new Date(nextDrawDate), 'MMMM d, yyyy')}</strong>
              </p>
            </div>
          )}

          <div className="flex flex-wrap gap-3">
            <Button onClick={handleSimulate} loading={simulating} variant="secondary"
              className="flex items-center gap-2">
              <FlaskConical size={18} /> Simulate Draw (Dry Run)
            </Button>
            <Button onClick={handleRunDraw} loading={running}
              className="flex items-center gap-2 bg-green-600 hover:bg-green-700">
              <Play size={18} /> Run Official Draw
            </Button>
          </div>
        </Card>
      </motion.div>

      {/* Simulation Result */}
      {simulation && (
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-2 border-yellow-400 dark:border-yellow-600">
            <div className="flex items-center gap-2 mb-4">
              <FlaskConical size={20} className="text-yellow-600" />
              <h2 className="text-lg font-bold text-gray-900 dark:text-white">Simulation Preview (NOT saved)</h2>
            </div>
            <div className="mb-4">
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Winning Numbers</p>
              <div className="flex gap-2">
                {simulation.winningNumbers?.map((n, i) => (
                  <span key={i} className="w-10 h-10 flex items-center justify-center rounded-full bg-yellow-500 text-white font-bold text-sm">{n}</span>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-3 gap-4 mb-4">
              <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">5 Match (40%) — ${simulation.distribution?.fiveMatch?.amount?.toFixed(2)}</p>
                {simulation.distribution?.fiveMatch?.winners?.length > 0
                  ? simulation.distribution.fiveMatch.winners.map(w => <p key={w._id} className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</p>)
                  : <p className="text-sm text-gray-400">No winners → Jackpot rolls over</p>}
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">4 Match (35%) — ${simulation.distribution?.fourMatch?.amount?.toFixed(2)}</p>
                {simulation.distribution?.fourMatch?.winners?.length > 0
                  ? simulation.distribution.fourMatch.winners.map(w => <p key={w._id} className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</p>)
                  : <p className="text-sm text-gray-400">No winners</p>}
              </div>
              <div className="p-3 bg-gray-50 dark:bg-dark-700 rounded-lg">
                <p className="text-xs text-gray-500 mb-1">3 Match (25%) — ${simulation.distribution?.threeMatch?.amount?.toFixed(2)}</p>
                {simulation.distribution?.threeMatch?.winners?.length > 0
                  ? simulation.distribution.threeMatch.winners.map(w => <p key={w._id} className="text-sm font-medium text-gray-900 dark:text-white">{w.name}</p>)
                  : <p className="text-sm text-gray-400">No winners</p>}
              </div>
            </div>
            <p className="text-xs text-gray-400">Prize Pool: ${simulation.prizePool} | Jackpot Rollover: ${simulation.jackpotRollover}</p>
          </Card>
        </motion.div>
      )}

      {/* Draw History */}
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Draw History</h2>
        <div className="space-y-4">
          {draws.length > 0 ? draws.map((draw, i) => (
            <motion.div key={draw._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}>
              <Card>
                <div className="flex items-center justify-between flex-wrap gap-4">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <Trophy size={18} className="text-yellow-500" />
                      <span className="font-bold text-gray-900 dark:text-white">Draw #{draw.drawNumber}</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400">
                        {draw.month}/{draw.year}
                      </span>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        draw.drawMode === 'algorithmic'
                          ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400'
                          : 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400'
                      }`}>{draw.drawMode || 'random'}</span>
                    </div>
                    <div className="flex gap-2">
                      {(draw.winningNumbers || [draw.winningNumber]).map((n, idx) => (
                        <span key={idx} className="w-8 h-8 flex items-center justify-center rounded-full bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 font-bold text-sm">{n}</span>
                      ))}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900 dark:text-white">${draw.prizePool}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{draw.totalWinners} winner(s)</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )) : (
            <Card className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No draws yet. Run the first draw!</p>
            </Card>
          )}
        </div>
      </motion.div>
    </div>
  )
}
