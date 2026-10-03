export type ShortSearchResult = {
  type:
    | 'spells'
    | 'feats'
    | 'monsters'
    | 'backgrounds'
    | 'magic_items'
    | 'facilities'
    | 'rules'
    | 'equipment'
  title: string
  originalTitle: string
}
