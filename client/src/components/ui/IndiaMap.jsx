import { useEffect, useRef, useState } from 'react'
import * as d3 from 'd3'

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
  if (!name) return ''
  // Standardize to lowercase, replace punctuation with spaces, collapse extra spaces
  let n = name.toLowerCase()
    .replace(/[&\-,\/]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
  
  // Hand-tuned fuzzy aliases to match SVG text vs Database names
  if (n.includes('jammu') && n.includes('kashmir')) return 'jammu and kashmir'
  if (n === 'orissa') return 'odisha'
  // Common misspellings for Uttarakhand
  if (n === 'uttrakhand' || n === 'uttarakhand' || n === 'uttaranchal') return 'uttarakhand'
  // Handles multi-line split text from SVG and database variations
  if (n.includes('dadra') && n.includes('haveli')) return 'dadra and nagar haveli'
  if (n.includes('daman') && n.includes('diu')) return 'daman and diu'
  if (n.includes('andaman') && n.includes('nicobar')) return 'andaman and nicobar islands'
  if (n === 'pondy' || n === 'pondicherry') return 'puducherry'

  return n
}

function buildStateLookup(statesData) {
  const lookup = {}
  if (!Array.isArray(statesData)) return lookup
  statesData.forEach(s => {
    if (s && s.name) {
      const norm = normalizeStateName(s.name)
      lookup[norm] = s
    }
  })
  return lookup
}

