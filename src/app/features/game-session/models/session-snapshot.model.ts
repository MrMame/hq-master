import { SessionSliceData } from '../../../core/session-state/session-slices';
import { SessionMeta } from './session-meta.model';

/** Vollständiger, feature-übergreifender Zustand einer Spielesession (Speichern/Laden). */
export interface SessionSnapshot extends SessionSliceData {
  meta: SessionMeta;
}
