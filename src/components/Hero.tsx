import * as React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { keyframes } from '@emotion/react';
import { useTranslation } from 'react-i18next';
import { useLangPath } from '../i18n/useLang';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import SendIcon from '@mui/icons-material/Send';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BugReportOutlinedIcon from '@mui/icons-material/BugReportOutlined';
import AutorenewOutlinedIcon from '@mui/icons-material/AutorenewOutlined';

// ─── Keyframes ────────────────────────────────────────────────────────────────

const floatCard = keyframes`
  0%,100% { transform: translateY(0px); }
  50%      { transform: translateY(-8px); }
`;

const orbDrift1 = keyframes`
  0%,100% { transform: translate(0%,0%) scale(1);       }
  40%      { transform: translate(20%,-16%) scale(1.16); }
  72%      { transform: translate(-10%,14%) scale(0.88); }
`;

const orbDrift2 = keyframes`
  0%,100% { transform: translate(0%,0%) scale(1);       }
  45%      { transform: translate(-15%,12%) scale(1.12); }
  70%      { transform: translate(12%,-8%) scale(0.92);  }
`;

const shimmerSweep = keyframes`
  0%   { background-position: -220% center; }
  65%  { background-position: 220% center; }
  100% { background-position: 220% center; }
`;

// ─── Hero Chat Simulation ───────────────────────────────────────────────────

type RichComponent = 'nameplate-result' | 'bar-chart' | 'issue-form' | 'pdf-preview';

interface ChatTurn {
  userText: string;
  userAttachment?: { name: string; imgSrc?: string };
  assistantText: string;
  assistantComponent?: RichComponent;
  thinkingLabel?: string;
}

// Supplementary non-translatable data (attachments + rich components) indexed by turn position
const CHAT_TURN_SUPPLEMENTS: Pick<ChatTurn, 'userAttachment' | 'assistantComponent'>[] = [
  {},
  {},
  {},
  {},
  { userAttachment: { name: 'nameplate.jpg', imgSrc: '/images/nameplate.jpg' }, assistantComponent: 'nameplate-result' },
  { assistantComponent: 'bar-chart' },
  { assistantComponent: 'issue-form' },
  { assistantComponent: 'pdf-preview' },
];

// ── Rich component renderers ────────────────────────────────────────────────

