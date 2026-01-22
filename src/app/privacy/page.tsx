import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Privacy Policy - ManifestWell',
    description: 'Privacy Policy for ManifestWell wellness app. Learn how we protect your data and privacy.',
}

export default function PrivacyPolicy() {
    return (
        <div className="min-h-screen bg-white dark:bg-slate-900">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <Link
                    href="/landing"
                    className="inline-flex items-center text-purple-600 hover:text-purple-700 mb-8"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Home
                </Link>

                <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-8">
                    Privacy Policy
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                        <strong>Last Updated:</strong> January 15, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Our Commitment to Your Privacy
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            ManifestWell is designed with privacy as a core principle. We believe your wellness journey is personal,
                            and your data should remain completely private. That's why ManifestWell stores all your information
                            locally on your device — we never collect, store, or transmit your personal data to any servers.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            What Data We Collect
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            <strong>Short answer: None.</strong>
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            ManifestWell is a fully offline application. All data you enter into the app — including:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2 mb-4">
                            <li>Meal and nutrition logs</li>
                            <li>Workout and activity records</li>
                            <li>Meditation session history</li>
                            <li>Manifestation practices and notes</li>
                            <li>Journal entries</li>
                            <li>Goals and progress tracking</li>
                            <li>Profile information (name, weight, height, etc.)</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-300">
                            — is stored exclusively on your device using local SQLite database technology.
                            This data never leaves your device and is not accessible to us or any third parties.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Data Storage and Security
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            Your data is stored in a secure, encrypted local database on your device. We recommend:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Enabling device-level security (passcode, biometrics) for additional protection</li>
                            <li>Regularly backing up your device to prevent data loss</li>
                            <li>Not sharing your device with others if you want to keep your data private</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Third-Party Services
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            ManifestWell does not integrate with any third-party analytics, advertising, or tracking services.
                            We do not use:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Google Analytics or similar tracking tools</li>
                            <li>Advertising networks</li>
                            <li>Social media tracking pixels</li>
                            <li>Any data collection SDKs</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Video Content
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Some meditation and manifestation guides include embedded YouTube videos. When you watch these videos,
                            YouTube's privacy policy applies to that interaction. We do not track which videos you watch.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Your Rights
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            Since all data is stored locally on your device, you have complete control:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li><strong>Access:</strong> All your data is accessible within the app</li>
                            <li><strong>Delete:</strong> Uninstalling the app removes all data</li>
                            <li><strong>Export:</strong> You can export your data from within the app settings</li>
                            <li><strong>Control:</strong> You decide what to log and what to keep private</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Children's Privacy
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            ManifestWell is intended for users 13 years of age and older. We do not knowingly collect
                            any information from children under 13.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Changes to This Policy
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            We may update this Privacy Policy from time to time. Any changes will be reflected on this page
                            with an updated revision date. Since we don't collect your contact information, we recommend
                            checking this page periodically.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            Contact Us
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            If you have any questions about this Privacy Policy, please contact us at:
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">
                            <strong>Email:</strong> privacy@manifestwell.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
