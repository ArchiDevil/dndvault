import {type ShortSpellData} from '#shared/types/spellTypes'
import {makeSlugLink} from '~~/shared/utils/links'
import {fetchAllPaginated} from '../utils/fetchAllPaginated'

type DirectusSpell = {
  id: number
  title: string
  original_title: string
  level: number
  school: string
  classes: {
    classes_id: {
      title: string
    }
  }[]
  source: {
    title: string
    description: string
  } | null
}

export default defineEventHandler(() =>
  fetchAllPaginated<DirectusSpell, ShortSpellData>('spells', [
    'id',
    'title',
    'original_title',
    'level',
    'school',
    'classes.classes_id.title',
    'source.title',
    'source.description',
  ], (s) => ({
    id: s.id,
    title: s.title,
    original_title: s.original_title,
    level: s.level,
    school: s.school,
    classes: s.classes.map((c) => c.classes_id.title),
    source: s.source,
    slug: makeSlugLink({id: s.id, originalTitle: s.original_title}),
  }))
)
