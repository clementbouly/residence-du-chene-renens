"use client";

import type { FormEvent } from "react";
import { AnimatePresence, m } from "motion/react";
import { Button } from "../../../components/ui/Button";
import { isTwoDigitNumericInput } from "../model/domain";
import styles from "./ConcernPanel.module.css";

export type ConcernPanelState = {
  apartment: string;
  building: string;
  copied: boolean;
  hasLocalConcern: boolean;
  isSubmitting: boolean;
  showConcernForm: boolean;
};

export type ConcernPanelActions = {
  onApartmentChange: (value: string) => void;
  onBuildingChange: (value: string) => void;
  onCopySummary: () => void;
  onFeedbackChange: (value: string) => void;
  onShowConcernFormChange: (show: boolean) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
};

type ConcernPanelProps = {
  state: ConcernPanelState;
  actions: ConcernPanelActions;
};

export default function ConcernPanel({
  state,
  actions,
}: ConcernPanelProps) {
  return (
    <div className={styles.transition}>
      <AnimatePresence initial={false}>
        {state.showConcernForm ? (
          <m.form
            key="concern-form"
            className={styles.form}
            onSubmit={actions.onSubmit}
            initial={{ height: 0, opacity: 0, y: 6 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: 4 }}
            transition={{
              height: { duration: 0.28, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.18 },
              y: { duration: 0.2, ease: "easeOut" },
            }}
            style={{ overflow: "hidden" }}
          >
            <div>
              <label htmlFor="building">Numéro du bâtiment *</label>
              <input
                id="building"
                name="building"
                type="number"
                value={state.building}
                onChange={(event) => {
                  if (isTwoDigitNumericInput(event.target.value)) {
                    actions.onBuildingChange(event.target.value);
                  }
                }}
                placeholder="Ex. 15"
                min={1}
                max={99}
                step={1}
                inputMode="numeric"
                autoComplete="address-line1"
                required
              />
            </div>
            <div>
              <label htmlFor="apartment">
                Appartement <span>facultatif</span>
              </label>
              <input
                id="apartment"
                name="apartment"
                type="number"
                value={state.apartment}
                onChange={(event) => {
                  if (isTwoDigitNumericInput(event.target.value)) {
                    actions.onApartmentChange(event.target.value);
                  }
                }}
                placeholder="Ex. 32"
                min={1}
                max={99}
                step={1}
                inputMode="numeric"
              />
            </div>
            <p>L’appartement n’apparaît jamais dans la synthèse publique.</p>
            <div className={styles.formActions}>
              <Button
                variant="secondary"
                onClick={() => actions.onShowConcernFormChange(false)}
              >
                Annuler
              </Button>
              <Button
                type="submit"
                disabled={state.isSubmitting}
              >
                {state.isSubmitting ? "Enregistrement…" : "Confirmer"}
              </Button>
            </div>
          </m.form>
        ) : (
          <m.div
            key="concern-actions"
            className={styles.actions}
            initial={{ height: 0, opacity: 0, y: 4 }}
            animate={{ height: "auto", opacity: 1, y: 0 }}
            exit={{ height: 0, opacity: 0, y: -3 }}
            transition={{
              height: { duration: 0.24, ease: [0.22, 1, 0.36, 1] },
              opacity: { duration: 0.14 },
              y: { duration: 0.18, ease: "easeOut" },
            }}
            style={{ overflow: "hidden" }}
          >
            <Button
              disabled={state.hasLocalConcern}
              onClick={() => {
                actions.onFeedbackChange("");
                actions.onShowConcernFormChange(true);
              }}
            >
              {state.hasLocalConcern
                ? "Déjà signalé sur cet appareil"
                : "Je suis concerné·e"}
            </Button>
            <Button
              variant="secondary"
              onClick={actions.onCopySummary}
            >
              {state.copied ? "✓ Synthèse copiée" : "Copier la synthèse"}
            </Button>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
}
