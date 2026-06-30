import { 
  HelpCircle, 
  BookOpen, 
  MapPin, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Activity, 
  Sparkles,
  Bot
} from "lucide-react";
import GlassCard from "./GlassCard";

export default function AboutHelp() {
  const faqs = [
    {
      q: "How does the AI image analysis work?",
      a: "When you drag or select a photo of a civic issue, our background server securely routes the image to Google Gemini. Gemini acts as an expert visual civic analyst, instantly extracting a title, description, category, and severity level, routing it to the appropriate department with high confidence."
    },
    {
      q: "Is my GPS coordinate stored securely?",
      a: "Yes. When you click 'Detect via GPS', your latitude and longitude coordinates are fetched locally on your browser and stored in our local sqlite-backed database. It is used strictly to plot markers on the Civic Map so city crews can locate the problem."
    },
    {
      q: "Who handles the complaints?",
      a: "Complaints are automatically routed based on their category. For example, Potholes go to the Public Works Department, Water leakages go to the Water Department, and overflowing garbage bins go to the Municipal Corporation."
    },
    {
      q: "How can I download the formal AI petition letter?",
      a: "Navigate to the Complaint Feed, select your complaint from the left, scroll down to the 'AI-Generated Formal Complaint Letter' section, and click generate. You can then download it as a text file or print/save as PDF instantly."
    }
  ];

  return (
    <div className="space-y-8 animate-fade-in text-left max-w-4xl mx-auto">
      <div>
        <h2 className="font-display font-bold text-2xl sm:text-3xl text-slate-800">Help & Civic Handbook</h2>
        <p className="text-sm text-slate-500 mt-1 leading-relaxed">
          Learn how to make the most of Community Hero AI. Discover how our Gemini API integration helps accelerate local civic issue resolutions.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Guides List */}
        <div className="md:col-span-2 space-y-6">
          <GlassCard className="border-slate-100 space-y-4">
            <h3 className="font-display font-bold text-base text-slate-800 flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-sky-600" />
              <span>Platform FAQs</span>
            </h3>

            <div className="divide-y divide-slate-100 space-y-4">
              {faqs.map((faq, idx) => (
                <div key={idx} className="pt-4 first:pt-0">
                  <h4 className="text-sm font-semibold text-slate-800 flex items-start space-x-2">
                    <HelpCircle className="w-4 h-4 shrink-0 text-sky-600 mt-0.5" />
                    <span>{faq.q}</span>
                  </h4>
                  <p className="text-xs text-slate-600 mt-2 leading-relaxed pl-6 font-sans">
                    {faq.a}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* About core vision */}
          <GlassCard className="border-slate-100 space-y-3.5">
            <h3 className="font-display font-bold text-base text-slate-800 flex items-center space-x-2">
              <ShieldCheck className="w-5 h-5 text-emerald-600 animate-pulse" />
              <span>Our Vision</span>
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed font-sans">
              <strong>Community Hero AI</strong> is built on the belief that smart cities start with engaged, empowered citizens. Traditional municipal portals are slow, opaque, and hard to track. By pairing browser GPS APIs with multi-modal Gemini AI modeling, we automate the painful friction of reporting. We provide transparent workflow logs (Pending → In Progress → Resolved) so citizens can hold authorities accountable, promoting clean, high-resolution neighborhoods.
            </p>
          </GlassCard>
        </div>

        {/* Side Contact card */}
        <div className="space-y-6">
          <GlassCard className="border-slate-100 space-y-5">
            <h3 className="font-display font-bold text-base text-slate-800">Emergency Support</h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              For hazard/emergency situations such as fallen high-voltage transformers or severe gas leaks, please contact physical emergency hotlines immediately.
            </p>

            <div className="space-y-3.5 text-xs text-slate-600 pt-3 border-t border-slate-100">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-sky-600">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">24/7 Citizen helpline</p>
                  <p className="font-semibold text-slate-800 mt-0.5">1-800-CIVIC-HERO</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-emerald-600">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">Official Municipal Email</p>
                  <p className="font-semibold text-slate-800 mt-0.5">helpdesk@citygov.org</p>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-indigo-600">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-[10px] uppercase font-mono text-slate-400">City Hall Location</p>
                  <p className="font-semibold text-slate-800 mt-0.5">300 City Hall Dr, Suite A</p>
                </div>
              </div>
            </div>
          </GlassCard>

          <GlassCard className="bg-gradient-to-br from-sky-50 to-indigo-50/20 border border-sky-100 p-5 space-y-3">
            <h4 className="font-display font-bold text-sm text-sky-600 flex items-center space-x-1.5">
              <Bot className="w-4.5 h-4.5 animate-bounce" />
              <span>Interact with AI</span>
            </h4>
            <p className="text-[11px] text-slate-600 leading-relaxed font-sans">
              Still have questions? Click the floating chatbot badge on the bottom right of the screen at any time to consult **HeroBot** for instant, localized feedback!
            </p>
          </GlassCard>
        </div>
      </div>
    </div>
  );
}
