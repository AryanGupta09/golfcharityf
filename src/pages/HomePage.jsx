import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { ArrowRight, Heart, Trophy, Users, Sparkles, ExternalLink } from 'lucide-react'
import Button from '../components/Button'
import { charityService } from '../services/charityService'
import { useAuthStore } from '../store/authStore'

// ── Animated donation counter ────────────────────────────────
function DonationCounter() {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })
  const target = 124750

  useEffect(() => {
    if (!inView) return
    let start = 0
    const steps = 60
    const inc = target / steps
    const timer = setInterval(() => {
      start += inc
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(Math.floor(start))
    }, 30)
    return () => clearInterval(timer)
  }, [inView])

  return (
    <span ref={ref} className="tabular-nums">
      ${count.toLocaleString()}
    </span>
  )
}

// ── How it works steps ───────────────────────────────────────
const steps = [
  {
    num: '01',
    icon: Heart,
    title: 'Choose Your Cause',
    desc: 'Pick a charity that moves you. Every subscription routes a portion of your fee directly to them.',
    color: 'from-coral-400 to-coral-600',
  },
  {
    num: '02',
    icon: Trophy,
    title: 'Play & Track Scores',
    desc: 'Log your golf scores after each round. Your last 5 scores enter you into the monthly draw automatically.',
    color: 'from-navy-400 to-navy-600',
  },
  {
    num: '03',
    icon: Sparkles,
    title: 'Win & Give Back',
    desc: 'Monthly draws reward top scorers with cash prizes. Winners share the joy — and the giving continues.',
    color: 'from-amber-400 to-amber-600',
  },
]

// ── Fade-up animation variant ────────────────────────────────
const fadeUp = {
  hidden: { opacity: 0, y: 28 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' } },
}
const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.15 } } }

