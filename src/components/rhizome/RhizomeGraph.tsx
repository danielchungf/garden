"use client";

import { useRef, useEffect, useState, useCallback } from "react";
import {
  forceSimulation,
  forceLink,
  forceManyBody,
  forceX,
  forceY,
  forceCollide,
  type Simulation,
} from "d3-force";
import { select, selectAll } from "d3-selection";
import { zoom as d3Zoom, type D3ZoomEvent } from "d3-zoom";
import { drag as d3Drag, type D3DragEvent } from "d3-drag";
import "d3-transition";
import {
  nodes as rawNodes,
  links as rawLinks,
  CATEGORIES,
  type RhizomeNode,
  type RhizomeLink,
} from "./rhizome-data";

const GRAPH_HEIGHT = 520;

export default function RhizomeGraph() {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);
  const simRef = useRef<Simulation<RhizomeNode, RhizomeLink> | null>(null);
  const [width, setWidth] = useState(620);

  // Measure container width
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const measure = () => {
      const rect = container.getBoundingClientRect();
      setWidth(rect.width);
    };

    measure();

    const ro = new ResizeObserver(measure);
    ro.observe(container);
    return () => ro.disconnect();
  }, []);

  // D3 force simulation
  useEffect(() => {
    const svg = svgRef.current;
    if (!svg || width === 0) return;

    const height = GRAPH_HEIGHT;

    // Deep copy data so D3 can mutate it
    // Initialize all nodes at center with tiny jitter — simulation spreads them outward
    const cx = width / 2;
    const cy = height / 2;
    const nodeData: RhizomeNode[] = rawNodes.map((d) => ({
      ...d,
      x: cx + (Math.random() - 0.5) * 4,
      y: cy + (Math.random() - 0.5) * 4,
    }));
    const linkData: RhizomeLink[] = rawLinks.map((d) => ({
      source: d.source,
      target: d.target,
    }));

    // Clear previous render
    const svgSel = select(svg);
    svgSel.selectAll("*").remove();

    // Container group for zoom/pan
    const container = svgSel.append("g");

    // Zoom — ctrl+scroll / pinch only
    const zoomBehavior = d3Zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 2.5])
      .filter((event: Event) => {
        // Allow drag (mousedown/touchstart)
        if (event.type === "mousedown" || event.type === "touchstart") return true;
        // Allow pinch (touch with 2+ fingers)
        if (event.type === "touchmove") return true;
        // For wheel events, require ctrl/meta key
        if (event.type === "wheel") {
          return (event as WheelEvent).ctrlKey || (event as WheelEvent).metaKey;
        }
        return false;
      })
      .on("zoom", (event: D3ZoomEvent<SVGSVGElement, unknown>) => {
        container.attr("transform", event.transform.toString());
      });

    svgSel.call(zoomBehavior);
    // Prevent double-click zoom
    svgSel.on("dblclick.zoom", null);

    // Links — start invisible, fade in
    const linkSel = container
      .append("g")
      .selectAll<SVGLineElement, RhizomeLink>("line")
      .data(linkData)
      .join("line")
      .attr("stroke", "#d4d4d4")
      .attr("stroke-opacity", 0)
      .attr("stroke-width", 0.8);

    linkSel.transition().delay(300).duration(800).attr("stroke-opacity", 0.4);

    // Node groups
    const nodeSel = container
      .append("g")
      .selectAll<SVGGElement, RhizomeNode>("g")
      .data(nodeData)
      .join("g")
      .style("cursor", "grab");

    // Circles — start as tiny dots, scale up from center
    nodeSel
      .append("circle")
      .attr("r", 0)
      .attr("fill", (d) => CATEGORIES[d.group])
      .attr("fill-opacity", 0.85)
      .transition()
      .delay((_d, i) => 80 + i * 20)
      .duration(500)
      .attr("r", 4);

    // Labels — fade in after circles
    nodeSel
      .append("text")
      .text((d) => d.label)
      .attr("opacity", 0)
      .attr("font-size", "12px")
      .attr("font-weight", "400")
      .attr("letter-spacing", "-0.01em")
      .attr("fill", "#737373") // neutral-500
      .attr("x", 8)
      .attr("y", 0)
      .attr("dominant-baseline", "middle")
      .attr("pointer-events", "none")
      .transition()
      .delay((_d, i) => 400 + i * 20)
      .duration(600)
      .attr("opacity", 1);

    // SVG title for accessibility
    nodeSel.append("title").text((d) => d.id);

    // Hover interactions
    nodeSel
      .on("mouseenter", (_event, d) => {
        const neighbors = new Set<string>([d.id]);
        linkData.forEach((l) => {
          const s = typeof l.source === "string" ? l.source : l.source.id;
          const t = typeof l.target === "string" ? l.target : l.target.id;
          if (s === d.id) neighbors.add(t);
          if (t === d.id) neighbors.add(s);
        });

        const color = CATEGORIES[d.group];

        nodeSel
          .selectAll<SVGCircleElement, RhizomeNode>("circle")
          .attr("opacity", (n) => (neighbors.has(n.id) ? 1 : 0.08));

        nodeSel
          .selectAll<SVGTextElement, RhizomeNode>("text")
          .attr("fill", (n) => {
            if (n.id === d.id) return "#262626"; // neutral-800
            if (neighbors.has(n.id)) return "#525252"; // neutral-600
            return "#737373";
          })
          .attr("opacity", (n) => (neighbors.has(n.id) ? 1 : 0.04));

        linkSel
          .attr("stroke", (l) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return s === d.id || t === d.id ? color : "#d4d4d4";
          })
          .attr("stroke-opacity", (l) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return s === d.id || t === d.id ? 0.7 : 0.1;
          })
          .attr("stroke-width", (l) => {
            const s = typeof l.source === "string" ? l.source : l.source.id;
            const t = typeof l.target === "string" ? l.target : l.target.id;
            return s === d.id || t === d.id ? 1.2 : 0.5;
          });
      })
      .on("mouseleave", () => {
        nodeSel
          .selectAll<SVGCircleElement, RhizomeNode>("circle")
          .attr("opacity", 1);

        nodeSel
          .selectAll<SVGTextElement, RhizomeNode>("text")
          .attr("fill", "#737373")
          .attr("opacity", 1);

        linkSel
          .attr("stroke", "#d4d4d4")
          .attr("stroke-opacity", 0.4)
          .attr("stroke-width", 0.8);
      });

    // Drag
    const dragBehavior = d3Drag<SVGGElement, RhizomeNode>()
      .on("start", (event: D3DragEvent<SVGGElement, RhizomeNode, RhizomeNode>, d) => {
        if (!event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
      })
      .on("drag", (event: D3DragEvent<SVGGElement, RhizomeNode, RhizomeNode>, d) => {
        d.fx = event.x;
        d.fy = event.y;
      })
      .on("end", (event: D3DragEvent<SVGGElement, RhizomeNode, RhizomeNode>, d) => {
        if (!event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
      });

    nodeSel.call(dragBehavior);

    // Force simulation — scale params to viewport
    const isNarrow = width < 600;
    const charge = isNarrow ? -300 : -700;
    const xStrength = isNarrow ? 0.12 : 0.05;
    const yStrength = isNarrow ? 0.15 : 0.09;
    const linkDist = isNarrow ? 60 : 100;
    const collisionR = isNarrow ? 28 : 36;

    const simulation = forceSimulation<RhizomeNode>(nodeData)
      .force(
        "link",
        forceLink<RhizomeNode, RhizomeLink>(linkData)
          .id((d) => d.id)
          .distance(linkDist)
          .strength(0.4)
      )
      .force("charge", forceManyBody().strength(charge))
      .force("x", forceX(width / 2).strength(xStrength))
      .force("y", forceY(height / 2).strength(yStrength))
      .force("collision", forceCollide(collisionR));

    // Padding to keep nodes + labels visible
    const pad = isNarrow ? 12 : 40;

    simulation.on("tick", () => {
      // Clamp nodes within SVG bounds
      nodeData.forEach((d) => {
        d.x = Math.max(pad, Math.min(width - pad - 60, d.x!));
        d.y = Math.max(pad, Math.min(height - pad, d.y!));
      });

      linkSel
        .attr("x1", (d) => (d.source as RhizomeNode).x!)
        .attr("y1", (d) => (d.source as RhizomeNode).y!)
        .attr("x2", (d) => (d.target as RhizomeNode).x!)
        .attr("y2", (d) => (d.target as RhizomeNode).y!);

      nodeSel.attr("transform", (d) => `translate(${d.x},${d.y})`);
    });

    simRef.current = simulation;

    return () => {
      simulation.stop();
      simRef.current = null;
    };
  }, [width]);

  return (
    <div ref={containerRef} className="mt-6">
      <div className="max-w-[660px] mx-auto px-5 mb-6 space-y-4">
        <h2 className="text-h2 text-content-primary">Onigiri as a rhizome</h2>
        <p className="text-body-regular text-content-tertiary">
          A rhizome is an underground stem (ginger, grass, potatoes) that spreads horizontally with no central root. Any segment can regenerate the whole. Deleuze and Guattari proposed the rhizome as a model for thought without hierarchy, no root, no center, no fixed path. Any point connects to any other. It breaks and regrows.
        </p>
        <p className="text-body-regular text-content-tertiary">
          Onigiri works like a rhizome, there&apos;s no single starting point or rigid hierarchy. You can enter from anywhere: a journal entry, a person file, a work digest, a project note. Each piece connects to others across categories: a meeting note links to a client, which links to a person, which shows up in a journal entry alongside what you cooked that night. Nothing depends on everything else being in place. It doesn&apos;t break because there&apos;s no trunk to cut.
        </p>
      </div>
      <div className="overflow-hidden">
        <svg
          ref={svgRef}
          width={width}
          height={GRAPH_HEIGHT}
          className="select-none"
          style={{ cursor: "grab", display: "block" }}
          role="img"
          aria-label="Rhizome visualization of the Onigiri file structure — an interactive force-directed graph showing how folders connect to each other."
        />
      </div>

      {/* Legend */}
      <div className="mt-4 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
        {Object.entries(CATEGORIES).map(([name, color]) => (
          <div key={name} className="flex items-center gap-1.5">
            <span
              className="w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ backgroundColor: color }}
            />
            <span className="text-body-small text-content-muted">{name}</span>
          </div>
        ))}
      </div>

      {/* Hint */}
      <p className="text-body-small text-content-muted mt-2 text-center">
        Drag to rearrange · Pinch to zoom
      </p>
    </div>
  );
}