function NameplateResult() {
  const { t } = useTranslation('home');
  const fields = [
    { label: t('hero.nameplate.voltage'), old: '208VAC', val: '"208VAC"', conf: 95 },
    { label: t('hero.nameplate.serialNo'), old: '06-7M71593-01', val: '"06-7M71593-01"', conf: 95 },
    { label: t('hero.nameplate.power'), old: '50.2kVA', val: '"50.2kVA"', conf: 95 },
  ];
  return (
    <Box sx={{ mt: 0.8, borderRadius: 2, bgcolor: '#12151a', border: '1px solid rgba(255,255,255,0.1)', p: 1.5, fontSize: '0.7rem' }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.72rem', mb: 0.8 }}>{t('hero.nameplate.applied')}</Typography>
      {fields.map((f) => (
        <Box key={f.label} sx={{ display: 'flex', alignItems: 'center', gap: 0.6, mb: 0.4 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.68rem', minWidth: 60 }}>{f.label}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', textDecoration: 'line-through' }}>{f.old}</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem' }}>←</Typography>
          <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.68rem' }}>{f.val}</Typography>
          <Box sx={{ ml: 'auto', bgcolor: 'rgba(255,255,255,0.08)', borderRadius: 0.8, px: 0.6, py: 0.1 }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.6rem' }}>{f.conf}%</Typography>
          </Box>
        </Box>
      ))}
    </Box>
  );
}

function MiniBarChart() {
  const { t } = useTranslation('home');
  const bars = [
    { label: 'medium', open: 7, closed: 1, color: '#4da6ff' },
    { label: 'low',    open: 1, closed: 0, color: '#4da6ff' },
    { label: 'high',   open: 0, closed: 0, color: '#4da6ff' },
  ];
  const maxVal = 8;
  return (
    <Box sx={{ mt: 0.8, borderRadius: 2, bgcolor: '#161b22', border: '1px solid rgba(77,166,255,0.18)', p: 1.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.72rem' }}>{t('hero.barChart.title')}</Typography>
      <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.62rem', mb: 1 }}>{t('hero.barChart.subtitle')}</Typography>
      <Box sx={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 60, px: 0.5 }}>
        {bars.map((b) => (
          <Box key={b.label} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1 }}>
            <Box sx={{ width: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', height: 48 }}>
              <Box
                sx={{
                  width: '100%',
                  height: `${((b.open + b.closed) / maxVal) * 48}px`,
                  bgcolor: b.color,
                  borderRadius: '3px 3px 0 0',
                  opacity: b.open + b.closed === 0 ? 0.15 : 1,
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {b.closed > 0 && (
                  <Box sx={{ position: 'absolute', bottom: 0, width: '100%', height: `${(b.closed / (b.open + b.closed)) * 100}%`, bgcolor: 'rgba(77,166,255,0.35)' }} />
                )}
              </Box>
            </Box>
            <Typography sx={{ color: 'rgba(255,255,255,0.45)', fontSize: '0.6rem', mt: 0.4 }}>{b.label}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function IssueForm() {
  const { t } = useTranslation('home');
  return (
    <Box sx={{ mt: 0.8, borderRadius: 2, bgcolor: '#12151a', border: '1px solid rgba(255,255,255,0.1)', p: 1.5 }}>
      <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', mb: 0.8 }}>{t('hero.issueForm.editing')}</Typography>
      {[
        { label: t('hero.issueForm.titleLabel'), value: 'TX45 temperature sensor broken' },
        { label: t('hero.issueForm.descriptionLabel'), value: 'Broken temperature sensor on TX45. Please replace and verify.' },
        { label: t('hero.issueForm.assignedToLabel'), value: t('hero.issueForm.unassigned'), italic: true },
      ].map((f) => (
        <Box key={f.label} sx={{ mb: 0.7 }}>
          <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.67rem' }}>{f.label}</Typography>
          <Typography sx={{ color: f.italic ? 'rgba(255,255,255,0.4)' : 'rgba(255,255,255,0.65)', fontSize: '0.67rem', fontStyle: f.italic ? 'italic' : 'normal', mt: 0.1 }}>
            {f.value}
          </Typography>
        </Box>
      ))}
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, mt: 0.4 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.9)', fontWeight: 700, fontSize: '0.67rem' }}>{t('hero.issueForm.statusLabel')}</Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 7, height: 7, borderRadius: '50%', bgcolor: '#4da6ff' }} />
          <Typography sx={{ color: '#4da6ff', fontSize: '0.67rem' }}>{t('hero.issueForm.open')}</Typography>
        </Box>
      </Box>
      <Box sx={{ display: 'flex', gap: 0.5, mt: 1, flexWrap: 'wrap' }}>
        {[t('hero.issueForm.assignAction'), t('hero.issueForm.closeAction')].map((a) => (
          <Box key={a} sx={{ border: '1px solid rgba(255,255,255,0.2)', borderRadius: 20, px: 1, py: 0.3, cursor: 'default' }}>
            <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.6rem' }}>{a}</Typography>
          </Box>
        ))}
      </Box>
    </Box>
  );
}

function PdfPreview() {
  return (
    <Box sx={{ mt: 0.8, borderRadius: 2, bgcolor: '#1a1a1a', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden' }}>
      {/* Toolbar */}
      <Box sx={{ bgcolor: '#2a2a2a', px: 1.5, py: 0.7, display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
        {['⬇', '🖨', '⋮'].map((icon) => (
          <Typography key={icon} sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.65rem', cursor: 'default' }}>{icon}</Typography>
        ))}
      </Box>
      {/* Fake document body */}
      <Box sx={{ bgcolor: '#fff', p: 1.5, mx: 1, my: 0.8, borderRadius: 1 }}>
        <Typography sx={{ color: '#222', fontSize: '0.58rem', fontWeight: 700, mb: 0.3 }}>INFORME DE ENSAYO</Typography>
        <Typography sx={{ color: '#555', fontSize: '0.55rem', mb: 0.2 }}>Equipo: FARADAY - T-AU-4-00001</Typography>
        <Typography sx={{ color: '#555', fontSize: '0.55rem', mb: 0.2 }}>Componente: RBC</Typography>
        <Box sx={{ mt: 0.6, border: '1px solid #e0e0e0', borderRadius: 0.5, p: 0.6, display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Typography sx={{ color: '#333', fontSize: '0.55rem', fontWeight: 700 }}>CÓDIGO DE ESTADO GENERAL:</Typography>
          <Box sx={{ bgcolor: '#fff3cd', borderRadius: 0.4, px: 0.5 }}>
            <Typography sx={{ color: '#856404', fontSize: '0.52rem', fontWeight: 700 }}>REGULAR ⚠</Typography>
          </Box>
        </Box>
      </Box>
      {/* Footer label */}
      <Box sx={{ px: 1.5, pb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
        <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.58rem' }}>📄 file-1770108567078.pdf</Typography>
        <Box sx={{ bgcolor: '#856404', borderRadius: 1, px: 0.7 }}>
          <Typography sx={{ color: '#fff', fontSize: '0.55rem' }}>Pending</Typography>
        </Box>
      </Box>
    </Box>
  );
}

function RichContent({ component }: { component: RichComponent }) {
  if (component === 'nameplate-result') return <NameplateResult />;
  if (component === 'bar-chart') return <MiniBarChart />;
  if (component === 'issue-form') return <IssueForm />;
  if (component === 'pdf-preview') return <PdfPreview />;
  return null;
}

// ── Chat message type ────────────────────────────────────────────────────────
interface ChatMessage {
  role: 'user' | 'assistant';
  text: string;
  attachment?: { name: string; imgSrc?: string };
  component?: RichComponent;
}

const INPUT_TYPING_SPEED = 42;   // ms per char
const SEND_DELAY        = 380;   // pause before message appears
const THINKING_DURATION = 1400;  // assistant "thinking" duration
const BETWEEN_TURNS     = 700;   // pause between full turns

type ChatPhase = 'typing-input' | 'sending' | 'thinking' | 'showing-reply' | 'between' | 'done';

export function HeroChatCard() {
  const { t } = useTranslation('home');
  const chatTurnsI18n = t('hero.chatTurns', { returnObjects: true }) as Array<{ userText: string; assistantText: string; thinkingLabel: string }>;
  const CHAT_TURNS: ChatTurn[] = chatTurnsI18n.map((turn, i) => ({
    ...turn,
    ...CHAT_TURN_SUPPLEMENTS[i],
  }));
  const [turnIndex, setTurnIndex]       = React.useState(0);
  const [chatPhase, setChatPhase]       = React.useState<ChatPhase>('typing-input');
  const [inputText, setInputText]       = React.useState('');
  const GREETING: ChatMessage[] = [{ role: 'assistant', text: t('hero.chat.greeting') }];
  const [messages, setMessages]         = React.useState<ChatMessage[]>(GREETING);
  const [isThinking, setIsThinking]     = React.useState(false);
  const [thinkingLabel, setThinkingLabel] = React.useState('Thinking…');
  const scrollRef = React.useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom whenever messages or thinking state changes
  React.useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages, isThinking]);

  React.useEffect(() => {
    if (turnIndex >= CHAT_TURNS.length) {
      // All done — restart after a long pause
      const id = setTimeout(() => {
        setMessages(GREETING);
        setInputText('');
        setTurnIndex(0);
        setChatPhase('typing-input');
      }, 3200);
      return () => clearTimeout(id);
    }

    const turn = CHAT_TURNS[turnIndex];

    if (chatPhase === 'typing-input') {
      if (inputText.length < turn.userText.length) {
        const id = setTimeout(
          () => setInputText(turn.userText.slice(0, inputText.length + 1)),
          INPUT_TYPING_SPEED,
        );
        return () => clearTimeout(id);
      } else {
        const id = setTimeout(() => setChatPhase('sending'), SEND_DELAY);
        return () => clearTimeout(id);
      }
    }

    if (chatPhase === 'sending') {
      setMessages((prev) => [
        ...prev,
        { role: 'user', text: turn.userText, attachment: turn.userAttachment },
      ]);
      setInputText('');
      setThinkingLabel(turn.thinkingLabel ?? 'Thinking…');
      setIsThinking(true);
      setChatPhase('thinking');
    }

    if (chatPhase === 'thinking') {
      const id = setTimeout(() => {
        setIsThinking(false);
        setChatPhase('showing-reply');
      }, THINKING_DURATION);
      return () => clearTimeout(id);
    }

    if (chatPhase === 'showing-reply') {
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', text: turn.assistantText, component: turn.assistantComponent },
      ]);
      setChatPhase('between');
    }

    if (chatPhase === 'between') {
      const id = setTimeout(() => {
        setTurnIndex((t) => t + 1);
        setChatPhase('typing-input');
      }, BETWEEN_TURNS);
      return () => clearTimeout(id);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatPhase, inputText, turnIndex]);

  return (
    <Box
      sx={{
        position: 'relative',
        animation: `${floatCard} 5.5s ease-in-out infinite`,
        borderRadius: '22px',
        background: 'rgba(23,23,23,0.97)',
        border: '1px solid rgba(255,255,255,0.07)',
        boxShadow: '0 16px 48px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.04)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
        height: 520,
        width: '100%',
        maxWidth: 440,
        mx: 'auto',
      }}
    >
      {/* Top edge highlight */}
      <Box sx={{ position: 'absolute', top: 0, left: 0, right: 0, height: '1.5px', background: 'linear-gradient(90deg, transparent, rgba(180,255,150,0.45) 30%, rgba(220,255,180,0.85) 50%, rgba(180,255,150,0.45) 70%, transparent 100%)', zIndex: 4, pointerEvents: 'none' }} />
      {/* Ambient orbs */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box sx={{ position: 'absolute', top: '-35%', left: '-20%', width: '65%', height: '65%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(180,255,80,0.06) 0%, rgba(140,220,50,0.02) 45%, transparent 70%)', filter: 'blur(42px)', animation: `${orbDrift1} 9s ease-in-out infinite` }} />
        <Box sx={{ position: 'absolute', bottom: '-18%', right: '-15%', width: '52%', height: '52%', borderRadius: '50%', background: 'radial-gradient(circle, rgba(210,255,120,0.04) 0%, transparent 70%)', filter: 'blur(34px)', animation: `${orbDrift2} 12s ease-in-out infinite` }} />
      </Box>
      {/* ── Header bar ── */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: 2.5,
          py: 1.5,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0f0f0f',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Traffic-light dots */}
        <Box sx={{ display: 'flex', gap: 0.6 }}>
          {['#ff5f57','#febc2e','#28c840'].map((c) => (
            <Box key={c} sx={{ width: 10, height: 10, borderRadius: '50%', bgcolor: c, opacity: 0.85 }} />
          ))}
        </Box>
        <Box sx={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Box
            component="img"
            src="/icon.svg"
            alt="Cx Assistant"
            sx={{ height: 22, width: 'auto' }}
          />
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: '#28c840' }} />
          <Typography sx={{ color: 'rgba(255,255,255,0.35)', fontSize: '0.68rem' }}>{t('hero.chat.online')}</Typography>
        </Box>
      </Box>

      {/* ── Message list ── */}
      <Box
        ref={scrollRef}
        sx={{
          flex: 1,
          overflowY: 'auto',
          px: 2,
          py: 1.5,
          display: 'flex',
          flexDirection: 'column',
          gap: 1.2,
          scrollBehavior: 'smooth',
          position: 'relative',
          zIndex: 1,
          '&::-webkit-scrollbar': { width: 4 },
          '&::-webkit-scrollbar-track': { background: 'transparent' },
          '&::-webkit-scrollbar-thumb': { background: 'rgba(255,255,255,0.1)', borderRadius: 4 },
        }}
      >
        {messages.map((msg, i) => (
          <Box
            key={i}
            sx={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'heroChatFadeUp 0.3s ease both',
              '@keyframes heroChatFadeUp': {
                from: { opacity: 0, transform: 'translateY(6px)' },
                to:   { opacity: 1, transform: 'translateY(0)' },
              },
            }}
          >
            <Box sx={{ maxWidth: '82%', display: 'flex', flexDirection: 'column', alignItems: msg.role === 'user' ? 'flex-end' : 'flex-start' }}>
              {/* Attachment bubble (user only) */}
              {msg.attachment && (
                <Box
                  sx={{
                    mb: 0.5,
                    px: 1.2, py: 0.8,
                    borderRadius: '10px 10px 10px 10px',
                    backgroundColor: '#23262a',
                    border: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex', alignItems: 'center', gap: 0.8,
                  }}
                >
                  <Box sx={{ width: 36, height: 36, borderRadius: 1, bgcolor: '#333', overflow: 'hidden', flexShrink: 0 }}>
                    {msg.attachment.imgSrc ? (
                      <Box component="img" src={msg.attachment.imgSrc} alt="attachment" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <Box sx={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem' }}>📷</Box>
                    )}
                  </Box>
                  <Typography sx={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.65rem' }}>{msg.attachment.name}</Typography>
                </Box>
              )}
              {/* Message */}
              {msg.role === 'user' ? (
                <Box
                  sx={{
                    px: 1.8, py: 1.1,
                    borderRadius: '14px 14px 4px 14px',
                    backgroundColor: '#1c2128',
                    border: '1px solid rgba(255,255,255,0.08)',
                  }}
                >
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.75)',
                      fontSize: '0.78rem',
                      fontFamily: "'Roboto', sans-serif",
                      lineHeight: 1.6,
                    }}
                  >
                    {msg.text}
                  </Typography>
                </Box>
              ) : (
                <Box sx={{ py: 0.3 }}>
                  <Typography
                    sx={{
                      color: 'rgba(255,255,255,0.88)',
                      fontSize: '0.78rem',
                      fontFamily: "'Roboto', sans-serif",
                      lineHeight: 1.6,
                      whiteSpace: 'pre-line',
                    }}
                  >
                    {msg.text}
                  </Typography>
                  {msg.component && <RichContent component={msg.component} />}
                </Box>
              )}
            </Box>
          </Box>
        ))}

        {/* Thinking indicator */}
        {isThinking && (
          <Box
            sx={{
              display: 'flex', alignItems: 'center', gap: 1,
              animation: 'heroChatFadeUp 0.25s ease both',
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.8, py: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.6 }}>
                {[0, 1, 2].map((d) => (
                  <Box
                    key={d}
                    sx={{
                      width: 6, height: 6, borderRadius: '50%',
                      bgcolor: 'rgba(220,255,182,0.7)',
                      animation: `heroDot 1.1s ease-in-out ${d * 0.18}s infinite`,
                      '@keyframes heroDot': {
                        '0%,80%,100%': { transform: 'scale(0.55)', opacity: 0.4 },
                        '40%': { transform: 'scale(1)', opacity: 1 },
                      },
                    }}
                  />
                ))}
              </Box>
              <Typography sx={{ color: 'rgba(220,255,182,0.55)', fontSize: '0.65rem' }}>{thinkingLabel}</Typography>
            </Box>
          </Box>
        )}
      </Box>

      {/* ── Input bar ── */}
      <Box
        sx={{
          px: 2, py: 1.5,
          borderTop: '1px solid rgba(255,255,255,0.06)',
          backgroundColor: '#0f0f0f',
          flexShrink: 0,
          position: 'relative',
          zIndex: 1,
        }}
      >
        {/* Attachment preview strip (shown only while typing, disappears on send) */}
        {turnIndex < CHAT_TURNS.length && CHAT_TURNS[turnIndex].userAttachment && chatPhase === 'typing-input' && (
          <Box sx={{ mb: 0.8, display: 'flex', alignItems: 'center', gap: 0.8 }}>
            <Box sx={{ width: 36, height: 36, borderRadius: 1.2, bgcolor: '#2a2d2f', border: '1px solid rgba(255,255,255,0.1)', overflow: 'hidden', flexShrink: 0 }}>
              <Box component="img" src="/images/nameplate.jpg" alt="nameplate" sx={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </Box>
            <Box sx={{ flex: 1 }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.62rem' }}>{CHAT_TURNS[turnIndex].userAttachment!.name}</Typography>
            </Box>
            <Box sx={{ width: 14, height: 14, borderRadius: '50%', bgcolor: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'default' }}>
              <Typography sx={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.55rem', lineHeight: 1 }}>✕</Typography>
            </Box>
          </Box>
        )}
        <Box
          sx={{
            display: 'flex', alignItems: 'center', gap: 1,
            borderRadius: 2,
            border: '1px solid',
            borderColor: inputText ? 'rgba(220,255,182,0.22)' : 'rgba(255,255,255,0.08)',
            backgroundColor: '#1a1a1a',
            px: 1.8, py: 0.9,
            transition: 'border-color 0.2s',
          }}
        >
          <AttachFileIcon sx={{ color: 'rgba(255,255,255,0.3)', fontSize: '1rem', flexShrink: 0 }} />
          <Typography
            sx={{
              flex: 1,
              color: inputText ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.3)',
              fontSize: '0.78rem',
              fontFamily: "'Roboto', sans-serif",
              minHeight: '1.2em',
              letterSpacing: 0.1,
            }}
          >
            {inputText || t('hero.chat.inputPlaceholder')}
            {inputText && (
              <Box
                component="span"
                sx={{
                  display: 'inline-block',
                  width: '1.5px', height: '0.9em',
                  ml: '1px',
                  backgroundColor: '#DCFFB6',
                  animation: 'caretBlink 1s steps(2,start) infinite',
                  verticalAlign: '-0.05em',
                }}
              />
            )}
          </Typography>
          <Box
            sx={{
              width: 26, height: 26,
              borderRadius: 1.2,
              backgroundColor: inputText ? '#DCFFB6' : 'rgba(220,255,182,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: inputText ? '#111314' : 'rgba(220,255,182,0.4)',
              fontSize: '0.7rem',
              flexShrink: 0,
              transition: 'all 0.2s',
            }}
          >
            <SendIcon sx={{ fontSize: '0.8rem' }} />
          </Box>
        </Box>
        <Typography sx={{ color: 'rgba(255,255,255,0.2)', fontSize: '0.58rem', textAlign: 'center', mt: 0.6 }}>
          {t('hero.chat.disclaimer')}
        </Typography>
      </Box>
    </Box>
  );
}


// ─── Hero animated stat cards ─────────────────────────────────────────────────

/** Counts from 0 to `target` over `durationMs`, starting after `delayS` seconds. */
function useCountUp(target: number, durationMs: number, delayS: number) {
  const [count, setCount] = React.useState(0);
  React.useEffect(() => {
    let rafId: number;
    const timerId = setTimeout(() => {
      let startTs: number | null = null;
      const tick = (ts: number) => {
        if (!startTs) startTs = ts;
        const p = Math.min((ts - startTs) / durationMs, 1);
        // easeOutQuart
        const eased = 1 - Math.pow(1 - p, 4);
        setCount(Math.round(eased * target));
        if (p < 1) rafId = requestAnimationFrame(tick);
      };
      rafId = requestAnimationFrame(tick);
    }, delayS * 1000 + 300);
    return () => { clearTimeout(timerId); cancelAnimationFrame(rafId); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return count;
}

interface StatCardData {
  label: string;
  target: number;
  suffix: string;
  sub: string;
  Icon: React.ElementType;
  position: { top: string; left?: string; right?: string };
  floatDuration: number;
  floatDelay: number;
  entranceDelay: number;
}

const HERO_STAT_CARDS: StatCardData[] = [
  {
    label: 'TOTAL ASSETS',
    target: 237,
    suffix: '',
    sub: 'All tracked assets',
    Icon: Inventory2OutlinedIcon,
    position: { top: '13%', left: '6.6%' },
    floatDuration: 5.2,
    floatDelay: 0,
    entranceDelay: 0.9,
  },
  {
    label: 'TOTAL ISSUES',
    target: 1022,
    suffix: '',
    sub: 'Created in project',
    Icon: BugReportOutlinedIcon,
    position: { top: '13%', left: '36.2%' },
    floatDuration: 5.8,
    floatDelay: 0.85,
    entranceDelay: 1.1,
  },
  {
    label: 'OPEN ISSUES',
    target: 761,
    suffix: '',
    sub: 'Awaiting resolution',
    Icon: BugReportOutlinedIcon,
    position: { top: '32%', left: '6.6%' },
    floatDuration: 6.1,
    floatDelay: 0.4,
    entranceDelay: 1.3,
  },
  {
    label: 'COMPLETION RATE',
    target: 8,
    suffix: '%',
    sub: 'Avg. status flow progress',
    Icon: AutorenewOutlinedIcon,
    position: { top: '32%', left: '36.2%' },
    floatDuration: 5.5,
    floatDelay: 1.25,
    entranceDelay: 1.5,
  },
];

function HeroStatCard({ card }: { card: StatCardData }) {
  const count = useCountUp(card.target, 1600, card.entranceDelay);
  // Card is ~26% of the screenshot container (~76-84vw, capped at 920px).
  // All internal sizes use vw so they scale 1:1 with the card as the viewport changes.
  return (
    <motion.div
      initial={{ opacity: 0, y: 18, scale: 0.90 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.85, delay: card.entranceDelay, ease: [0.16, 1, 0.3, 1] }}
      style={{ position: 'absolute', width: '27.5%', ...card.position, zIndex: 6 }}
    >
      <Box
        sx={{
          animation: `heroCardFloat ${card.floatDuration}s ease-in-out ${card.floatDelay}s infinite`,
          '@keyframes heroCardFloat': {
            '0%,100%': { transform: 'translateY(0px)' },
            '50%': { transform: 'translateY(-8px)' },
          },
          position: 'relative',
          borderRadius: 'clamp(4px, 0.7vw, 10px)',
          overflow: 'hidden',
          bgcolor: 'rgba(23, 23, 23, 0.97)',
          border: '1px solid rgba(255,255,255,0.07)',
          boxShadow: '0 16px 48px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.04)',
          padding: 'clamp(5px, 0.85vw, 12px)',
          display: 'flex',
          flexDirection: 'column',
          gap: 'clamp(2px, 0.32vw, 4px)',
        }}
      >
        {/* Lime glow line on top */}
        <Box sx={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '2px',
          background: 'linear-gradient(90deg, transparent 0%, rgba(180,255,120,0.28) 25%, rgba(220,255,130,0.62) 50%, rgba(180,255,120,0.28) 75%, transparent 100%)',
          boxShadow: '0 0 4px rgba(200,255,120,0.28)',
          zIndex: 2,
        }} />

        {/* Label + icon row */}
        <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 'clamp(2px, 0.4vw, 5px)' }}>
          <Typography sx={{
            color: 'rgba(255,255,255,0.42)',
            fontSize: 'clamp(4px, 0.58vw, 7px)',
            letterSpacing: '0.09em',
            textTransform: 'uppercase',
            fontWeight: 600,
            lineHeight: 1.2,
          }}>
            {card.label}
          </Typography>
          <Box sx={{
            width: 'clamp(12px, 1.75vw, 22px)',
            height: 'clamp(12px, 1.75vw, 22px)',
            borderRadius: '50%',
            bgcolor: 'rgba(180,255,120,0.10)',
            border: '1px solid rgba(180,255,120,0.20)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <card.Icon sx={{ fontSize: 'clamp(6px, 0.88vw, 11px)', color: '#DCFFB6' }} />
          </Box>
        </Box>
        {/* Animated number */}
        <Typography sx={{
          color: '#fff',
          fontSize: 'clamp(9px, 1.72vw, 22px)',
          fontWeight: 800,
          lineHeight: 1,
          fontFamily: "'Space Grotesk', sans-serif",
          letterSpacing: '-0.02em',
          fontVariantNumeric: 'tabular-nums',
        }}>
          {count.toLocaleString()}{card.suffix}
        </Typography>
        {/* Subtitle */}
        <Typography sx={{
          color: 'rgba(255,255,255,0.30)',
          fontSize: 'clamp(3px, 0.48vw, 6px)',
          lineHeight: 1.3,
        }}>
          {card.sub}
        </Typography>
      </Box>
    </motion.div>
  );
}

// ─── Cinematic variants for stagger reveal ────────────────────────────────────

const heroContainerVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.18, delayChildren: 0.1 } },
};

const heroItemVariants = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.9, ease: [0.16, 1, 0.3, 1] } },
};

export default function Hero() {
  const { t } = useTranslation('home');
  const lp = useLangPath();
  const phrases = t('hero.phrases', { returnObjects: true }) as string[];
  const [phraseIdx, setPhraseIdx] = React.useState(0);
  const [fontsReady, setFontsReady] = React.useState(false);

  React.useEffect(() => {
    const load = async () => {
      try {
        await document.fonts.load('800 1em "Space Grotesk"');
      } catch (_) {
        // ignore — best effort
      }
      setFontsReady(true);
    };
    load();
  }, []);

  React.useEffect(() => {
    const id = setInterval(() => {
      setPhraseIdx((i) => (i + 1) % phrases.length);
    }, 3600);
    return () => clearInterval(id);
  }, [phrases.length]);

  return (
    <Box
      id="hero"
      sx={{
        position: 'relative',
        width: '100%',
        minHeight: '100vh',
        overflow: 'hidden',
        bgcolor: '#070709',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Ambient glow orbs ── */}
      <Box sx={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0, overflow: 'hidden' }}>
        <Box sx={{
          position: 'absolute', top: '-15%', left: '-8%',
          width: '55%', height: '65%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(190,255,80,0.09) 0%, rgba(150,230,40,0.03) 50%, transparent 70%)',
          filter: 'blur(90px)',
          animation: `${orbDrift1} 16s ease-in-out infinite`,
        }} />
        <Box sx={{
          position: 'absolute', bottom: '10%', right: '-5%',
          width: '40%', height: '50%',
          borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(200,255,90,0.05) 0%, transparent 70%)',
          filter: 'blur(70px)',
          animation: `${orbDrift2} 20s ease-in-out infinite`,
        }} />
      </Box>

      {/* ── Text zone ── */}
      <Container
        maxWidth="md"
        sx={{
          position: 'relative',
          zIndex: 2,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          pt: { xs: '16vh', sm: '14vh' },
          pb: 0,
          textAlign: 'center',
        }}
      >
        <Box
          component={motion.div}
          variants={heroContainerVariants}
          initial="hidden"
          animate="visible"
          sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: { xs: 1.4, sm: 1.8 } }}
        >
          {/* Eyebrow badge */}
          <Box
            component={motion.div}
            variants={heroItemVariants}
            sx={{
              display: 'inline-flex',
              alignItems: 'center',
              border: '1px solid rgba(220,255,182,0.30)',
              borderRadius: '50px',
              px: 2.2,
              py: 0.55,
              backdropFilter: 'blur(10px)',
              bgcolor: 'rgba(0,0,0,0.28)',
            }}
          >
            <Typography sx={{ color: '#DCFFB6', fontSize: '0.67rem', fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase' }}>
              {t('hero.badge')}
            </Typography>
          </Box>

          {/* Main headline */}
          <Box
            component={motion.div}
            variants={heroItemVariants}
            sx={{
              minHeight: { xs: '7rem', sm: '5rem' },
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: fontsReady ? 1 : 0,
              transition: 'opacity 0.25s ease',
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={phraseIdx}
                style={{ position: 'absolute' }}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.4, ease: 'easeInOut' }}
              >
                <Typography
                  variant="h1"
                  sx={{
                    fontFamily: "'Space Grotesk', sans-serif",
                    fontSize: { xs: 'clamp(2rem, 7vw, 2.8rem)', sm: 'clamp(2.4rem, 5vw, 3.6rem)' },
                    fontWeight: 800,
                    lineHeight: 1.08,
                    letterSpacing: '-0.02em',
                  }}
                >
                  {/* Base words — left-to-right shimmer sweep */}
                  <Box
                    component="span"
                    sx={{
                      background: 'linear-gradient(90deg, rgba(255,255,255,0.78) 0%, #fff 30%, rgba(230,255,200,0.85) 50%, #fff 70%, rgba(255,255,255,0.78) 100%)',
                      backgroundSize: '260% auto',
                      animation: `${shimmerSweep} 4s ease-in-out infinite`,
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      backgroundClip: 'text',
                    }}
                  >
                    {phrases[phraseIdx].split(' ').slice(0, -1).join(' ')}{' '}
                  </Box>
                  {/* Last word — brand green accent */}
                  <Box
                    component="span"
                    sx={{
                      WebkitTextFillColor: '#DCFFB6',
                      color: '#DCFFB6',
                      textShadow: '0 0 28px rgba(220,255,182,0.38), 0 0 60px rgba(220,255,182,0.14)',
                    }}
                  >
                    {phrases[phraseIdx].split(' ').slice(-1)[0]}
                  </Box>
                </Typography>
              </motion.div>
            </AnimatePresence>
          </Box>

          {/* Subtitle */}
          <Box component={motion.div} variants={heroItemVariants}>
            <Typography
              sx={{
                color: 'rgba(255,255,255,0.60)',
                maxWidth: 500,
                fontSize: { xs: '0.88rem', sm: '0.96rem' },
                lineHeight: 1.75,
                fontWeight: 400,
              }}
            >
              {t('hero.subtitle')}
            </Typography>
          </Box>

          {/* CTAs */}
          <Box
            component={motion.div}
            variants={heroItemVariants}
            sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1.2, pt: 0.5 }}
          >
            <Button
              variant="contained"
              size="large"
              href="https://app.cx-assistant.com/sign-up"
              sx={{
                px: 4, py: 1.1, borderRadius: 2, textTransform: 'none', fontWeight: 700, fontSize: '0.92rem',
                bgcolor: '#DCFFB6', color: '#111',
                boxShadow: '0 4px 28px rgba(220,255,182,0.20)',
                '&:hover': { bgcolor: '#c8f0a0', transform: 'translateY(-2px)', boxShadow: '0 8px 32px rgba(220,255,182,0.30)' },
                transition: 'all 0.2s ease',
              }}
            >
              {t('hero.ctaPrimary')}
            </Button>
            <Button
              variant="outlined"
              size="large"
              href={lp('/blog')}
              sx={{
                px: 4, py: 1.1, borderRadius: 2, textTransform: 'none', fontWeight: 600, fontSize: '0.92rem',
                border: '1.5px solid rgba(255,255,255,0.26)', color: '#fff',
                backdropFilter: 'blur(8px)',
                bgcolor: 'rgba(255,255,255,0.05)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', border: '1.5px solid rgba(255,255,255,0.52)', transform: 'translateY(-2px)' },
                transition: 'all 0.2s ease',
              }}
            >
              {t('hero.ctaSecondary')}
            </Button>
          </Box>
        </Box>
      </Container>

      {/* ── 3D screenshot scene ── */}
      <Box
        sx={{
          position: 'relative',
          zIndex: 2,
          flex: 1,
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          pt: { xs: 5, sm: 7 },
          px: { xs: '8%', sm: '10%', md: '12%' },
        }}
      >
        {/* Perspective wrapper */}
        <Box
          sx={{ position: 'relative', width: '100%', maxWidth: 920 }}
          style={{ perspective: '1400px', perspectiveOrigin: '50% 20%' }}
        >
          {/* Rocking 3D screenshot */}
          <Box
            component={motion.div}
            initial={{ rotateX: 8, rotateY: -10, opacity: 0, y: 48 }}
            animate={{
              rotateX: [8, 11, 9, 6, 8],
              rotateY: [-10, -7, -10, -13, -10],
              opacity: 1,
              y: 0,
            }}
            transition={{
              rotateX: { duration: 18, ease: 'easeInOut', repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] },
              rotateY: { duration: 18, ease: 'easeInOut', repeat: Infinity, times: [0, 0.25, 0.5, 0.75, 1] },
              opacity: { duration: 1.0, delay: 0.5 },
              y: { duration: 1.0, delay: 0.5, ease: [0.16, 1, 0.3, 1] },
            }}
            style={{ transformStyle: 'preserve-3d', transformOrigin: 'center top', position: 'relative' }}
          >
            {/* Screenshot frame */}
            <Box
              sx={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 50px 120px rgba(0,0,0,0.88), 0 0 0 1px rgba(255,255,255,0.08), 0 0 80px rgba(80,200,80,0.10)',
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src="/hero/screenshot-without-cards.png"
                alt="Cx Assistant Dashboard"
                sx={{ width: '100%', display: 'block', height: 'auto' }}
              />
              {/* Bottom fade — inside frame so it stays co-planar with the image in 3D.
                  Tall enough (85%) that the right edge is always covered regardless of rotateY. */}
              <Box sx={{
                position: 'absolute',
                bottom: 0, left: 0, right: 0,
                height: '85%',
                background: 'linear-gradient(to bottom, transparent 0%, transparent 22%, rgba(7,7,9,0.18) 45%, rgba(7,7,9,0.60) 62%, #070709 76%)',
                pointerEvents: 'none',
                zIndex: 3,
              }} />
              {/* Green shimmer top edge */}
              <Box sx={{
                position: 'absolute', top: 0, left: 0, right: 0, height: '2px',
                background: 'linear-gradient(90deg, transparent 0%, rgba(180,255,150,0.55) 30%, rgba(220,255,180,0.95) 50%, rgba(180,255,150,0.55) 70%, transparent 100%)',
                zIndex: 2,
              }} />
            </Box>

            {/* Animated stat cards — positioned at their original screenshot locations */}
            {HERO_STAT_CARDS.map((card) => (
              <HeroStatCard key={card.label} card={card} />
            ))}
          </Box>

          {/* Radial glow under screenshot — kept very subtle */}
          <Box sx={{
            position: 'absolute',
            bottom: '12%', left: '20%', right: '20%',
            height: 50,
            background: 'radial-gradient(ellipse, rgba(190,255,80,0.06) 0%, transparent 70%)',
            filter: 'blur(18px)',
            pointerEvents: 'none',
            zIndex: 9,
          }} />

          {/* Outer fade — just a soft final bleed at the very bottom */}
          <Box sx={{
            position: 'absolute',
            bottom: 0, left: 0, right: 0,
            height: '28%',
            background: 'linear-gradient(to bottom, transparent 0%, #070709 100%)',
            pointerEvents: 'none',
            zIndex: 10,
          }} />
        </Box>
      </Box>
    </Box>
  );
}