export default function HomePage() {
  const [featured, setFeatured] = useState(null)
  const { isAuthenticated } = useAuthStore()

  useEffect(() => {
    charityService.getFeaturedCharity()
      .then(r => setFeatured(r.data))
      .catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-ivory-50 dark:bg-dark-950">

      {/* ── HERO ──────────────────────────────────────────── */}
      <section className="relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-36">
        {/* Background blobs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute -top-32 -left-32 w-[600px] h-[600px] bg-navy-100 dark:bg-navy-900/20 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-20 -right-20 w-[500px] h-[500px] bg-coral-100 dark:bg-coral-900/20 rounded-full blur-3xl opacity-50" />
        </div>

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 text-center">
          {/* Eyebrow */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-coral-50 dark:bg-coral-900/30 border border-coral-200 dark:border-coral-800 rounded-full mb-8">
            <Heart size={14} className="text-coral-500" />
            <span className="text-sm font-semibold text-coral-700 dark:text-coral-400">Charity-first. Golf second.</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl sm:text-6xl md:text-7xl font-bold leading-[1.08] tracking-tight text-gray-900 dark:text-white mb-6">
            Every score you play
            <br />
            <span className="bg-gradient-to-r from-coral-500 to-navy-600 bg-clip-text text-transparent">
              feeds a cause.
            </span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-500 dark:text-gray-400 max-w-2xl mx-auto mb-10 leading-relaxed">
            Subscribe, track your golf scores, enter monthly draws — and watch your game fund real change for charities you believe in.
          </motion.p>

          {/* CTAs */}
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link to={isAuthenticated ? '/dashboard' : '/signup'}>
              <Button variant="coral" size="lg" className="w-full sm:w-auto gap-2">
                Start Making Impact <ArrowRight size={18} />
              </Button>
            </Link>
            <Link to="/charities">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Explore Charities
              </Button>
            </Link>
          </motion.div>

          {/* Donation counter */}
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}
            className="mt-16 inline-flex flex-col items-center">
            <p className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              <DonationCounter />
            </p>
            <p className="text-sm text-gray-400 dark:text-gray-500 mt-2 font-medium uppercase tracking-widest">
              Total donated by our community
            </p>
          </motion.div>
        </div>
      </section>

      {/* ── HOW IT WORKS ──────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark-900">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-80px' }}
            className="text-center mb-16">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-coral-500 mb-3">
              How it works
            </motion.p>
            <motion.h2 variants={fadeUp} className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
              Simple. Transparent. Impactful.
            </motion.h2>
          </motion.div>

          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="grid md:grid-cols-3 gap-8">
            {steps.map(({ num, icon: Icon, title, desc, color }) => (
              <motion.div key={num} variants={fadeUp}
                whileHover={{ y: -6 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                className="relative bg-ivory-50 dark:bg-dark-800 rounded-2xl p-8 border border-gray-100 dark:border-dark-700">
                <span className="absolute top-6 right-6 text-5xl font-black text-gray-100 dark:text-dark-700 select-none">{num}</span>
                <div className={`inline-flex p-3 rounded-2xl bg-gradient-to-br ${color} mb-5`}>
                  <Icon size={24} className="text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
                <p className="text-gray-500 dark:text-gray-400 leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* ── FEATURED CHARITY SPOTLIGHT ────────────────────── */}
      {featured && (
        <section className="py-24 bg-ivory-50 dark:bg-dark-950">
          <div className="max-w-5xl mx-auto px-4 sm:px-6">
            <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}>
              <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-coral-500 mb-3 text-center">
                Spotlight
              </motion.p>
              <motion.h2 variants={fadeUp} className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white text-center mb-10">
                This month's featured charity
              </motion.h2>

              <motion.div variants={fadeUp}
                whileHover={{ y: -4 }} transition={{ type: 'spring', stiffness: 250, damping: 24 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-navy-700 to-navy-900 p-8 md:p-12 text-white">
                {/* Decorative blob */}
                <div className="absolute -top-20 -right-20 w-64 h-64 bg-coral-500/20 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-navy-400/20 rounded-full blur-2xl" />

                <div className="relative">
                  <div className="flex items-center gap-2 mb-4">
                    <span className="px-3 py-1 bg-coral-500/20 border border-coral-400/30 rounded-full text-coral-300 text-xs font-semibold uppercase tracking-wide">
                      Featured Charity
                    </span>
                  </div>
                  <h3 className="text-3xl md:text-4xl font-bold mb-4">{featured.name}</h3>
                  <p className="text-white/80 text-lg leading-relaxed max-w-2xl mb-8">{featured.description}</p>

                  <div className="flex flex-wrap items-center gap-6 mb-8">
                    <div>
                      <p className="text-white/50 text-sm">Total Raised</p>
                      <p className="text-2xl font-bold">${featured.totalDonations?.toLocaleString() || 0}</p>
                    </div>
                    {featured.website && (
                      <a href={featured.website} target="_blank" rel="noreferrer"
                        className="flex items-center gap-1.5 text-white/70 hover:text-white text-sm transition-colors">
                        <ExternalLink size={14} /> Visit Website
                      </a>
                    )}
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Link to="/charities">
                      <Button variant="coral" size="lg" className="gap-2">
                        <Heart size={16} /> Donate Now
                      </Button>
                    </Link>
                    <Link to="/signup">
                      <Button size="lg" className="bg-white/10 hover:bg-white/20 text-white border border-white/20 gap-2">
                        Subscribe & Support
                      </Button>
                    </Link>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </section>
      )}

      {/* ── SUBSCRIBE CTA ─────────────────────────────────── */}
      <section className="py-24 md:py-32 bg-white dark:bg-dark-900">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true, margin: '-60px' }}
            className="text-center">
            <motion.p variants={fadeUp} className="text-sm font-semibold uppercase tracking-widest text-coral-500 mb-4">
              Ready to start?
            </motion.p>
            <motion.h2 variants={fadeUp}
              className="text-4xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
              Play golf.
              <br />
              <span className="bg-gradient-to-r from-coral-500 to-navy-600 bg-clip-text text-transparent">
                Change lives.
              </span>
            </motion.h2>
            <motion.p variants={fadeUp} className="text-lg text-gray-500 dark:text-gray-400 mb-12 max-w-xl mx-auto">
              Join thousands of golfers who turn their passion into purpose. Pick a plan and start making an impact today.
            </motion.p>

            {/* Plan cards */}
            <motion.div variants={stagger} className="grid sm:grid-cols-2 gap-5 max-w-2xl mx-auto mb-10">
              {[
                { plan: 'Monthly', price: '$9.99', period: '/month', desc: 'Perfect for casual players', highlight: false },
                { plan: 'Yearly',  price: '$99.99', period: '/year', desc: 'Save 17% — best value', highlight: true },
              ].map(({ plan, price, period, desc, highlight }) => (
                <motion.div key={plan} variants={fadeUp}
                  whileHover={{ y: -4, scale: 1.02 }} transition={{ type: 'spring', stiffness: 300, damping: 24 }}
                  className={`relative rounded-2xl p-6 text-left border-2 ${
                    highlight
                      ? 'border-coral-500 bg-coral-50 dark:bg-coral-900/10'
                      : 'border-gray-200 dark:border-dark-700 bg-gray-50 dark:bg-dark-800'
                  }`}>
                  {highlight && (
                    <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-coral-500 text-white text-xs font-bold rounded-full">
                      BEST VALUE
                    </span>
                  )}
                  <p className="font-bold text-gray-900 dark:text-white text-lg mb-1">{plan}</p>
                  <div className="flex items-baseline gap-1 mb-2">
                    <span className="text-3xl font-black text-gray-900 dark:text-white">{price}</span>
                    <span className="text-gray-400 text-sm">{period}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{desc}</p>
                  <Link to="/signup">
                    <Button variant={highlight ? 'coral' : 'primary'} className="w-full">
                      Get {plan} Plan
                    </Button>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <motion.p variants={fadeUp} className="text-sm text-gray-400 dark:text-gray-500">
              No hidden fees. Cancel anytime. Every plan supports charity.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* ── STATS STRIP ───────────────────────────────────── */}
      <section className="py-16 bg-navy-700 dark:bg-navy-900">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div variants={stagger} initial="hidden" whileInView="show" viewport={{ once: true }}
            className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white">
            {[
              { value: '2,400+', label: 'Active Members' },
              { value: '$124K+', label: 'Donated to Charities' },
              { value: '18',     label: 'Charity Partners' },
              { value: '360+',   label: 'Monthly Draw Winners' },
            ].map(({ value, label }) => (
              <motion.div key={label} variants={fadeUp}>
                <p className="text-3xl md:text-4xl font-black mb-1">{value}</p>
                <p className="text-white/60 text-sm font-medium">{label}</p>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
