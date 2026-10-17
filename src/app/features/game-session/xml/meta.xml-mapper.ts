import { SessionMeta } from '../models/session-meta.model';
import { readBoolean, readString, setAttributes } from './xml.util';

export function writeMeta(doc: XMLDocument, meta: SessionMeta): Element {
  const el: Element = doc.createElement('meta');
  setAttributes(el, { name: meta.name, active: meta.active, startedAt: meta.startedAt });
  return el;
}

export function readMeta(el: Element): SessionMeta {
  return {
    name: readString(el, 'name'),
    active: readBoolean(el, 'active'),
    startedAt: el.getAttribute('startedAt'),
  };
}
