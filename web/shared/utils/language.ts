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
  } else if (category === 'dragonmarked') {
    return 'Черты Драконьей метки'
  } else if (category === 'planar-pact') {
    return 'Черты Планарного договора'
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

export const mapAbility = (original: string) => {
  if (original === 'strength') {
    return 'Сила'
  } else if (original === 'dexterity') {
    return 'Ловкость'
  } else if (original === 'constitution') {
    return 'Телосложение'
  } else if (original === 'intelligence') {
    return 'Интеллект'
  } else if (original === 'wisdom') {
    return 'Мудрость'
  } else if (original === 'charisma') {
    return 'Харизма'
  } else {
    return `Неизвестная характеристика ${original}`
  }
}

export const mapSkill = (original: string) => {
  if (original === 'acrobatics') {
    return 'Акробатика'
  } else if (original === 'athletics') {
    return 'Атлетика'
  } else if (original === 'perception') {
    return 'Восприятие'
  } else if (original === 'survival') {
    return 'Выживание'
  } else if (original === 'performance') {
    return 'Выступление'
  } else if (original === 'intimidation') {
    return 'Запугивание'
  } else if (original === 'history') {
    return 'История'
  } else if (original === 'sleight_of_hand') {
    return 'Ловкость рук'
  } else if (original === 'medicine') {
    return 'Медицина'
  } else if (original === 'deception') {
    return 'Обман'
  } else if (original === 'nature') {
    return 'Природа'
  } else if (original === 'insight') {
    return 'Проницательность'
  } else if (original === 'investigation') {
    return 'Расследование'
  } else if (original === 'religion') {
    return 'Религия'
  } else if (original === 'stealth') {
    return 'Скрытность'
  } else if (original === 'arcana') {
    return 'Тайная магия'
  } else if (original === 'persuasion') {
    return 'Убеждение'
  } else if (original === 'animal_handling') {
    return 'Уход за животными'
  } else {
    return `Неизвестный навык ${original}`
  }
}

export const mapFacilitySize = (original: string) => {
  if (original === 'cramped') {
    return 'Тесное'
  } else if (original === 'roomy') {
    return 'Вместительное'
  } else if (original === 'vast') {
    return 'Просторное'
  } else {
    return `Неизвестный размер ${original}`
  }
}

export const mapFacilityOrder = (original: string) => {
  if (original === 'recruit') {
    return 'Вербовка'
  } else if (original === 'craft') {
    return 'Изготовление'
  } else if (original === 'research') {
    return 'Исследование'
  } else if (original === 'maintain') {
    return 'Поддержание'
  } else if (original === 'harvest') {
    return 'Сбор'
  } else if (original === 'trade') {
    return 'Торговля'
  } else if (original === 'empower') {
    return 'Усиление'
  } else {
    return `Неизвестный приказ ${original}`
  }
}

export const mapItemCategory = (category: ItemCategory) => {
  if (category === 'armor') {
    return 'Доспех'
  } else if (category === 'potion') {
    return 'Зелье'
  } else if (category === 'ring') {
    return 'Кольцо'
  } else if (category === 'rod') {
    return 'Жезл'
  } else if (category === 'scroll') {
    return 'Свиток'
  } else if (category === 'staff') {
    return 'Посох'
  } else if (category === 'wand') {
    return 'Волшебная палочка'
  } else if (category === 'weapon') {
    return 'Оружие'
  } else if (category === 'wondrous') {
    return 'Чудесный предмет'
  } else {
    return 'Неизвестная категория'
  }
}

export const mapItemRarity = (rarity: ItemRarity) => {
  // TODO: add cases support
  if (rarity === 'artifact') {
    return 'Артефакт'
  } else if (rarity === 'common') {
    return 'Обычный'
  } else if (rarity === 'legendary') {
    return 'Легендарный'
  } else if (rarity === 'rare') {
    return 'Редкий'
  } else if (rarity === 'uncommon') {
    return 'Необычный'
  } else if (rarity === 'variable') {
    return 'редкость варьируется'
  } else if (rarity === 'very_rare') {
    return 'Очень редкий'
  } else {
    return 'Неизвестная редкость'
  }
}
