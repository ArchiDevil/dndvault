export const transliterate = (heading: string): string => {
  const mapping = new Map<string, string>([
    ['а', 'a'],
    ['б', 'b'],
    ['в', 'v'],
    ['г', 'g'],
    ['д', 'd'],
    ['е', 'e'],
    ['ё', 'e'],
    ['ж', 'zh'],
    ['з', 'z'],
    ['и', 'i'],
    ['й', 'y'],
    ['к', 'k'],
    ['л', 'l'],
    ['м', 'm'],
    ['н', 'n'],
    ['о', 'o'],
    ['п', 'p'],
    ['р', 'r'],
    ['с', 's'],
    ['т', 't'],
    ['у', 'u'],
    ['ф', 'f'],
    ['х', 'h'],
    ['ц', 'c'],
    ['ч', 'ch'],
    ['ш', 'sh'],
    ['щ', 'sch'],
    ['ь', ''],
    ['ы', 'i'],
    ['ъ', ''],
    ['э', 'e'],
    ['ю', 'yu'],
    ['я', 'ya'],
    ['1', '1'],
    ['2', '2'],
    ['3', '3'],
    ['4', '4'],
    ['5', '5'],
    ['6', '6'],
    ['7', '7'],
    ['8', '8'],
    ['9', '9'],
    ['0', '0'],
  ])

  return heading
    .toLowerCase()
    .split('')
    .map((c) => mapping.get(c) ?? '_')
    .join('')
}

export const mapFeatCategory = (category: string) => {
  if (category === 'origin') {
    return 'Черты происхождения'
  } else if (category === 'universal') {
    return 'Универсальные черты'
  } else if (category === 'martial-style') {
    return 'Черты Боевого стиля'
  } else if (category === 'epic-feat') {
    return 'Черты Эпического дара'
  } else {
    return `Неизвестная категория ${category}`
  }
}

export const mapSchoolName = (school: string) => {
  if (school === 'evocation') {
    return 'Воплощение'
  } else if (school === 'illusion') {
    return 'Иллюзия'
  } else if (school === 'necromancy') {
    return 'Некромантия'
  } else if (school === 'abjuration') {
    return 'Ограждение'
  } else if (school === 'enchantment') {
    return 'Очарование'
  } else if (school === 'transmutation') {
    return 'Преобразование'
  } else if (school === 'conjuration') {
    return 'Призыв'
  } else if (school === 'divination') {
    return 'Прорицание'
  } else {
    return `Неизвестная школа ${school}`
  }
}
