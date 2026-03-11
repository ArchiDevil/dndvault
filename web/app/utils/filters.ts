export type GroupTypers<GroupingT extends string | number, ItemType> = Record<
  GroupingT,
  {
    label: string
    grouper: ((spell: ItemType) => string) | undefined
  }
> & {
  none: {
    label: string
    grouper: undefined
  }
}

export const makeGroups = <GroupingT extends string, GroupElementT>(
  groupBy: GroupingT,
  groupers: Record<
    GroupingT,
    {
      grouper: ((el: GroupElementT) => string) | undefined
    }
  > & {
    none: {grouper: undefined}
  },
  elements: GroupElementT[]
) => {
  let typer: ((element: GroupElementT) => string) | undefined = undefined

  if (Object.keys(groupers).includes(groupBy)) {
    typer = groupers[groupBy].grouper ?? undefined
  } else {
    console.error('Unknown grouping type')
    typer = groupers.none.grouper
  }

  if (!typer) return undefined

  const output: {type: string; elements: GroupElementT[]}[] = []
  for (const element of elements) {
    const group = output.find((l) => l.type == typer(element))
    if (!group) {
      output.push({type: typer(element), elements: [element]})
    } else {
      group.elements.push(element)
    }
  }
  return output.sort((a, b) => a.type.localeCompare(b.type))
}