export default function IndiaMap({ statesData = [], onStateClick }) {
  const wrapperRef = useRef(null)
  const svgContainerRef = useRef(null)
  
  const [svgDoc, setSvgDoc] = useState(null)
  const [tooltip, setTooltip] = useState(null) // { x,y,stateName,stateData, svgW, svgH }
  const [error, setError] = useState(false)

  // 1. Load the Official Map SVG once
  useEffect(() => {
    d3.xml('/india-map-en.svg')
      .then(xml => setSvgDoc(xml))
      .catch(() => setError(true))
  }, [])

  // 2. Draw map whenever svgDoc or statesData changes
  useEffect(() => {
    if (!svgDoc || !svgContainerRef.current) return

    const lookup = buildStateLookup(statesData)
    const container = d3.select(svgContainerRef.current)
    container.selectAll('*').remove()

    // Import the deeply nested SVG document into the DOM
    const importedNode = document.importNode(svgDoc.documentElement, true)
    container.node().appendChild(importedNode)

    const svg = container.select('svg')
    // Read the original dimensions to create a proper viewBox, as the Wikimedia SVG lacks it
    const origW = parseFloat(svg.attr('width')) || 1519
    const origH = parseFloat(svg.attr('height')) || 1773

    // Make the SVG scale perfectly within the wrapper
    svg.attr('viewBox', `0 0 ${origW} ${origH}`)
       .attr('preserveAspectRatio', 'xMidYMid meet')
       .attr('width', '100%')
       .attr('height', '100%')
       .style('display', 'block')

    // Optional: Hide the Malayalam regional language layer
    svg.select('#layer38').style('display', 'none')

    // Delay the layout-dependent calculations to ensure the SVG is painted by the browser
    setTimeout(() => {
      // Extract names and physical screen coordinates from layer35 (the text label layer)
      const labels = []
      const layer35Node = svg.select('#layer35').node()
      
      svg.select('#layer35').selectAll('switch').each(function () {
        const sw = d3.select(this)
        const texts = sw.selectAll('text').nodes()
        const enText = texts.find(n => !n.hasAttribute('systemLanguage')) || texts[0]
        
        if (enText) {
          let name = ''
          d3.select(enText).selectAll('tspan').each(function() {
            name += d3.select(this).text() + ' '
          })
          // Collapse multiple spaces from newlines or multi-tspan into single space
          name = name.replace(/\s+/g, ' ').trim()

          const rect = enText.getBoundingClientRect()
          if (name && rect && rect.width > 0) {
            const cx = rect.left + rect.width / 2
            const cy = rect.top + rect.height / 2
            labels.push({ cx, cy, name })
          }
        }
      })

      // Skip massive paths (e.g. background/outline artifacts)
      svg.selectAll('g[id^="layer"]').each(function () {
        const id = d3.select(this).attr('id')
        if (id === 'layer35' || id === 'layer38') return
        const rect = this.getBoundingClientRect()
        const area = rect.width * rect.height
        // If layer covers more than 60% of the SVG wrapper, disable it
        const svgRect = svgContainerRef.current.getBoundingClientRect()
        if (area > (svgRect.width * svgRect.height) * 0.6) {
            d3.select(this).style('pointer-events', 'none').style('fill', 'none')
        }
      })

      const mapping = {}

      // Temporarily hide the text layer so we can hit-test the physical state boundaries behind it!
      if (layer35Node) {
        layer35Node.style.display = 'none'
      }

      const layersInfo = [];
      svg.selectAll('g[id^="layer"]').each(function () {
        const id = d3.select(this).attr('id');
        if (id === 'layer35' || id === 'layer38') return;
        const rect = this.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          layersInfo.push({ id, cx: rect.left + rect.width / 2, cy: rect.top + rect.height / 2 });
        }
      });

      const pairs = [];
      labels.forEach(l => {
        const sampleOffsets = [
          {dx: 0, dy: 0},
          {dx: -10, dy: -10}, {dx: 10, dy: -10},
          {dx: -10, dy: 10}, {dx: 10, dy: 10},
          {dx: -15, dy: 0}, {dx: 15, dy: 0},
          {dx: 0, dy: -15}, {dx: 0, dy: 15}
        ];
        
        const hitIds = new Set();
        sampleOffsets.forEach(off => {
          const x = l.cx + off.dx;
          const y = l.cy + off.dy;
          const elems = document.elementsFromPoint(x, y);
          elems.forEach(e => {
            const parent = e.closest('g[id^="layer"]');
            if (parent && parent.id !== 'layer35' && parent.id !== 'layer38' && parent.style.pointerEvents !== 'none') {
               hitIds.add(parent.id);
            }
          });
        });

        layersInfo.forEach(ly => {
           let dist = Math.hypot(ly.cx - l.cx, ly.cy - l.cy);
           let score = dist;
           if (hitIds.has(ly.id)) {
               score = dist * 0.0001; // huge bonus if it physically overlays the state
           }
           pairs.push({ label: l.name, layer: ly.id, score });
        });
      });

      // 1-to-1 Greedy Match: Assign smallest scores first, avoiding any overlap/collision
      pairs.sort((a, b) => a.score - b.score);
      const usedLabels = new Set();
      const usedLayers = new Set();
      
      pairs.forEach(p => {
          if (!usedLabels.has(p.label) && !usedLayers.has(p.layer)) {
              mapping[p.layer] = p.label;
              usedLabels.add(p.label);
              usedLayers.add(p.layer);
          }
      });

      // Restore the text layer
      if (layer35Node) {
        layer35Node.style.display = ''
      }
      svg.selectAll('g[id^="layer"]').each(function () {
        const id = d3.select(this).attr('id')
        if (id === 'layer35' || id === 'layer38') return

        const stateName = mapping[id]
        if (!stateName) return

        const normalized = normalizeStateName(stateName)
        const sd = lookup[normalized]
        const score = sd?.complianceScore !== undefined && sd?.complianceScore !== null ? Number(sd.complianceScore) : null
        // Preserve original SVG colors; do not override fill or stroke
        const shapes = d3.select(this).selectAll('path, polygon, polyline')
        
        // Attach data attributes for later use (state name and compliance score)
        shapes.attr('data-state-name', normalized)
        if (score !== null) {
          shapes.attr('data-score', score)
        }
        // No fill or stroke changes here – keep the map's native colors
        
        // Attach interaction events directly to the group layer
        d3.select(this)
          .style('cursor', 'pointer')
          .style('transition', 'all 0.15s ease')
          .on('mouseenter', function (event) {
            // Highlight on hover with a subtle white outline
            shapes.attr('stroke', '#ffffff')
                  .attr('stroke-width', 3)
            
            // Also ensure layer35 is re-raised so text stays on very top
            const layer35 = document.getElementById('layer35')
            if (layer35) layer35.parentNode.appendChild(layer35)

            const rect = wrapperRef.current.getBoundingClientRect()
            const mx = event.clientX - rect.left
            const my = event.clientY - rect.top
            setTooltip({ x: mx, y: my, stateName, stateData: sd, svgW: rect.width, svgH: rect.height })
          })
          .on('mousemove', function (event) {
            const rect = wrapperRef.current.getBoundingClientRect()
            const mx = event.clientX - rect.left
            const my = event.clientY - rect.top
            setTooltip(prev => prev ? { ...prev, x: mx, y: my } : prev)
          })
          .on('mouseleave', function (event) {
            // Remove hover outline, restore original stroke (by clearing overrides)
            shapes.attr('stroke', null)
                  .attr('stroke-width', null)
            setTooltip(null)
          })
          .on('click', function (event) {
            if (onStateClick && sd?.slug) onStateClick(sd.slug)
          })
      })
      
      // Fix text labels visually
      svg.select('#layer35')
        .style('pointer-events', 'none')
        .selectAll('text')
        .each(function() {
          d3.select(this)
           .style('font-family', '"DM Sans", "Inter", sans-serif')
           .style('font-size', '25px')
           .style('font-weight', '800')
           .attr('fill', '#ffffff')
        })
    }, 50)

  }, [svgDoc, statesData])

  if (error) return (
    <div className="flex items-center justify-center h-64 text-white/40 text-sm">
      Map unavailable
    </div>
  )

  if (!svgDoc) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin" />
    </div>
  )

  return (
    <div ref={wrapperRef} className="relative w-full" style={{ lineHeight: 0 }}>
      {/* Container for the injected SVG */}
      <div ref={svgContainerRef} className="w-full h-auto" />

      {/* Tooltip */}
      {tooltip && (
        <MapTooltip
          x={tooltip.x}
          y={tooltip.y}
          svgW={tooltip.svgW}
          svgH={tooltip.svgH}
          stateName={tooltip.stateName}
          stateData={tooltip.stateData}
        />
      )}
    </div>
  )
}

function MapTooltip({ x, y, svgW, svgH, stateName, stateData }) {
  const score = stateData?.complianceScore !== undefined && stateData?.complianceScore !== null 
                ? Number(stateData.complianceScore) 
                : null
  const c = getScoreColor(score)

  // Use component sizes for percentages
  const leftPct = (x / svgW) * 100
  const topPct = (y / svgH) * 100

  // Flip tooltip if close to the edge
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
          background: 'rgba(16, 28, 62, 0.96)',
          border: `1.5px solid ${c.border}`,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: `0 8px 32px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)`,
        }}
      >
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
                  <span style={{ fontSize: 10, fontWeight: 700, color: '#E8872A' }}>Click to view !</span>
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
