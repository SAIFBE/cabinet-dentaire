import { useTranslation } from 'react-i18next';
import { TOOTH_STATUSES } from '../validation/dentalChartSchema';

const STATUS_COLORS = {
  healthy:      { bg: '#dcfce7', border: '#86efac', text: '#166534' },
  caries:       { bg: '#fee2e2', border: '#fca5a5', text: '#991b1b' },
  filled:       { bg: '#dbeafe', border: '#93c5fd', text: '#1e40af' },
  missing:      { bg: '#f1f5f9', border: '#cbd5e1', text: '#64748b' },
  crown:        { bg: '#fef3c7', border: '#fcd34d', text: '#92400e' },
  implant:      { bg: '#e0e7ff', border: '#a5b4fc', text: '#3730a3' },
  'root-canal': { bg: '#fce7f3', border: '#f9a8d4', text: '#9d174d' },
};

const STATUS_LABEL_KEYS = {
  healthy: 'dentalChart.healthy',
  caries: 'dentalChart.caries',
  filled: 'dentalChart.filled',
  missing: 'dentalChart.missing',
  crown: 'dentalChart.crown',
  implant: 'dentalChart.implant',
  'root-canal': 'dentalChart.rootCanal',
};

function splitQuadrants(teeth, ageCategory) {
  if (ageCategory === 'child') {
    return {
      upperRight: teeth.filter((t) => t.toothNumber >= 51 && t.toothNumber <= 55).sort((a, b) => b.toothNumber - a.toothNumber),
      upperLeft:  teeth.filter((t) => t.toothNumber >= 61 && t.toothNumber <= 65).sort((a, b) => a.toothNumber - b.toothNumber),
      lowerRight: teeth.filter((t) => t.toothNumber >= 81 && t.toothNumber <= 85).sort((a, b) => b.toothNumber - a.toothNumber),
      lowerLeft:  teeth.filter((t) => t.toothNumber >= 71 && t.toothNumber <= 75).sort((a, b) => a.toothNumber - b.toothNumber),
    };
  }
  return {
    upperRight: teeth.filter((t) => t.toothNumber >= 11 && t.toothNumber <= 18).sort((a, b) => b.toothNumber - a.toothNumber),
    upperLeft:  teeth.filter((t) => t.toothNumber >= 21 && t.toothNumber <= 28).sort((a, b) => a.toothNumber - b.toothNumber),
    lowerRight: teeth.filter((t) => t.toothNumber >= 41 && t.toothNumber <= 48).sort((a, b) => b.toothNumber - a.toothNumber),
    lowerLeft:  teeth.filter((t) => t.toothNumber >= 31 && t.toothNumber <= 38).sort((a, b) => a.toothNumber - b.toothNumber),
  };
}

function ToothCard({ tooth, onClick, t }) {
  const colors = STATUS_COLORS[tooth.status] || STATUS_COLORS.healthy;
  const isMissing = tooth.status === 'missing';

  return (
    <button type="button" className="odontogram__tooth" onClick={() => onClick(tooth)}
      style={{ background: colors.bg, borderColor: colors.border, color: colors.text, opacity: isMissing ? 0.5 : 1 }}
      title={`#${tooth.toothNumber} — ${t(STATUS_LABEL_KEYS[tooth.status] || 'dentalChart.healthy')}`}
    >
      <span className="odontogram__tooth-num">{tooth.toothNumber}</span>
      <span className="odontogram__tooth-status">{t(STATUS_LABEL_KEYS[tooth.status] || 'dentalChart.healthy')}</span>
      {tooth.notes && <span className="odontogram__tooth-note">📝</span>}
    </button>
  );
}

export function OdontogramGrid({ teeth, ageCategory, onToothClick }) {
  const { t } = useTranslation();
  const quads = splitQuadrants(teeth, ageCategory);

  return (
    <div className="odontogram">
      <div className="odontogram__legend">
        {TOOTH_STATUSES.map((s) => (
          <span key={s} className="odontogram__legend-item">
            <span className="odontogram__legend-dot" style={{ background: STATUS_COLORS[s].bg, borderColor: STATUS_COLORS[s].border }} />
            {t(STATUS_LABEL_KEYS[s] || s)}
          </span>
        ))}
      </div>

      <div className="odontogram__jaw">
        <div className="odontogram__jaw-label">{t('dentalChart.upperJaw')}</div>
        <div className="odontogram__arch">
          <div className="odontogram__quadrant">
            {quads.upperRight.map((tp) => <ToothCard key={tp.toothNumber} tooth={tp} onClick={onToothClick} t={t} />)}
          </div>
          <div className="odontogram__midline" />
          <div className="odontogram__quadrant">
            {quads.upperLeft.map((tp) => <ToothCard key={tp.toothNumber} tooth={tp} onClick={onToothClick} t={t} />)}
          </div>
        </div>
      </div>

      <div className="odontogram__divider" />

      <div className="odontogram__jaw">
        <div className="odontogram__jaw-label">{t('dentalChart.lowerJaw')}</div>
        <div className="odontogram__arch">
          <div className="odontogram__quadrant">
            {quads.lowerRight.map((tp) => <ToothCard key={tp.toothNumber} tooth={tp} onClick={onToothClick} t={t} />)}
          </div>
          <div className="odontogram__midline" />
          <div className="odontogram__quadrant">
            {quads.lowerLeft.map((tp) => <ToothCard key={tp.toothNumber} tooth={tp} onClick={onToothClick} t={t} />)}
          </div>
        </div>
      </div>
    </div>
  );
}
