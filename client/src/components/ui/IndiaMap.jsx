import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'
import * as topojson from 'topojson-client'

// ─── Color helpers ─────────────────────────────────────────────────────────────
function getScoreColor(score) {
  if (score === undefined || score === null)
    return { fill: '#3B4F7A', border: '#5B7FBF', label: 'No Data' }
  if (score >= 75) return { fill: '#2E7D32', border: '#4CAF50', label: 'Excellent' }
  if (score >= 60) return { fill: '#558B2F', border: '#8BC34A', label: 'Good' }
  if (score >= 45) return { fill: '#E65100', border: '#FF9800', label: 'Average' }
  return { fill: '#B71C1C', border: '#F44336', label: 'Poor' }
}

function normalizeStateName(name) {
  return (name || '').toLowerCase().trim()
}

function buildStateLookup(statesData) {
  const lookup = {}
  statesData.forEach(s => {
    if (s.name) lookup[normalizeStateName(s.name)] = s
  })
  return lookup
}

const ABBREV = {
  'Andhra Pradesh': 'AP', 'Arunachal Pradesh': 'AR', 'Assam': 'AS',
  'Bihar': 'BR', 'Chhattisgarh': 'CG', 'Goa': 'GA', 'Gujarat': 'GJ',
  'Haryana': 'HR', 'Himachal Pradesh': 'HP', 'Jharkhand': 'JH',
  'Karnataka': 'KA', 'Kerala': 'KL', 'Madhya Pradesh': 'MP',
  'Maharashtra': 'MH', 'Manipur': 'MN', 'Meghalaya': 'ML',
  'Mizoram': 'MZ', 'Nagaland': 'NL', 'Orissa': 'OD', 'Odisha': 'OD',
  'Punjab': 'PB', 'Rajasthan': 'RJ', 'Sikkim': 'SK', 'Tamil Nadu': 'TN',
  'Telangana': 'TS', 'Tripura': 'TR', 'Uttar Pradesh': 'UP',
  'Uttaranchal': 'UK', 'Uttarakhand': 'UK', 'West Bengal': 'WB',
  'Delhi': 'DL', 'Jammu and Kashmir': 'J&K', 'Ladakh': 'LA',
  'Chandigarh': 'CH', 'Puducherry': 'PY',
}

const W = 600
const H = 680

export default function IndiaMap({ statesData = [], onStateClick }) {
  const svgRef = useRef(null)
  const wrapperRef = useRef(null)
  const [topoData, setTopoData] = useState(null)
  const [tooltip, setTooltip] = useState(null) // { x,y,stateName,stateData }
  const [error, setError] = useState(false)

  // 1. Load TopoJSON once
  useEffect(() => {
    d3.json('/india-states.topo.json')
      .then(d => setTopoData(d))
      .catch(() => setError(true))
  }, [])

  // 2. Draw map whenever topoData or statesData changes
  useEffect(() => {
    if (!topoData || !svgRef.current) return

    const lookup = buildStateLookup(statesData)
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()

    // Extract features from TopoJSON
    const key = Object.keys(topoData.objects)[0]
    const allFeatures = topojson.feature(topoData, topoData.objects[key]).features

    // Exclude island territories that are geographically far and would shrink the mainland
    // Andaman & Nicobar: ~93°E far east, Lakshadweep: off west coast
    const EXCLUDE_STATES = ['andaman', 'lakshadweep', 'daman', 'dadra']
    const features = allFeatures.filter(f => {
      const name = normalizeStateName(f.properties?.NAME_1 || '')
      return !EXCLUDE_STATES.some(ex => name.startsWith(ex))
    })

    // Fit the projection to cover all remaining (mainland + nearby) features
    const projection = d3.geoMercator()
      .fitExtent([[8, 8], [W - 8, H - 8]], {
        type: 'FeatureCollection',
        features,
      })

    const path = d3.geoPath().projection(projection)

    const pathsG = svg.append('g')  // paths layer (bottom)
    const labelsG = svg.append('g') // labels layer (always on top)

    // ── State shapes (bottom layer) ───────────────────────────────────────────
    pathsG.selectAll('path')
      .data(features)
      .join('path')
      .attr('d', path)
      .attr('fill', d => {
        const name = normalizeStateName(d.properties?.NAME_1 || '')
        return getScoreColor(lookup[name]?.complianceScore).fill
      })
      .attr('stroke', '#1A2744')
      .attr('stroke-width', 0.6)
      .style('cursor', 'pointer')
      .on('mouseenter', function (event, d) {
        const stateName = d.properties?.NAME_1 || 'Unknown'
        const sd = lookup[normalizeStateName(stateName)]

        // Change style without .raise() — labels are in a separate group on top
        d3.select(this)
          .attr('fill', getScoreColor(sd?.complianceScore).border)
          .attr('stroke', '#ffffff')
          .attr('stroke-width', 1.5)

        // Convert mouse position → SVG coordinate space
        const rect = svgRef.current.getBoundingClientRect()
        const scaleX = W / rect.width
        const scaleY = H / rect.height
        const mx = (event.clientX - rect.left) * scaleX
        const my = (event.clientY - rect.top) * scaleY

        setTooltip({ x: mx, y: my, stateName, stateData: sd })
      })
      .on('mousemove', function (event) {
        const rect = svgRef.current.getBoundingClientRect()
        const scaleX = W / rect.width
        const scaleY = H / rect.height
        const mx = (event.clientX - rect.left) * scaleX
        const my = (event.clientY - rect.top) * scaleY
        setTooltip(prev => prev ? { ...prev, x: mx, y: my } : prev)
      })
      .on('mouseleave', function (event, d) {
        const name = normalizeStateName(d.properties?.NAME_1 || '')
        d3.select(this)
          .attr('fill', getScoreColor(lookup[name]?.complianceScore).fill)
          .attr('stroke', '#1A2744')
          .attr('stroke-width', 0.6)
        setTooltip(null)
      })
      .on('click', function (event, d) {
        const name = normalizeStateName(d.properties?.NAME_1 || '')
        const sd = lookup[name]
        if (onStateClick && sd?.slug) onStateClick(sd.slug)
      })

    // ── State abbreviation labels (top layer — never covered by hovered paths) ─
    labelsG.selectAll('text')
      .data(features)
      .join('text')
      .attr('transform', d => {
        const [cx, cy] = path.centroid(d)
        return `translate(${cx},${cy})`
      })
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'middle')
      .attr('font-size', 8)
      .attr('font-family', 'DM Sans, Inter, sans-serif')
      .attr('fill', 'rgba(255,255,255,0.92)')
      .attr('font-weight', '700')
      .attr('pointer-events', 'none') // labels don't intercept mouse events
      .attr('letter-spacing', '0.5')
      .text(d => {
        const name = d.properties?.NAME_1 || ''
        const area = path.area(d)
        // Only label states large enough to show text
        if (area < 800) return ''
        return ABBREV[name] || name.split(' ').map(w => w[0]).join('')
      })
  }, [topoData, statesData])

  if (error) return (
    <div className="flex items-center justify-center h-64 text-white/40 text-sm">
      Map unavailable
    </div>
  )

  if (!topoData) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  return (
    // wrapperRef tracks the rendered SVG size for tooltip positioning
    <div ref={wrapperRef} className="relative w-full" style={{ lineHeight: 0 }}>
      <svg
        ref={svgRef}
        viewBox={`0 0 ${W} ${H}`}
        preserveAspectRatio="xMidYMid meet"
        style={{ width: '100%', height: 'auto', display: 'block' }}
      />

      {/* Tooltip — positioned in SVG-coordinate space via % */}
      {tooltip && (
        <MapTooltip
          x={tooltip.x}
          y={tooltip.y}
          stateName={tooltip.stateName}
          stateData={tooltip.stateData}
        />
      )}
    </div>
  )
}

