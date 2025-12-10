'use client';

import { useState } from 'react';
import styles from './StyleGuide.module.css';
import MultiChoiceGrid from '@/components/MultiChoiceGrid';
import ScoreBadge from '@/components/ScoreBadge';
import InstructionsModal from '@/components/InstructionsModal';
import SettingsModal from '@/components/SettingsModal';
import ResetConfirmationModal from '@/components/ResetConfirmationModal';
import AskFriendModal from '@/components/AskFriendModal';
import CheckIcon from '@/components/icons/CheckIcon';
import CrossIcon from '@/components/icons/CrossIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';
import CloseIcon from '@/components/icons/CloseIcon';
import { Question } from '@/types';

// Mock data for demonstration
const mockQuestion: Question = {
  id: '1',
  category: 'Christmas',
  difficulty: 'medium',
  question: 'What is the capital of France?',
  answer: 'Paris',
  options: ['Paris', 'London', 'Berlin', 'Madrid'],
};

export default function StyleGuidePage() {
  const [instructionsOpen, setInstructionsOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [resetOpen, setResetOpen] = useState(false);
  const [askFriendOpen, setAskFriendOpen] = useState(false);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <header className={styles.header}>
          <h1 className={styles.mainTitle}>2025 Quiz Style Guide</h1>
          <p className={styles.subtitle}>
            Complete visual documentation of all UI elements, components, and design patterns used in the app.
          </p>
        </header>

        {/* 1. Typography */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>1. Typography</h2>
          <div className={styles.typographyGrid}>
            <div className={styles.typographyItem}>
              <h1 className={styles.h1}>H1 Heading</h1>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Bold</p>
                <p><strong>Size:</strong> 5rem (80px)</p>
                <p><strong>Weight:</strong> 700</p>
                <p><strong>Color:</strong> #000000</p>
                <p><strong>Usage:</strong> Main screen titles</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <h2 className={styles.h2}>H2 Heading</h2>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Bold</p>
                <p><strong>Size:</strong> 3rem (48px)</p>
                <p><strong>Weight:</strong> 700</p>
                <p><strong>Color:</strong> #000000</p>
                <p><strong>Usage:</strong> Section titles</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <h3 className={styles.h3}>H3 Heading</h3>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Bold</p>
                <p><strong>Size:</strong> 1.8rem (28.8px)</p>
                <p><strong>Weight:</strong> 700</p>
                <p><strong>Color:</strong> #000000</p>
                <p><strong>Usage:</strong> Subsection titles</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <p className={styles.bodyText}>Body Text</p>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Regular</p>
                <p><strong>Size:</strong> 1.2rem (19.2px)</p>
                <p><strong>Weight:</strong> 400</p>
                <p><strong>Line-height:</strong> 1.6</p>
                <p><strong>Color:</strong> #000000</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <p className={styles.smallText}>Small Text / Captions</p>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Regular</p>
                <p><strong>Size:</strong> 1.1rem (17.6px)</p>
                <p><strong>Weight:</strong> 400</p>
                <p><strong>Color:</strong> rgba(0, 0, 0, 0.6)</p>
                <p><strong>Usage:</strong> Helper text, captions</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <button className={styles.buttonText}>Button Text</button>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Bold</p>
                <p><strong>Size:</strong> 1rem - 1.5rem</p>
                <p><strong>Weight:</strong> 700</p>
                <p><strong>Usage:</strong> All buttons</p>
              </div>
            </div>

            <div className={styles.typographyItem}>
              <label className={styles.labelText}>Label Text</label>
              <div className={styles.specs}>
                <p><strong>Font:</strong> Recife, Regular</p>
                <p><strong>Size:</strong> 1rem (16px)</p>
                <p><strong>Weight:</strong> 400</p>
                <p><strong>Color:</strong> rgba(0, 0, 0, 0.6)</p>
              </div>
            </div>
          </div>
        </section>

        {/* 2. Colors */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>2. Colors</h2>
          
          <div className={styles.colorSubsection}>
            <h3 className={styles.subsectionTitle}>Core Colors</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#F5F1E8' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Beige</strong></p>
                  <p>#F5F1E8</p>
                  <p>Background base</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#FFFFFF', border: '2px solid #000' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>White</strong></p>
                  <p>#FFFFFF</p>
                  <p>Card background</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#000000' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Black</strong></p>
                  <p>#000000</p>
                  <p>Text primary, borders</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(0, 0, 0, 0.6)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Gray</strong></p>
                  <p>rgba(0, 0, 0, 0.6)</p>
                  <p>Text secondary</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#0F6635' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Green</strong></p>
                  <p>#0F6635</p>
                  <p>Correct answers</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#C94A3A' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Red</strong></p>
                  <p>#C94A3A</p>
                  <p>Wrong answers, warnings</p>
                </div>
              </div>
            </div>
          </div>

          <div className={styles.colorSubsection}>
            <h3 className={styles.subsectionTitle}>Semantic Colors</h3>
            <div className={styles.colorGrid}>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#0F6635' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Correct (Normal)</strong></p>
                  <p>#0F6635</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(15, 102, 53, 0.8)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Correct (Hover)</strong></p>
                  <p>rgba(15, 102, 53, 0.8)</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(15, 102, 53, 0.1)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Correct (Background)</strong></p>
                  <p>rgba(15, 102, 53, 0.1)</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: '#C94A3A' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Wrong (Normal)</strong></p>
                  <p>#C94A3A</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(201, 74, 58, 0.8)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Wrong (Hover)</strong></p>
                  <p>rgba(201, 74, 58, 0.8)</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(201, 74, 58, 0.1)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Wrong (Background)</strong></p>
                  <p>rgba(201, 74, 58, 0.1)</p>
                </div>
              </div>
              <div className={styles.colorItem}>
                <div className={styles.colorSwatch} style={{ backgroundColor: 'rgba(0, 0, 0, 0.5)' }}></div>
                <div className={styles.colorInfo}>
                  <p><strong>Disabled</strong></p>
                  <p>opacity: 0.5</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Buttons */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>3. Buttons</h2>
          
          <div className={styles.buttonSubsection}>
            <h3 className={styles.subsectionTitle}>Primary Button</h3>
            <div className={styles.buttonShowcase}>
              <div className={styles.buttonState}>
                <button className={styles.primaryButton}>Start Quiz</button>
                <p className={styles.stateLabel}>Default</p>
              </div>
              <div className={styles.buttonState}>
                <button className={`${styles.primaryButton} ${styles.hover}`}>Start Quiz</button>
                <p className={styles.stateLabel}>Hover</p>
              </div>
              <div className={styles.buttonState}>
                <button className={`${styles.primaryButton} ${styles.disabled}`} disabled>Start Quiz</button>
                <p className={styles.stateLabel}>Disabled</p>
              </div>
            </div>
            <div className={styles.specs}>
              <p><strong>Background:</strong> #000000</p>
              <p><strong>Color:</strong> #FFFFFF</p>
              <p><strong>Padding:</strong> 1.5rem 4rem</p>
              <p><strong>Border-radius:</strong> 8px</p>
              <p><strong>Font-size:</strong> 1.5rem</p>
            </div>
          </div>

          <div className={styles.buttonSubsection}>
            <h3 className={styles.subsectionTitle}>Secondary Button</h3>
            <div className={styles.buttonShowcase}>
              <div className={styles.buttonState}>
                <button className={styles.secondaryButton}>Edit</button>
                <p className={styles.stateLabel}>Default</p>
              </div>
              <div className={styles.buttonState}>
                <button className={`${styles.secondaryButton} ${styles.hover}`}>Edit</button>
                <p className={styles.stateLabel}>Hover</p>
              </div>
              <div className={styles.buttonState}>
                <button className={`${styles.secondaryButton} ${styles.disabled}`} disabled>Edit</button>
                <p className={styles.stateLabel}>Disabled</p>
              </div>
            </div>
            <div className={styles.specs}>
              <p><strong>Background:</strong> transparent</p>
              <p><strong>Color:</strong> #000000</p>
              <p><strong>Border:</strong> 2px solid #000000</p>
              <p><strong>Padding:</strong> 0.5rem 1.5rem</p>
            </div>
          </div>

          <div className={styles.buttonSubsection}>
            <h3 className={styles.subsectionTitle}>Tertiary / Text Button</h3>
            <div className={styles.buttonShowcase}>
              <div className={styles.buttonState}>
                <button className={styles.tertiaryButton}>Remove</button>
                <p className={styles.stateLabel}>Default</p>
              </div>
              <div className={styles.buttonState}>
                <button className={`${styles.tertiaryButton} ${styles.hover}`}>Remove</button>
                <p className={styles.stateLabel}>Hover</p>
              </div>
            </div>
            <div className={styles.specs}>
              <p><strong>Background:</strong> transparent</p>
              <p><strong>Color:</strong> #C94A3A</p>
              <p><strong>Border:</strong> 2px solid #C94A3A</p>
            </div>
          </div>

          <div className={styles.buttonSubsection}>
            <h3 className={styles.subsectionTitle}>Action Buttons</h3>
            <div className={styles.buttonShowcase}>
              <button className={styles.selectButton}>Select</button>
              <button className={styles.saveButton}>Save</button>
              <button className={styles.resetButton}>Reset All Data</button>
            </div>
          </div>
        </section>

        {/* 4. Cards / Containers */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>4. Cards / Containers</h2>
          
          <div className={styles.cardShowcase}>
            <div className={styles.cardItem}>
              <div className={styles.questionCard}>
                <p className={styles.cardLabel}>Question Card</p>
                <p className={styles.questionText}>What is the capital of France?</p>
              </div>
              <div className={styles.specs}>
                <p><strong>Background:</strong> #FFFFFF</p>
                <p><strong>Border:</strong> 2px solid #000000</p>
                <p><strong>Border-radius:</strong> 8px</p>
                <p><strong>Padding:</strong> 1.5rem</p>
              </div>
            </div>

            <div className={styles.cardItem}>
              <div className={styles.playerCard}>
                <p className={styles.cardLabel}>Player Card</p>
                <div className={styles.playerCardContent}>
                  <span>Player Name (#1)</span>
                  <div>
                    <button className={styles.cardButton}>Edit</button>
                    <button className={styles.cardButtonRed}>Remove</button>
                  </div>
                </div>
              </div>
              <div className={styles.specs}>
                <p><strong>Background:</strong> #FFFFFF</p>
                <p><strong>Border:</strong> 2px solid #000000</p>
                <p><strong>Padding:</strong> 1.5rem</p>
              </div>
            </div>

            <div className={styles.cardItem}>
              <div className={styles.scoreCard}>
                <p className={styles.cardLabel}>Score Breakdown Card</p>
                <div className={styles.scoreContent}>
                  <div className={styles.scoreRow}>
                    <span>Question 1</span>
                    <span className={styles.correct}>Correct</span>
                    <span>4 pts</span>
                  </div>
                  <div className={styles.scoreRow}>
                    <span>Question 2</span>
                    <span className={styles.wrong}>Wrong</span>
                    <span>0 pts</span>
                  </div>
                </div>
              </div>
              <div className={styles.specs}>
                <p><strong>Border-radius:</strong> 12px</p>
                <p><strong>Padding:</strong> 2rem</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Interactive States for Answers */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>5. Interactive States for Answers</h2>
          <div className={styles.answerStatesGrid}>
            <div className={styles.answerStateItem}>
              <button className={styles.answerDefault}>Default Answer</button>
              <p className={styles.stateLabel}>Default</p>
              <div className={styles.specs}>
                <p>Background: #FFFFFF</p>
                <p>Border: 2px solid #000000</p>
              </div>
            </div>
            <div className={styles.answerStateItem}>
              <button className={styles.answerSelected}>Selected Answer</button>
              <p className={styles.stateLabel}>Selected (Before Submit)</p>
              <div className={styles.specs}>
                <p>Background: #000000</p>
                <p>Color: #FFFFFF</p>
              </div>
            </div>
            <div className={styles.answerStateItem}>
              <button className={styles.answerCorrect}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--icon-gap)' }}>
                  Correct Answer
                  <CheckIcon size={20} color="currentColor" />
                </span>
              </button>
              <p className={styles.stateLabel}>Correct (After Submit)</p>
              <div className={styles.specs}>
                <p>Background: #0F6635</p>
                <p>Color: #FFFFFF</p>
              </div>
            </div>
            <div className={styles.answerStateItem}>
              <button className={styles.answerWrong}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 'var(--icon-gap)' }}>
                  Wrong Answer
                  <CrossIcon size={20} color="currentColor" />
                </span>
              </button>
              <p className={styles.stateLabel}>Incorrect (After Submit)</p>
              <div className={styles.specs}>
                <p>Background: #C94A3A</p>
                <p>Color: #FFFFFF</p>
              </div>
            </div>
          </div>
          <div className={styles.multiChoiceDemo}>
            <h3 className={styles.subsectionTitle}>Multiple Choice Grid Demo</h3>
            <MultiChoiceGrid
              question={mockQuestion}
              selectedAnswer="Paris"
              onSelect={() => {}}
              isSubmitted={true}
              isCorrect={true}
            />
          </div>
        </section>

        {/* 6. Modals */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>6. Modals</h2>
          <div className={styles.modalButtons}>
            <button className={styles.primaryButton} onClick={() => setInstructionsOpen(true)}>
              Show Instructions Modal
            </button>
            <button className={styles.primaryButton} onClick={() => setSettingsOpen(true)}>
              Show Settings Modal
            </button>
            <button className={styles.resetButton} onClick={() => setResetOpen(true)}>
              Show Reset Confirmation Modal
            </button>
            <button className={styles.primaryButton} onClick={() => setAskFriendOpen(true)}>
              Show Ask Friend Modal
            </button>
          </div>
          <div className={styles.specs}>
            <p><strong>Overlay:</strong> rgba(0, 0, 0, 0.6) or rgba(0, 0, 0, 0.7)</p>
            <p><strong>Modal Background:</strong> #F5F1E8</p>
            <p><strong>Border:</strong> 2px solid #000000 (or #C94A3A for warnings)</p>
            <p><strong>Border-radius:</strong> 12px</p>
            <p><strong>Padding:</strong> 3rem</p>
            <p><strong>Max-width:</strong> 500px - 700px</p>
            <p><strong>Box-shadow:</strong> 0 8px 32px rgba(0, 0, 0, 0.3)</p>
          </div>
        </section>

        {/* 7. Input Elements */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>7. Input Elements</h2>
          <div className={styles.inputShowcase}>
            <div className={styles.inputItem}>
              <input type="text" className={styles.textInput} placeholder="Player name" />
              <p className={styles.stateLabel}>Default</p>
            </div>
            <div className={styles.inputItem}>
              <input type="text" className={`${styles.textInput} ${styles.focused}`} placeholder="Player name" defaultValue="Focused input" />
              <p className={styles.stateLabel}>Focused</p>
            </div>
          </div>
          <div className={styles.specs}>
            <p><strong>Background:</strong> #FFFFFF</p>
            <p><strong>Border:</strong> 2px solid #000000</p>
            <p><strong>Border-radius:</strong> 6px - 8px</p>
            <p><strong>Padding:</strong> 1rem - 1.5rem</p>
            <p><strong>Focus:</strong> box-shadow: 0 0 0 3px rgba(0, 0, 0, 0.1)</p>
          </div>
        </section>

        {/* 8. Layout Rules & Spacing */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>8. Layout Rules & Spacing</h2>
          <div className={styles.spacingGrid}>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBox} style={{ width: '16px', height: '16px' }}></div>
              <p>16px (1rem)</p>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBox} style={{ width: '24px', height: '24px' }}></div>
              <p>24px (1.5rem)</p>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBox} style={{ width: '32px', height: '32px' }}></div>
              <p>32px (2rem)</p>
            </div>
            <div className={styles.spacingItem}>
              <div className={styles.spacingBox} style={{ width: '48px', height: '48px' }}></div>
              <p>48px (3rem)</p>
            </div>
          </div>
          <div className={styles.specs}>
            <p><strong>Standard Padding:</strong> 1rem (16px), 1.5rem (24px), 2rem (32px), 3rem (48px)</p>
            <p><strong>Standard Margins:</strong> 1rem, 1.5rem, 2rem, 3rem</p>
            <p><strong>Section Spacing:</strong> 3rem (48px)</p>
            <p><strong>Gap (Grid/Flex):</strong> 1rem (16px)</p>
            <p><strong>Border-width:</strong> 2px standard</p>
            <p><strong>Border-radius:</strong> 6px (small), 8px (medium), 12px (large)</p>
          </div>
        </section>

        {/* 10. Icons & Symbols */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Icons & Symbols</h2>
          <p className={styles.paragraph}>
            All icons are SVG-based components stored in <code>src/components/icons/</code>
          </p>
          
          <div className={styles.iconShowcase}>
            <h3 className={styles.subsectionTitle}>Checkmark Icon (Correct Answers)</h3>
            <div className={styles.iconGrid}>
              <div className={styles.iconItem}>
                <CheckIcon size={24} color="var(--color-green)" />
                <p>Default (Green)</p>
                <p className={styles.code}>size: 24, color: green</p>
              </div>
              <div className={styles.iconItem}>
                <CheckIcon size={20} color="var(--color-white)" />
                <div style={{ background: 'var(--color-green)', padding: '0.5rem', display: 'inline-block' }}>
                  <CheckIcon size={20} color="var(--color-white)" />
                </div>
                <p>On Green Background</p>
                <p className={styles.code}>size: 20, color: white</p>
              </div>
              <div className={styles.iconItem}>
                <CheckIcon size={16} color="var(--color-green)" />
                <p>Small (Score Breakdown)</p>
                <p className={styles.code}>size: 16, color: green</p>
              </div>
            </div>
          </div>

          <div className={styles.iconShowcase}>
            <h3 className={styles.subsectionTitle}>Cross Icon (Wrong Answers)</h3>
            <div className={styles.iconGrid}>
              <div className={styles.iconItem}>
                <CrossIcon size={24} color="var(--color-red)" />
                <p>Default (Red)</p>
                <p className={styles.code}>size: 24, color: red</p>
              </div>
              <div className={styles.iconItem}>
                <CrossIcon size={20} color="var(--color-white)" />
                <div style={{ background: 'var(--color-red)', padding: '0.5rem', display: 'inline-block' }}>
                  <CrossIcon size={20} color="var(--color-white)" />
                </div>
                <p>On Red Background</p>
                <p className={styles.code}>size: 20, color: white</p>
              </div>
              <div className={styles.iconItem}>
                <CrossIcon size={16} color="var(--color-red)" />
                <p>Small (Score Breakdown)</p>
                <p className={styles.code}>size: 16, color: red</p>
              </div>
            </div>
          </div>

          <div className={styles.iconShowcase}>
            <h3 className={styles.subsectionTitle}>Navigation Icons</h3>
            <div className={styles.iconGrid}>
              <div className={styles.iconItem}>
                <ArrowLeftIcon size={24} color="var(--color-black)" />
                <p>Back Arrow (Default)</p>
                <p className={styles.code}>size: 24, color: black</p>
              </div>
              <div className={styles.iconItem}>
                <ArrowLeftIcon size={16} color="currentColor" />
                <div style={{ background: 'var(--color-black)', padding: '0.5rem', display: 'inline-block' }}>
                  <ArrowLeftIcon size={16} color="var(--color-white)" />
                </div>
                <p>In Button (Hover State)</p>
                <p className={styles.code}>size: 16, color: white</p>
              </div>
              <div className={styles.iconItem}>
                <CloseIcon size={24} color="var(--color-black)" />
                <p>Close/Cross (Modal)</p>
                <p className={styles.code}>size: 24, color: black</p>
              </div>
            </div>
          </div>

          <div className={styles.iconShowcase}>
            <h3 className={styles.subsectionTitle}>Icon Usage Examples</h3>
            <div className={styles.iconExample}>
              <div className={styles.codeBlock}>
                <pre>{`import CheckIcon from '@/components/icons/CheckIcon';
import CrossIcon from '@/components/icons/CrossIcon';
import ArrowLeftIcon from '@/components/icons/ArrowLeftIcon';

// In JSX:
<CheckIcon size={20} color="var(--color-green)" />
<CrossIcon size={16} color="currentColor" />
<ArrowLeftIcon size={16} color="currentColor" />`}</pre>
              </div>
            </div>
          </div>

          <div className={styles.specs}>
            <p><strong>All icons:</strong> SVG components with customizable size and color</p>
            <p><strong>Default size:</strong> 24px</p>
            <p><strong>Common sizes:</strong> 16px (small), 20px (medium), 24px (default)</p>
            <p><strong>Color:</strong> Use CSS variables (var(--color-green), var(--color-red), etc.) or 'currentColor'</p>
            <p><strong>Location:</strong> src/components/icons/</p>
          </div>
        </section>

        {/* 10. Score Badge */}
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>10. Score Badge</h2>
          <div className={styles.badgeShowcase}>
            <ScoreBadge points={4} />
            <ScoreBadge points={2} friendPoints={2} />
          </div>
        </section>
      </div>

      {/* Modals */}
      <InstructionsModal isOpen={instructionsOpen} onClose={() => setInstructionsOpen(false)} />
      <SettingsModal 
        isOpen={settingsOpen} 
        onClose={() => setSettingsOpen(false)}
        onReset={() => {}}
      />
      <ResetConfirmationModal
        isOpen={resetOpen}
        onConfirm={() => setResetOpen(false)}
        onCancel={() => setResetOpen(false)}
      />
      {askFriendOpen && (
        <AskFriendModal
          players={[
            { id: '1', name: 'Player 1' },
            { id: '2', name: 'Player 2' },
            { id: '3', name: 'Player 3' },
          ]}
          activePlayer={{ id: '1', name: 'Player 1' }}
          onSelectFriend={() => {}}
          onClose={() => setAskFriendOpen(false)}
        />
      )}
    </div>
  );
}

