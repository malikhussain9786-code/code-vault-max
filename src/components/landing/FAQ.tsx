import { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const FAQS = [
  {
    question: 'Does the code actually run, or does the AI just read it?',
    answer:
      "The AI reads and analyzes your code — it doesn't execute it. That means error detection is the AI's best judgment from reading the code closely, similar to a thorough code review, not a confirmed compiler or runtime result.",
  },
  {
    question: 'Do I need an account to use it?',
    answer:
      'Yes — your snippets and projects are tied to your account with secure authentication, so your work is private and persists across sessions.',
  },
  {
    question: 'Is the AI assistant required to use the platform?',
    answer:
      'No. The editor, snippet vault, projects, and search all work fully without AI. The AI layer is an optional add-on for explaining code, finding likely issues, suggesting fixes, and generating docs.',
  },
  {
    question: 'Which languages does the editor support?',
    answer:
      'Real syntax highlighting for Python, JavaScript, TypeScript, Java, C, C++, C#, Go, PHP, Ruby, SQL, and Bash, with the same set available for AI-powered code review.',
  },
  {
    question: 'Is my code private?',
    answer:
      'By default, yes — snippets are private to your account. You can choose to make individual snippets public or share them via a link when you want to.',
  },
];

function FaqItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-border-subtle">
      <button
        onClick={() => setOpen((v) => !v)}
        className="w-full flex items-center justify-between gap-4 py-5 text-left"
        aria-expanded={open}
      >
        <span className="font-medium text-text-primary">{question}</span>
        <ChevronDown
          size={18}
          className={`shrink-0 text-text-muted transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
        />
      </button>
      {open && <p className="pb-5 text-sm text-text-muted leading-relaxed max-w-2xl">{answer}</p>}
    </div>
  );
}

export function FAQ() {
  return (
    <section id="faq" className="max-w-3xl mx-auto px-6 py-20 lg:py-28 border-t border-border-subtle">
      <h2 className="font-display font-bold text-3xl sm:text-4xl tracking-tight text-text-primary text-center">
        Frequently asked questions
      </h2>
      <div className="mt-10">
        {FAQS.map((faq) => (
          <FaqItem key={faq.question} question={faq.question} answer={faq.answer} />
        ))}
      </div>
    </section>
  );
}
