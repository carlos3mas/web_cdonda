'use client'



import Image from 'next/image'

import { useI18n } from '@/lib/i18n/context'

import { datosCompeticion } from '@/lib/primer-equipo/data'

import type { FilaClasificacion } from '@/lib/primer-equipo/types'

import { PrimerEquipoSectionHeader } from './PrimerEquipoSectionHeader'

import { TeamLogo } from './TeamLogo'



function DonutChart({

  ganados,

  empates,

  perdidos,

  labels,

}: {

  ganados: number

  empates: number

  perdidos: number

  labels: { ganados: string; empates: string; perdidos: string }

}) {

  const total = ganados + empates + perdidos || 1

  const gPct = (ganados / total) * 100

  const ePct = (empates / total) * 100

  const background = `conic-gradient(

    #dc2626 0% ${gPct}%,

    #9ca3af ${gPct}% ${gPct + ePct}%,

    #1e40af ${gPct + ePct}% 100%

  )`



  return (

    <div className="flex items-center gap-4 sm:gap-6">

      <div

        className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full shrink-0 shadow-inner"

        style={{ background }}

        role="img"

        aria-label={`${labels.ganados} ${ganados}, ${labels.empates} ${empates}, ${labels.perdidos} ${perdidos}`}

      >

        <div className="absolute inset-3 sm:inset-4 rounded-full bg-white" />

      </div>

      <ul className="space-y-2 text-xs sm:text-sm font-semibold text-gray-700">

        <li className="flex items-center gap-2">

          <span className="w-3 h-3 rounded-full bg-red-600" />

          {labels.ganados}

        </li>

        <li className="flex items-center gap-2">

          <span className="w-3 h-3 rounded-full bg-gray-400" />

          {labels.empates}

        </li>

        <li className="flex items-center gap-2">

          <span className="w-3 h-3 rounded-full bg-blue-800" />

          {labels.perdidos}

        </li>

      </ul>

    </div>

  )

}



function GoalsBar({

  favor,

  contra,

  labels,

}: {

  favor: number

  contra: number

  labels: { goles: string; anotados: string; recibidos: string }

}) {

  const total = favor + contra || 1

  const favorPct = (favor / total) * 100



  return (

    <div className="space-y-2">

      <p className="text-sm sm:text-base font-bold text-gray-900 uppercase tracking-wide">

        {labels.goles}

      </p>

      <div className="flex justify-between text-xs sm:text-sm font-semibold text-gray-700">

        <span className="text-red-600">

          {favor} {labels.anotados}

        </span>

        <span className="text-blue-800">

          {contra} {labels.recibidos}

        </span>

      </div>

      <div className="h-3 sm:h-4 rounded-full overflow-hidden flex bg-gray-200">

        <div

          className="h-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-500"

          style={{ width: `${favorPct}%` }}

        />

        <div className="h-full flex-1 bg-gradient-to-r from-blue-800 to-blue-700" />

      </div>

    </div>

  )

}



function ZonaIndicator({ zona }: { zona?: FilaClasificacion['zona'] }) {

  if (zona === 'ascenso') {

    return <span className="text-green-600 text-[10px]" aria-hidden>▲</span>

  }

  if (zona === 'promocion') {

    return <span className="text-blue-600 text-[10px]" aria-hidden>▲</span>

  }

  return <span className="w-2 inline-block" />

}



function TableRow({ fila }: { fila: FilaClasificacion }) {

  const dg = fila.gf - fila.gc

  const highlight = fila.esNuestroClub



  return (

    <tr

      className={

        highlight

          ? 'bg-red-50 border-l-4 border-l-red-600'

          : 'border-b border-gray-100 hover:bg-gray-50/80'

      }

    >

      <td className="px-2 py-2.5 sm:py-3 text-center font-bold text-gray-800 text-xs sm:text-sm whitespace-nowrap">

        <span className="inline-flex items-center gap-0.5 justify-center min-w-[1.25rem]">

          <ZonaIndicator zona={fila.zona} />

          {fila.posicion || '—'}

        </span>

      </td>

      <td className="px-2 py-2.5 sm:py-3 min-w-[140px]">

        <div className="flex items-center gap-2">

          {fila.logo ? (

            <div className="relative w-6 h-6 sm:w-7 sm:h-7 shrink-0">

              <Image src={fila.logo} alt="" fill className="object-contain" sizes="28px" />

            </div>

          ) : (

            <TeamLogo alt={fila.nombre} size="sm" />

          )}

          <span

            className={`text-[10px] sm:text-xs font-semibold uppercase truncate ${

              highlight ? 'text-red-700' : 'text-gray-800'

            }`}

          >

            {fila.nombre}

          </span>

        </div>

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700">{fila.pj}</td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden sm:table-cell">

        {fila.pg}

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden sm:table-cell">

        {fila.pe}

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden sm:table-cell">

        {fila.pp}

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden md:table-cell">

        {fila.gf}

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden md:table-cell">

        {fila.gc}

      </td>

      <td className="px-1.5 py-2.5 text-center text-xs font-medium text-gray-700 hidden md:table-cell">

        {dg > 0 ? `+${dg}` : dg}

      </td>

      <td className="px-2 py-2.5 text-center text-xs sm:text-sm font-black text-red-600">

        {fila.pts}

      </td>

    </tr>

  )

}



