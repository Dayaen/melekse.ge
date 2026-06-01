export interface WordToken {
  text: string;
  tip?: string;
}

export interface Stanza {
  id: number;
  originalLines: WordToken[][];
  paraphraseLines: string[];
  displayId?: string | number;
}

export interface Chapter {
  id: string;
  title: string;
  rangeText: string;
  stanzas: Stanza[];
}