// ─── Tooltip ───────────────────────────────────────────────────────────────────
function MapTooltip({ x, y, stateName, stateData }) {
  const score = stateData?.complianceScore
  const c = getScoreColor(score)

  // Convert SVG-space coords (0–W, 0–H) to % for positioning inside the container
  const leftPct = (x / W) * 100
  const topPct = (y / H) * 100

  // Flip to keep tooltip inside
  const flipX = leftPct > 60
  const flipY = topPct > 68

  return (
    <div
      style={{
        position: 'absolute',
        left: flipX ? 'auto' : `${leftPct}%`,
        right: flipX ? `${100 - leftPct}%` : 'auto',
        top: flipY ? 'auto' : `${topPct}%`,
        bottom: flipY ? `${100 - topPct}%` : 'auto',
        transform: flipX
          ? 'translate(0, -50%)'
          : 'translate(8px, -50%)',
        pointerEvents: 'none',
        zIndex: 60,
        minWidth: 170,
        maxWidth: 210,
      }}
    >
      <div
        style={{
          background: 'rgba(10,18,44,0.96)',
          border: `1.5px solid ${c.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
        {/* Accent top bar */}
        <div style={{ height: 3, background: c.border }} />

        <div style={{ padding: '10px 12px 12px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
            <span style={{ color: '#fff', fontWeight: 700, fontSize: 13, lineHeight: 1.2 }}>
              {stateName}
            </span>
            {stateData?.region && (
              <span style={{
                fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1,
                color: 'rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.07)',
                borderRadius: 4, padding: '2px 5px',
              }}>
                {stateData.region}
              </span>
            )}
          </div>

          {score != null ? (
            <>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <div style={{ flex: 1, height: 5, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
                  <div style={{ width: `${score}%`, height: '100%', background: c.border, borderRadius: 99 }} />
                </div>
                <span style={{ color: c.border, fontWeight: 800, fontSize: 15 }}>{score}</span>
              </div>
              <div style={{ fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: 1.5, color: c.border, marginBottom: 6 }}>
                {c.label}
              </div>
              {stateData?.keyIssue && (
                <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.45)', margin: 0, lineHeight: 1.4 }}>
                  ⚠ {stateData.keyIssue}
                </p>
              )}
              {stateData?.slug && (
                <div style={{ marginTop: 8, paddingTop: 8, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#E8872A' }}>Click to view details →</span>
                </div>
              )}
            </>
          ) : (
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', margin: 0, fontStyle: 'italic' }}>
              No compliance data yet
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
