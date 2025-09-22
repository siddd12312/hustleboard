'use client'

import * as React from 'react'

import * as RechartsPrimitive from 'recharts'

import {
cn }
from '@/lib/utils'



const THEMES = {
light: '', dark: '.dark' }
as const



export type ChartConfig = {
[k in string]: {
label?: React.ReactNode
    icon?: React.ComponentType
  }
& (
    | {
color?: string;
theme?: never }
| {
color?: never;
theme: Record<keyof typeof THEMES, string> }
)
}
type ChartContextProps = {
config: ChartConfig
}
const ChartContext = React.createContext<ChartContextProps | null>(null)



function useChart() {
const ctx = React.useContext(ChartContext)

  if (!ctx) {
throw new Error('useChart must be used within a <ChartContainer />')

  }
return ctx
}
function ChartContainer({
id,
  className,
  children,
  config,
  ...props
}
: React.ComponentProps<'div'> & {
config: ChartConfig
  children: React.ComponentProps<
    typeof RechartsPrimitive.ResponsiveContainer
  >['children']
}
) {
const uniq = React.useId()

  const chartId = `chart-${
id || uniq.replace(/:/g, '')}
`



  return (

    <ChartContext.Provider value={
{
config }
}
>

      <div

        data-slot="chart"

        data-chart={
chartId}
className={
cn(
          "[&_.recharts-cartesian-axis-tick_text]:fill-muted-foreground [&_.recharts-cartesian-grid_line[stroke='#ccc']]:stroke-border/50 [&_.recharts-curve.recharts-tooltip-cursor]:stroke-border [&_.recharts-polar-grid_[stroke='#ccc']]:stroke-border [&_.recharts-radial-bar-background-sector]:fill-muted [&_.recharts-rectangle.recharts-tooltip-cursor]:fill-muted [&_.recharts-reference-line_[stroke='#ccc']]:stroke-border flex aspect-video justify-center text-xs [&_.recharts-dot[stroke='#fff']]:stroke-transparent [&_.recharts-layer]:outline-hidden [&_.recharts-sector]:outline-hidden [&_.recharts-sector[stroke='#fff']]:stroke-transparent [&_.recharts-surface]:outline-hidden",
          className,
        )}
{
...props}
>

        <ChartStyle id={
chartId}
config={
config}
/>

        <RechartsPrimitive.ResponsiveContainer>
          {
children}
</RechartsPrimitive.ResponsiveContainer>
      </div>
    </ChartContext.Provider>
  )
}
const ChartStyle = ({
id, config }
: {
id: string;
config: ChartConfig }
) => {
const colorStuff = Object.entries(config).filter(

    ([, x]) => x.theme || x.color,
  )

  if (!colorStuff.length) {
return null

  }
return (

    <style

      dangerouslySetInnerHTML={
{
__html: Object.entries(THEMES)
          .map(
            ([theme, prefix]) => `
${
prefix}
[data-chart=${
id}
] {
${
colorStuff
  .map(([key, itemConfig]) => {
const col =
      itemConfig.theme?.[theme as keyof typeof itemConfig.theme] ||
      itemConfig.color
    return col ? `  --color-${
key}
: ${
col}
;
` : null
  }
)
  .join('\n')}
}
`,
          )
          .join('\n'),
      }
}
/>
  )
}
const ChartTooltip = RechartsPrimitive.Tooltip



