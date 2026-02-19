export const makeGroups = <GroupingT extends string, GroupElementT>(
  groupBy: GroupingT,
  groupers: Record<GroupingT, ((el: GroupElementT) => string) | undefined> & {
    none: undefined
  },
  elements: GroupElementT[]
) => {
  let typer: ((element: GroupElementT) => string) | undefined = undefined

  if (Object.keys(groupers).includes(groupBy)) {
    typer = groupers[groupBy] ?? undefined
  } else {
    console.error('Unknown grouping type')
    typer = groupers.none
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
