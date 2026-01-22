'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'framer-motion'
import {
    Sparkles,
    Heart,
    Brain,
    Target,
    BookOpen,
    Dumbbell,
    Apple,
    Shield,
    Zap,
    Star,
    Check,
    ArrowRight,
    Download,
    ChevronDown,
    Menu,
    X,
    Watch,
    Flame,
    Music,
    Lock
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'

export default function LandingPage() {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)

    const features = [
        {
            icon: Apple,
            title: 'Nutrition Tracking',
            description: 'Log meals, track calories, and monitor your macros with intelligent food insights.',
            color: 'from-green-500 to-emerald-600'
        },
        {
            icon: Dumbbell,
            title: 'Fitness Logging',
            description: 'Track workouts, monitor progress, and achieve your fitness goals efficiently.',
            color: 'from-orange-500 to-red-600'
        },
        {
            icon: Brain,
            title: 'Meditation Sessions',
            description: '115+ guided meditations for stress relief, better sleep, and mental clarity.',
            color: 'from-purple-500 to-indigo-600'
        },
        {
            icon: Sparkles,
            title: 'Manifestation Practice',
            description: 'Silva Method, quantum jumping, and visualization techniques for goal achievement.',
            color: 'from-pink-500 to-rose-600'
        },
        {
            icon: BookOpen,
            title: 'Journaling',
            description: 'Reflect on your journey with mood tracking and encrypted private entries.',
            color: 'from-blue-500 to-cyan-600'
        },
        {
            icon: Target,
            title: 'Goal Setting',
            description: 'Set SMART goals, track progress, and celebrate achievements with badges.',
            color: 'from-amber-500 to-yellow-600'
        }
    ]

    // New features highlight
    const highlights = [
        { icon: Watch, title: 'Apple Health & Google Fit', desc: 'Sync your health data' },
        { icon: Music, title: 'Offline Audio', desc: 'Meditation sounds anywhere' },
        { icon: Flame, title: 'Streaks & Badges', desc: 'Gamified progress tracking' },
        { icon: Lock, title: '100% Private', desc: 'Data never leaves your device' },
    ]

    // Comparison with competitors
    const comparison = [
        { feature: 'Price', manifestwell: '$9.99 once', calm: '$70/year', headspace: '$70/year' },
        { feature: 'Offline Mode', manifestwell: '✓ Full', calm: '✓ Limited', headspace: '✓ Limited' },
        { feature: 'Data Privacy', manifestwell: '✓ 100% Local', calm: '✗ Cloud', headspace: '✗ Cloud' },
        { feature: 'Nutrition Tracking', manifestwell: '✓', calm: '✗', headspace: '✗' },
        { feature: 'Fitness Logging', manifestwell: '✓', calm: '✗', headspace: '✗' },
        { feature: 'Manifestation/LOA', manifestwell: '✓ Silva Method', calm: '✗', headspace: '✗' },
        { feature: 'Health App Sync', manifestwell: '✓', calm: '✓', headspace: '✓' },
        { feature: 'No Ads', manifestwell: '✓', calm: '✓', headspace: '✓' },
    ]

    const testimonials = [
        {
            name: 'Sarah M.',
            role: 'Yoga Instructor',
            quote: 'ManifestWell transformed how I approach my daily wellness routine. The meditation and manifestation features are game-changers!',
            rating: 5
        },
        {
            name: 'Michael T.',
            role: 'Entrepreneur',
            quote: 'Finally, an app that combines physical and mental wellness. I\'ve lost 15 lbs and feel more focused than ever.',
            rating: 5
        },
        {
            name: 'Emma K.',
            role: 'Life Coach',
            quote: 'I recommend ManifestWell to all my clients. The holistic approach to wellness is exactly what people need.',
            rating: 5
        }
    ]

    const faqs = [
        {
            question: 'Is my data private and secure?',
            answer: 'Absolutely! ManifestWell stores all your data locally on your device. We never upload your personal information to any servers. Your wellness journey stays completely private.'
        },
        {
            question: 'Does it work offline?',
            answer: 'Yes! ManifestWell is designed to work completely offline. All features are available without an internet connection, perfect for meditation sessions anywhere.'
        },
        {
            question: 'What meditation techniques are included?',
            answer: 'We include breathing exercises, mindfulness meditation, visualization, stress relief sessions, sleep meditations, and advanced techniques. All with guided audio and timers.'
        },
        {
            question: 'What is the Silva Method?',
            answer: 'The Silva Method is a self-help and meditation program that helps you tap into your mind\'s full potential through relaxation and visualization techniques.'
        },
        {
            question: 'Is there a subscription fee?',
            answer: 'ManifestWell offers a one-time purchase with lifetime access to all features. No hidden fees, no subscriptions, no ads.'
        }
    ]

    const pricingFeatures = [
        'All 6 wellness modules included',
        'Unlimited meal & workout logging',
        'Full meditation library access',
        'Silva Method & manifestation guides',
        'Journal with mood tracking',
        'Goal setting & progress tracking',
        'Works completely offline',
        '100% private - data stays on device',
        'Lifetime updates included',
        'No ads, ever'
    ]

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900">
            {/* Navigation */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-slate-200 dark:border-slate-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        <div className="flex items-center gap-2">
                            <Image
                                src="/logo.png"
                                alt="ManifestWell Logo"
                                width={40}
                                height={40}
                                className="rounded-xl"
                            />
                            <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                ManifestWell
                            </span>
                        </div>

                        <div className="hidden md:flex items-center gap-8">
                            <a href="#features" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 transition-colors">Features</a>
                            <a href="#testimonials" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 transition-colors">Reviews</a>
                            <a href="#pricing" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 transition-colors">Pricing</a>
                            <a href="#faq" className="text-slate-600 hover:text-purple-600 dark:text-slate-300 transition-colors">FAQ</a>
                            <Button className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>

                        <button
                            className="md:hidden p-2"
                            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                        >
                            {mobileMenuOpen ? <X /> : <Menu />}
                        </button>
                    </div>
                </div>

                {/* Mobile menu */}
                {mobileMenuOpen && (
                    <div className="md:hidden bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 py-4">
                        <div className="flex flex-col gap-4 px-4">
                            <a href="#features" className="text-slate-600 dark:text-slate-300">Features</a>
                            <a href="#testimonials" className="text-slate-600 dark:text-slate-300">Reviews</a>
                            <a href="#pricing" className="text-slate-600 dark:text-slate-300">Pricing</a>
                            <a href="#faq" className="text-slate-600 dark:text-slate-300">FAQ</a>
                            <Button className="bg-gradient-to-r from-purple-600 to-orange-500 w-full">
                                <Download className="w-4 h-4 mr-2" />
                                Download
                            </Button>
                        </div>
                    </div>
                )}
            </nav>

            {/* Hero Section */}
            <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            className="text-center lg:text-left"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                        >
                            <motion.div
                                className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 text-purple-700 dark:text-purple-300 px-4 py-2 rounded-full text-sm font-medium mb-6 border border-purple-200 dark:border-purple-800"
                                initial={{ scale: 0.9 }}
                                animate={{ scale: 1 }}
                                transition={{ delay: 0.2, type: "spring" }}
                            >
                                <Sparkles className="w-4 h-4 animate-pulse" />
                                Tired of $70/year subscriptions?
                            </motion.div>

                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white mb-6 leading-tight">
                                The{' '}
                                <span className="bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500 bg-clip-text text-transparent">
                                    All-in-One
                                </span>
                                {' '}Wellness App
                                <br />
                                <span className="text-3xl sm:text-4xl lg:text-5xl">for Just $9.99</span>
                            </h1>

                            <p className="text-xl text-slate-600 dark:text-slate-300 mb-8 max-w-xl mx-auto lg:mx-0">
                                Nutrition + Fitness + 115 Meditations + Manifestation + Journal + Goals.
                                <strong className="text-purple-600"> One price, forever. No subscriptions.</strong>
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-lg px-8 py-6 shadow-lg shadow-purple-500/25">
                                    <Download className="w-5 h-5 mr-2" />
                                    Get ManifestWell — $9.99
                                </Button>
                                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                                    See Features
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </div>

                            {/* Key differentiators */}
                            <div className="mt-8 grid grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0">
                                {highlights.map((h, i) => (
                                    <motion.div
                                        key={i}
                                        className="flex items-center gap-2 text-sm"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ delay: 0.4 + i * 0.1 }}
                                    >
                                        <div className="w-8 h-8 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                                            <h.icon className="w-4 h-4 text-purple-600" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-slate-900 dark:text-white">{h.title}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>

                            <div className="mt-8 flex items-center gap-6 justify-center lg:justify-start">
                                <div className="flex -space-x-2">
                                    {[1, 2, 3, 4, 5].map((i) => (
                                        <div key={i} className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-orange-400 border-2 border-white dark:border-slate-900" />
                                    ))}
                                </div>
                                <div className="text-left">
                                    <div className="flex items-center gap-1">
                                        {[1, 2, 3, 4, 5].map((i) => (
                                            <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-sm text-slate-600 dark:text-slate-400">Join 10,000+ mindful users</p>
                                </div>
                            </div>
                        </motion.div>

                        <motion.div
                            className="relative"
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, delay: 0.3 }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-orange-500/20 blur-3xl rounded-full animate-pulse" />
                            <div className="relative bg-gradient-to-br from-purple-100 to-orange-100 dark:from-purple-900/30 dark:to-orange-900/30 rounded-3xl p-8 shadow-2xl">
                                <div className="aspect-[9/16] max-w-[300px] mx-auto bg-slate-900 rounded-[2.5rem] p-3 shadow-xl">
                                    <div className="w-full h-full bg-gradient-to-br from-purple-600 via-pink-500 to-orange-500 rounded-[2rem] flex items-center justify-center relative overflow-hidden">
                                        {/* Animated background */}
                                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)] animate-pulse" />
                                        <div className="text-center text-white p-6 relative z-10">
                                            <Image
                                                src="/logo.png"
                                                alt="ManifestWell"
                                                width={80}
                                                height={80}
                                                className="mx-auto mb-4 rounded-2xl shadow-lg"
                                            />
                                            <h3 className="text-2xl font-bold mb-2">ManifestWell</h3>
                                            <p className="text-white/80 text-sm mb-4">Mind • Body • Spirit</p>
                                            <div className="flex justify-center gap-2">
                                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">iOS</span>
                                                <span className="px-2 py-1 bg-white/20 rounded-full text-xs">Android</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </section>

            {/* Trust Badges */}
            <section className="py-12 bg-slate-100 dark:bg-slate-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Shield className="w-8 h-8 text-green-500" />
                            <span className="font-medium">100% Private</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Zap className="w-8 h-8 text-yellow-500" />
                            <span className="font-medium">Works Offline</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Heart className="w-8 h-8 text-red-500" />
                            <span className="font-medium">No Ads Ever</span>
                        </div>
                        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                            <Star className="w-8 h-8 text-purple-500" />
                            <span className="font-medium">Lifetime Access</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Everything You Need for{' '}
                            <span className="bg-gradient-to-r from-purple-600 to-orange-500 bg-clip-text text-transparent">
                                Complete Wellness
                            </span>
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
                            Six powerful modules working together to transform your mind, body, and spirit.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {features.map((feature, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-0 bg-white dark:bg-slate-800/50 overflow-hidden">
                                <CardContent className="p-6">
                                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className="w-7 h-7 text-white" />
                                    </div>
                                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
                                        {feature.title}
                                    </h3>
                                    <p className="text-slate-600 dark:text-slate-300">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Comparison Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-900/50">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Why Pay More for Less?
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            See how ManifestWell compares to subscription-based apps
                        </p>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
                            <thead>
                                <tr className="bg-gradient-to-r from-purple-600 to-orange-500 text-white">
                                    <th className="px-6 py-4 text-left font-semibold">Feature</th>
                                    <th className="px-6 py-4 text-center font-semibold">
                                        <div className="flex items-center justify-center gap-2">
                                            <Image src="/logo.png" alt="ManifestWell" width={24} height={24} className="rounded" />
                                            ManifestWell
                                        </div>
                                    </th>
                                    <th className="px-6 py-4 text-center font-semibold text-white/80">Calm</th>
                                    <th className="px-6 py-4 text-center font-semibold text-white/80">Headspace</th>
                                </tr>
                            </thead>
                            <tbody>
                                {comparison.map((row, i) => (
                                    <tr key={i} className={i % 2 === 0 ? 'bg-slate-50 dark:bg-slate-800/50' : ''}>
                                        <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{row.feature}</td>
                                        <td className="px-6 py-4 text-center font-semibold text-purple-600 dark:text-purple-400">{row.manifestwell}</td>
                                        <td className="px-6 py-4 text-center text-slate-500">{row.calm}</td>
                                        <td className="px-6 py-4 text-center text-slate-500">{row.headspace}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-8 text-center">
                        <p className="text-sm text-slate-500 dark:text-slate-400 mb-4">
                            * Calm and Headspace prices as of 2024. ManifestWell is a one-time purchase.
                        </p>
                        <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600">
                            <Download className="w-5 h-5 mr-2" />
                            Get ManifestWell — Save $60+/year
                        </Button>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-purple-50 to-white dark:from-purple-950/20 dark:to-slate-900">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Loved by Thousands
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            See what our users are saying about their wellness journey
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <Card key={index} className="border-0 bg-white dark:bg-slate-800/50 shadow-lg">
                                <CardContent className="p-6">
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                                        ))}
                                    </div>
                                    <p className="text-slate-600 dark:text-slate-300 mb-6 italic">
                                        "{testimonial.quote}"
                                    </p>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">{testimonial.name}</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* Pricing Section */}
            <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Simple, Transparent Pricing
                        </h2>
                        <p className="text-xl text-slate-600 dark:text-slate-300">
                            One purchase, lifetime access. No subscriptions, no hidden fees.
                        </p>
                    </div>

                    <Card className="border-2 border-purple-500 bg-white dark:bg-slate-800/50 shadow-2xl overflow-hidden">
                        <div className="bg-gradient-to-r from-purple-600 to-orange-500 text-white text-center py-2 text-sm font-medium">
                            🎉 Launch Special - 50% Off
                        </div>
                        <CardContent className="p-8 sm:p-12">
                            <div className="text-center mb-8">
                                <div className="text-5xl sm:text-6xl font-bold text-slate-900 dark:text-white mb-2">
                                    <span className="text-2xl text-slate-400 line-through mr-2">$19.99</span>
                                    $9.99
                                </div>
                                <p className="text-slate-600 dark:text-slate-300">One-time purchase • Lifetime access</p>
                            </div>

                            <div className="grid sm:grid-cols-2 gap-4 mb-8">
                                {pricingFeatures.map((feature, index) => (
                                    <div key={index} className="flex items-center gap-2">
                                        <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                                        <span className="text-slate-600 dark:text-slate-300">{feature}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-orange-500 hover:from-purple-700 hover:to-orange-600 text-lg px-12 py-6">
                                    <Apple className="w-5 h-5 mr-2" />
                                    App Store
                                </Button>
                                <Button size="lg" className="bg-slate-900 hover:bg-slate-800 dark:bg-white dark:text-slate-900 text-lg px-12 py-6">
                                    <Download className="w-5 h-5 mr-2" />
                                    Google Play
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </section>

            {/* FAQ Section */}
            <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-800/30">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white mb-4">
                            Frequently Asked Questions
                        </h2>
                    </div>

                    <div className="space-y-4">
                        {faqs.map((faq, index) => (
                            <Card key={index} className="border-0 bg-white dark:bg-slate-800/50 shadow-sm">
                                <button
                                    className="w-full p-6 text-left flex items-center justify-between"
                                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                                >
                                    <span className="font-medium text-slate-900 dark:text-white">{faq.question}</span>
                                    <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                </button>
                                {openFaq === index && (
                                    <div className="px-6 pb-6 text-slate-600 dark:text-slate-300">
                                        {faq.answer}
                                    </div>
                                )}
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-purple-600 via-pink-500 to-orange-500">
                <div className="max-w-4xl mx-auto text-center text-white">
                    <h2 className="text-3xl sm:text-4xl font-bold mb-4">
                        Start Your Wellness Journey Today
                    </h2>
                    <p className="text-xl text-white/80 mb-8 max-w-2xl mx-auto">
                        Join thousands of users who have transformed their lives with ManifestWell.
                        Your path to holistic wellness begins with one tap.
                    </p>
                    <Button size="lg" variant="secondary" className="text-lg px-12 py-6">
                        <Download className="w-5 h-5 mr-2" />
                        Download Now — It's Free to Start
                    </Button>
                </div>
            </section>

            {/* Footer */}
            <footer className="py-12 px-4 sm:px-6 lg:px-8 bg-slate-900 text-white">
                <div className="max-w-7xl mx-auto">
                    <div className="grid md:grid-cols-4 gap-8 mb-8">
                        <div>
                            <div className="flex items-center gap-2 mb-4">
                                <Image
                                    src="/logo.png"
                                    alt="ManifestWell Logo"
                                    width={40}
                                    height={40}
                                    className="rounded-xl"
                                />
                                <span className="text-xl font-bold">ManifestWell</span>
                            </div>
                            <p className="text-slate-400">
                                Your complete wellness companion for mind, body, and spirit.
                            </p>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Product</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                                <li><a href="#faq" className="hover:text-white transition-colors">FAQ</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Company</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><a href="#features" className="hover:text-white transition-colors">About Us</a></li>
                                <li><a href="mailto:support@manifestwell.com" className="hover:text-white transition-colors">Contact</a></li>
                                <li><a href="#testimonials" className="hover:text-white transition-colors">Reviews</a></li>
                            </ul>
                        </div>

                        <div>
                            <h4 className="font-bold mb-4">Legal</h4>
                            <ul className="space-y-2 text-slate-400">
                                <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
                                <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
                            </ul>
                        </div>
                    </div>

                    <div className="border-t border-slate-800 pt-8 text-center text-slate-400">
                        <p>© {new Date().getFullYear()} ManifestWell. All rights reserved.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