function ChartTooltipContent({
active,
  payload,
  className,
  indicator = 'dot',
  hideLabel = false,
  hideIndicator = false,
  label,
  labelFormatter,
  labelClassName,
  formatter,
  color,
  nameKey,
  labelKey,
}
: React.ComponentProps<typeof RechartsPrimitive.Tooltip> &
  React.ComponentProps<'div'> & {
hideLabel?: boolean
    hideIndicator?: boolean
    indicator?: 'line' | 'dot' | 'dashed'
    nameKey?: string
    labelKey?: string
  }
) {
const {
config }
= useChart()


  const tLabel = React.useMemo(() => {
if (hideLabel || !payload?.length) {
return null

    }
const [itm] = payload

    const ky = `${
labelKey || itm?.dataKey || itm?.name || 'value'}
`

    const itmCfg = getPayloadConfigFromPayload(config, itm, ky)

    const v =
      !labelKey && typeof label === 'string'
        ? config[label as keyof typeof config]?.label || label
        : itmCfg?.label

    if (labelFormatter) {
return (
        <div className={
cn('font-medium', labelClassName)}
>
          {
labelFormatter(v, payload)}
</div>
      )
    }
if (!v) {
return null
    }
return <div className={
cn('font-medium', labelClassName)}
>{
v}
</div>
  }
, [
    label,
    labelFormatter,
    payload,
    hideLabel,
    labelClassName,
    config,
    labelKey,
  ])


  if (!active || !payload?.length) {
return null
  }
const nest = payload.length === 1 && indicator !== 'dot'



  return (
    <div
      className={
cn(
        'border-border/50 bg-background grid min-w-[8rem] items-start gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs shadow-xl',
        className,
      )}
>
      {
!nest ? tLabel : null}
<div className="grid gap-1.5">
        {
payload.map((itm, idx) => {
const ky = `${
nameKey || itm.name || itm.dataKey || 'value'}
`

          const itmCfg = getPayloadConfigFromPayload(config, itm, ky)

          const indColor = color || itm.payload.fill || itm.color

          return (
            <div
              key={
itm.dataKey}
className={
cn(
                '[&>svg]:text-muted-foreground flex w-full flex-wrap items-stretch gap-2 [&>svg]:h-2.5 [&>svg]:w-2.5',
                indicator === 'dot' && 'items-center',
              )}
>
              {
formatter && itm?.value !== undefined && itm.name ? (
                formatter(itm.value, itm.name, itm, idx, itm.payload)
              ) : (
                <>
                  {
itmCfg?.icon ? (
                    <itmCfg.icon />
                  ) : (
                    !hideIndicator && (
                      <div
                        className={
cn(
                          'shrink-0 rounded-[2px] border-(--color-border) bg-(--color-bg)',
                          {
'h-2.5 w-2.5': indicator === 'dot',
                            'w-1': indicator === 'line',
                            'w-0 border-[1.5px] border-dashed bg-transparent':
                              indicator === 'dashed',
                            'my-0.5': nest && indicator === 'dashed',
                          }
,
                        )}
style={
{
'--color-bg': indColor,
                            '--color-border': indColor,
                          }
as React.CSSProperties
                        }
/>
                    )
                  )}
<div
                    className={
cn(
                      'flex flex-1 justify-between leading-none',
                      nest ? 'items-end' : 'items-center',
                    )}
>
                    <div className="grid gap-1.5">
                      {
nest ? tLabel : null}
<span className="text-muted-foreground">
                        {
itmCfg?.label || itm.name}
</span>
                    </div>
                    {
itm.value && (
                      <span className="text-foreground font-mono font-medium tabular-nums">
                        {
itm.value.toLocaleString()}
</span>
                    )}
</div>
                </>
              )}
</div>
          )
        }
)}
</div>
    </div>
  )
}
const ChartLegend = RechartsPrimitive.Legend



function ChartLegendContent({
className,
  hideIcon = false,
  payload,
  verticalAlign = 'bottom',
  nameKey,
}
: React.ComponentProps<'div'> &
  Pick<RechartsPrimitive.LegendProps, 'payload' | 'verticalAlign'> & {
hideIcon?: boolean
    nameKey?: string
  }
) {
const {
config }
= useChart()


  if (!payload?.length) {
return null
  }
return (
    <div
      className={
cn(
        'flex items-center justify-center gap-4',
        verticalAlign === 'top' ? 'pb-3' : 'pt-3',
        className,
      )}
>
      {
payload.map((itm) => {
const ky = `${
nameKey || itm.dataKey || 'value'}
`
        const itmCfg = getPayloadConfigFromPayload(config, itm, ky)

        return (
          <div
            key={
itm.value}
className={
'[&>svg]:text-muted-foreground flex items-center gap-1.5 [&>svg]:h-3 [&>svg]:w-3'
            }
>
            {
itmCfg?.icon && !hideIcon ? (
              <itmCfg.icon />
            ) : (
              <div
                className="h-2 w-2 shrink-0 rounded-[2px]"
                style={
{
backgroundColor: itm.color,
                }
}
/>
            )}
{
itmCfg?.label}
</div>
        )
      }
)}
</div>
  )
}
function getPayloadConfigFromPayload(
  config: ChartConfig,
  payload: unknown,
  key: string,
) {
if (typeof payload !== 'object' || payload === null) {
return undefined
  }
const payloadPayload =
    'payload' in payload &&
    typeof payload.payload === 'object' &&
    payload.payload !== null
      ? payload.payload
      : undefined

  let configLabelKey: string = key

  if (
    key in payload &&
    typeof payload[key as keyof typeof payload] === 'string'
  ) {
configLabelKey = payload[key as keyof typeof payload] as string
  }
else if (
    payloadPayload &&
    key in payloadPayload &&
    typeof payloadPayload[key as keyof typeof payloadPayload] === 'string'
  ) {
configLabelKey = payloadPayload[
      key as keyof typeof payloadPayload
    ] as string
  }
return configLabelKey in config
    ? config[configLabelKey]
    : config[key as keyof typeof config]
}
export {
ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartLegend,
  ChartLegendContent,
  ChartStyle,
}
