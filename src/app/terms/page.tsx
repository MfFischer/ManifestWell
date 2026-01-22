import { Metadata } from 'next'
import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export const metadata: Metadata = {
    title: 'Terms of Service - ManifestWell',
    description: 'Terms of Service for ManifestWell wellness app.',
}

export default function TermsOfService() {
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
                    Terms of Service
                </h1>

                <div className="prose prose-lg dark:prose-invert max-w-none">
                    <p className="text-slate-600 dark:text-slate-300 text-lg mb-8">
                        <strong>Last Updated:</strong> January 15, 2026
                    </p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            1. Acceptance of Terms
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            By downloading, installing, or using ManifestWell ("the App"), you agree to be bound by these
                            Terms of Service ("Terms"). If you do not agree to these Terms, please do not use the App.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            2. Description of Service
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            ManifestWell is a holistic wellness tracking application that provides tools for:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Nutrition and meal tracking</li>
                            <li>Fitness and workout logging</li>
                            <li>Guided meditation sessions</li>
                            <li>Manifestation and visualization practices</li>
                            <li>Personal journaling</li>
                            <li>Goal setting and progress tracking</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            3. License Grant
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Subject to your compliance with these Terms, we grant you a limited, non-exclusive,
                            non-transferable, revocable license to download, install, and use the App for your
                            personal, non-commercial purposes on devices you own or control.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            4. User Responsibilities
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            You agree to:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Use the App only for lawful purposes</li>
                            <li>Not attempt to reverse engineer, decompile, or disassemble the App</li>
                            <li>Not copy, modify, or distribute the App or any part of it</li>
                            <li>Not use the App in any way that could damage or impair the App</li>
                            <li>Maintain the security of your device</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            5. Health and Medical Disclaimer
                        </h2>
                        <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4 mb-4">
                            <p className="text-yellow-800 dark:text-yellow-200 font-medium">
                                Important: ManifestWell is not a medical application.
                            </p>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 mb-4">
                            The App is designed for general wellness tracking and personal development purposes only.
                            It is not intended to:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Diagnose, treat, cure, or prevent any disease or medical condition</li>
                            <li>Replace professional medical advice, diagnosis, or treatment</li>
                            <li>Provide medical, nutritional, or fitness advice from a qualified professional</li>
                        </ul>
                        <p className="text-slate-600 dark:text-slate-300 mt-4">
                            Always consult with qualified healthcare professionals before starting any diet, exercise,
                            or wellness program. If you experience any health concerns, seek medical attention immediately.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            6. Intellectual Property
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            All content, features, and functionality of the App, including but not limited to text,
                            graphics, logos, icons, images, audio clips, and software, are the exclusive property of
                            ManifestWell and are protected by international copyright, trademark, and other intellectual
                            property laws.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            7. Third-Party Content
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            The App may include embedded videos from YouTube and other third-party content. We do not
                            control and are not responsible for the content, privacy policies, or practices of any
                            third-party services. Your use of such content is subject to the respective third party's
                            terms and conditions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            8. Limitation of Liability
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            To the maximum extent permitted by applicable law, ManifestWell and its developers shall
                            not be liable for any indirect, incidental, special, consequential, or punitive damages,
                            or any loss of profits or revenues, whether incurred directly or indirectly, or any loss
                            of data, use, goodwill, or other intangible losses resulting from your use of the App.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            9. Disclaimer of Warranties
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            The App is provided "as is" and "as available" without warranties of any kind, either
                            express or implied. We do not warrant that the App will be uninterrupted, error-free,
                            or free of harmful components.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            10. Data Responsibility
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            Since all data is stored locally on your device, you are solely responsible for:
                        </p>
                        <ul className="list-disc pl-6 text-slate-600 dark:text-slate-300 space-y-2">
                            <li>Backing up your data to prevent loss</li>
                            <li>Securing your device to prevent unauthorized access</li>
                            <li>Any data loss resulting from device failure, loss, or theft</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            11. Termination
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            You may terminate your use of the App at any time by uninstalling it from your device.
                            We reserve the right to terminate or suspend access to the App at any time, without
                            prior notice, for conduct that we believe violates these Terms or is harmful to other
                            users, us, or third parties, or for any other reason.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            12. Changes to Terms
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            We reserve the right to modify these Terms at any time. Changes will be effective
                            immediately upon posting. Your continued use of the App after changes are posted
                            constitutes your acceptance of the modified Terms.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            13. Governing Law
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            These Terms shall be governed by and construed in accordance with the laws of the
                            jurisdiction in which the App developer is located, without regard to its conflict
                            of law provisions.
                        </p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
                            14. Contact Information
                        </h2>
                        <p className="text-slate-600 dark:text-slate-300">
                            If you have any questions about these Terms, please contact us at:
                        </p>
                        <p className="text-slate-600 dark:text-slate-300 mt-2">
                            <strong>Email:</strong> legal@manifestwell.com
                        </p>
                    </section>
                </div>
            </div>
        </div>
    )
}
