import clsx from 'clsx'

export type BorderPosition = 't' | 'b' | 'l' | 'r'

type CellProps = {
  noBorder?: BorderPosition[]
}

function Cell({noBorder = []}: CellProps) {
  return (
    <div
      className={clsx('border border-black', {
        'border-t-0': noBorder.includes('t'),
        'border-r-0': noBorder.includes('r'),
        'border-b-0': noBorder.includes('b'),
        'border-l-0': noBorder.includes('l'),
      })}
      data-testid="cell"
    ></div>
  )
}

export default Cell
