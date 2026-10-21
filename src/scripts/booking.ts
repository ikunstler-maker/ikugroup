/** Call-request form delivery + booking modal. */
import { contacts, form as formConfig } from '../config/site';

type Payload = {
  name: string;
  company: string;
  contact: string;
  channel: string;
  objectives: string;
  context: string;
};

export function initBooking() {
  const dialog = document.querySelector<HTMLDialogElement>('[data-booking]');
  if (!dialog) return;
  let trigger: HTMLElement | null = null;

  document.addEventListener('click', (e) => {
    const el = (e.target as Element).closest<HTMLElement>('[data-open-booking]');
    if (!el) return;
    e.preventDefault();
    trigger = el;

    if (typeof dialog.showModal !== 'function') {
      document.getElementById('contact')?.scrollIntoView();
      return;
    }
    prefill(dialog, el.dataset.objective, el.dataset.context);
    dialog.showModal();
  });

  dialog.querySelector('[data-close-booking]')?.addEventListener('click', () => dialog.close());
  // Click on the backdrop (the dialog box itself, outside its content) closes it.
  dialog.addEventListener('click', (e) => e.target === dialog && dialog.close());
  dialog.addEventListener('close', () => trigger?.focus({ preventScroll: true }));
}

function prefill(dialog: HTMLDialogElement, objective?: string, context?: string) {
  const form = dialog.querySelector<HTMLFormElement>('[data-call-form]');
  if (!form) return;
  if (objective) {
    form.querySelectorAll<HTMLInputElement>('input[name="objective"]').forEach((i) => {
      if (i.dataset.objectiveId === objective) i.checked = true;
    });
  }
  const ta = form.querySelector<HTMLTextAreaElement>('textarea[name="context"]');
  if (context && ta && !ta.value.trim()) ta.value = context;
}

export function initForms() {
  document.querySelectorAll<HTMLElement>('[data-form-root]').forEach(setupForm);
}

function setupForm(root: HTMLElement) {
  const form = root.querySelector<HTMLFormElement>('[data-call-form]')!;
  const result = root.querySelector<HTMLElement>('[data-form-result]')!;
  const sent = result.querySelector<HTMLElement>('[data-result-sent]')!;
  const handoff = result.querySelector<HTMLElement>('[data-result-handoff]')!;
  const errorEl = form.querySelector<HTMLElement>('[data-form-error]')!;
  const submit = form.querySelector<HTMLButtonElement>('[data-submit]')!;
  const submitLabel = form.querySelector<HTMLElement>('[data-submit-label]')!;
  const resetBtn = result.querySelector<HTMLButtonElement>('[data-form-reset]')!;
  const required = ['name', 'contact'].map((n) => form.elements.namedItem(n) as HTMLInputElement);
  let message = '';
  let state: 'form' | 'sent' | 'handoff' = 'form';

  const setError = (text: string) => {
    errorEl.textContent = text;
    errorEl.classList.toggle('hidden', !text);
  };

  const show = (next: typeof state, channel = '') => {
    state = next;
    form.classList.toggle('hidden', next !== 'form');
    result.classList.toggle('hidden', next === 'form');
    sent.classList.toggle('hidden', next !== 'sent');
    handoff.classList.toggle('hidden', next !== 'handoff');
    resetBtn.textContent = next === 'sent' ? '← Send another request' : '← Edit request';
    if (next === 'sent') result.querySelector('[data-result-channel]')!.textContent = channel || 'your preferred channel';
    if (next === 'handoff') wireHandoff();
    if (next !== 'form') result.focus({ preventScroll: true });
  };

  const wireHandoff = () => {
    const text = encodeURIComponent(message);
    handoff.querySelector<HTMLAnchorElement>('[data-handoff="whatsapp"]')!.href = `${contacts.whatsapp}?text=${text}`;
    handoff.querySelector<HTMLAnchorElement>('[data-handoff="email"]')!.href =
      `mailto:${contacts.email}?subject=${encodeURIComponent('Call request — ikunstler.com')}&body=${text}`;
  };

  handoff.querySelector('[data-handoff="telegram"]')?.addEventListener('click', () => {
    navigator.clipboard?.writeText(message).then(
      () => handoff.querySelector('[data-copied]')?.classList.remove('hidden'),
      () => {},
    );
  });

  resetBtn.addEventListener('click', () => {
    show('form');
    required[0].focus();
  });

  // Reopening the modal after a successful send starts with a fresh form.
  root.closest('dialog')?.addEventListener('close', () => state === 'sent' && show('form'));

  required.forEach((input) =>
    input.addEventListener('input', () => {
      if (input.value.trim()) input.removeAttribute('aria-invalid');
    }),
  );

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    if (String(data.get('website_url') ?? '')) return; // honeypot

    const missing = required.filter((i) => !i.value.trim());
    required.forEach((i) => (missing.includes(i) ? i.setAttribute('aria-invalid', 'true') : i.removeAttribute('aria-invalid')));
    if (missing.length) {
      setError('Please add your name and a way to reach you.');
      missing[0].focus();
      return;
    }
    setError('');

    const payload: Payload = {
      name: String(data.get('name')).trim(),
      company: String(data.get('company') ?? '').trim(),
      contact: String(data.get('contact')).trim(),
      channel: String(data.get('channel') ?? ''),
      objectives: data.getAll('objective').join(', '),
      context: String(data.get('context') ?? '').trim(),
    };
    message = compose(payload);

    if (!formConfig.endpoint) {
      show('handoff');
      return;
    }

    submit.disabled = true;
    submitLabel.textContent = 'Sending…';
    try {
      const res = await fetch(formConfig.endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...payload,
          subject: `Call request — ${payload.name}`,
          from_name: 'ikunstler.com',
          ...(formConfig.accessKey ? { access_key: formConfig.accessKey } : {}),
        }),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      form.reset();
      show('sent', payload.channel);
    } catch {
      // Delivery failed — never lose the lead: fall back to one-tap messaging.
      show('handoff');
    } finally {
      submit.disabled = false;
      submitLabel.textContent = 'Request a Strategy Call';
    }
  });
}

function compose(p: Payload) {
  const lines = [
    `Name & role: ${p.name}`,
    p.company && `Company: ${p.company}`,
    `Contact: ${p.contact}`,
    p.channel && `Preferred channel: ${p.channel}`,
    p.objectives && `Objective: ${p.objectives}`,
    p.context && `Context: ${p.context}`,
  ].filter(Boolean);
  return `Hello Elijah — call request via ikunstler.com\n\n${lines.join('\n')}`;
}
