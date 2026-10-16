import { TestBed } from '@angular/core/testing';

import { SessionXmlService } from './session-xml';
import { SessionSnapshot } from '../models/session-snapshot';
import { createSessionSnapshot } from './session-test-data';

describe('SessionXmlService', () => {
  let service: SessionXmlService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SessionXmlService);
  });

  it('should round-trip a complete snapshot', () => {
    const snapshot: SessionSnapshot = createSessionSnapshot();
    expect(service.parse(service.serialize(snapshot))).toEqual(snapshot);
  });

  it('should round-trip a snapshot without deck and board image', () => {
    const snapshot: SessionSnapshot = {
      ...createSessionSnapshot(),
      characters: [],
      positions: [],
      deck: null,
      board: { ...createSessionSnapshot().board, boardImageBase64: null },
      meta: { name: '', active: false, startedAt: null },
    };
    expect(service.parse(service.serialize(snapshot))).toEqual(snapshot);
  });

  it('should write a readable, versioned XML document', () => {
    const xml: string = service.serialize(createSessionSnapshot());
    expect(xml.startsWith('<?xml version="1.0" encoding="UTF-8"?>')).toBe(true);
    expect(xml).toContain('<gameSession version="1">');
    expect(xml).toContain('\n  <characters>');
    expect(xml).toContain('<card id="c1" name="Schwert"');
  });

  it('should reject malformed XML', () => {
    expect(() => service.parse('<gameSession')).toThrow(/XML konnte nicht gelesen werden/);
  });

  it('should reject a document with a different root element', () => {
    expect(() => service.parse('<deck version="1"/>')).toThrow(/Wurzelelement/);
  });

  it('should reject an unsupported version', () => {
    expect(() => service.parse('<gameSession version="99"/>')).toThrow(/Version: 99/);
  });

  it('should reject a document with a missing section', () => {
    const xml: string = service
      .serialize(createSessionSnapshot())
      .replace(/<characters>[\s\S]*<\/characters>/, '');
    expect(() => service.parse(xml)).toThrow(/<characters> fehlt/);
  });

  it('should reject an invalid game time', () => {
    const xml: string = service
      .serialize(createSessionSnapshot())
      .replace(/<gameTime>.*<\/gameTime>/, '<gameTime>kaputt</gameTime>');
    expect(() => service.parse(xml)).toThrow(/gameTime/);
  });
});