export function ClasificacionPanel() {

  const { t } = useI18n()

  const { estadisticas, clasificacion, temporada } = datosCompeticion

  const { jugados, ganados, empates, perdidos, golesFavor, golesContra } = estadisticas



  const tableHeaders = [

    t('primerEquipo.pos'),

    t('primerEquipo.equipo'),

    t('primerEquipo.pj'),

    t('primerEquipo.pg'),

    t('primerEquipo.pe'),

    t('primerEquipo.pp'),

    t('primerEquipo.gf'),

    t('primerEquipo.gc'),

    t('primerEquipo.dg'),

    t('primerEquipo.pts'),

  ]



  const statCardClass =

    'rounded-2xl bg-white border border-red-100 p-5 sm:p-6 shadow-sm hover:shadow-md transition-shadow'



  return (

    <div>

      <PrimerEquipoSectionHeader

        titleBlue={t('primerEquipo.clasificacion')}

        titleRed={t('primerEquipo.clasificacionSub')}

        description={t('primerEquipo.clasificacionDesc')}

      />



      <div className="grid grid-cols-1 xl:grid-cols-[minmax(280px,340px)_1fr] gap-6 sm:gap-8 max-w-6xl mx-auto">

        <div className="space-y-4 sm:space-y-5">

          <div className={`${statCardClass} text-center`}>

            <p className="text-xs sm:text-sm font-semibold text-blue-600 uppercase tracking-wide mb-2">

              {t('primerEquipo.totalPartidos')}

            </p>

            <p className="text-4xl sm:text-5xl font-black text-red-600 tabular-nums">{jugados}</p>

            <p className="text-sm font-semibold text-gray-600 uppercase mt-1">

              {t('primerEquipo.partidosLabel')}

            </p>

          </div>



          <div className="grid grid-cols-3 gap-2 sm:gap-3">

            {[

              { label: t('primerEquipo.ganados'), value: ganados, color: 'text-red-600' },

              { label: t('primerEquipo.empatados'), value: empates, color: 'text-gray-600' },

              { label: t('primerEquipo.perdidos'), value: perdidos, color: 'text-blue-800' },

            ].map((item) => (

              <div

                key={item.label}

                className="rounded-xl bg-white border border-red-100 p-3 sm:p-4 text-center shadow-sm"

              >

                <p className="text-[10px] sm:text-xs font-semibold text-gray-600 uppercase mb-1 leading-tight">

                  {item.label}

                </p>

                <p className={`text-xl sm:text-2xl font-black ${item.color}`}>{item.value}</p>

              </div>

            ))}

          </div>



          <div className={statCardClass}>

            <DonutChart

              ganados={ganados}

              empates={empates}

              perdidos={perdidos}

              labels={{

                ganados: t('primerEquipo.ganados'),

                empates: t('primerEquipo.empatados'),

                perdidos: t('primerEquipo.perdidos'),

              }}

            />

          </div>



          <div className={statCardClass}>

            <GoalsBar

              favor={golesFavor}

              contra={golesContra}

              labels={{

                goles: t('primerEquipo.goles'),

                anotados: t('primerEquipo.anotados'),

                recibidos: t('primerEquipo.recibidos'),

              }}

            />

          </div>

        </div>



        <div className="rounded-2xl bg-white border border-red-100 shadow-md overflow-hidden">

          <div className="px-4 sm:px-5 py-3 border-b border-gray-100 flex justify-between items-center bg-gradient-to-r from-gray-50 to-white">

            <span className="text-xs font-semibold text-blue-600 uppercase tracking-wide">

              {datosCompeticion.liga}

            </span>

            <span className="text-xs sm:text-sm font-bold text-red-600 uppercase tracking-wider">

              {t('primerEquipo.temporada')} {temporada}

            </span>

          </div>



          <div className="overflow-x-auto">

            <table className="w-full min-w-[520px]">

              <thead>

                <tr className="bg-gradient-to-r from-[#b10c0c] via-[#d02121] to-[#8f0909] text-white text-[10px] sm:text-xs uppercase">

                  {tableHeaders.map((h, i) => (

                    <th

                      key={h}

                      className={`px-1.5 sm:px-2 py-3 font-bold ${

                        i === 0 ? 'text-center w-10' : i === 1 ? 'text-left' : 'text-center'

                      } ${i >= 3 && i <= 5 ? 'hidden sm:table-cell' : ''} ${

                        i >= 6 && i <= 8 ? 'hidden md:table-cell' : ''

                      }`}

                    >

                      {h}

                    </th>

                  ))}

                </tr>

              </thead>

              <tbody>

                {clasificacion.length > 0 ? (

                  clasificacion.map((fila) => <TableRow key={fila.id} fila={fila} />)

                ) : (

                  <tr>

                    <td colSpan={10} className="py-8 text-center text-sm text-gray-500">

                      {t('primerEquipo.sinClasificacion')}

                    </td>

                  </tr>

                )}

              </tbody>

            </table>

          </div>



          <div className="px-4 py-3 border-t border-gray-100 flex flex-wrap gap-4 text-[10px] sm:text-xs font-semibold text-gray-600 uppercase bg-gray-50">

            <span className="flex items-center gap-1.5">

              <span className="text-green-600">▲</span> {t('primerEquipo.ascenso')}

            </span>

            <span className="flex items-center gap-1.5">

              <span className="text-blue-600">▲</span> {t('primerEquipo.promocionAscenso')}

            </span>

          </div>



          {clasificacion.length <= 1 && (

            <p className="px-4 pb-4 text-center text-xs text-gray-500 bg-gray-50">

              {t('primerEquipo.sinClasificacion')}

            </p>

          )}

        </div>

      </div>

    </div>

  )

}


