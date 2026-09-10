// src/components/public/GeoMapSection.tsx
import 'leaflet/dist/leaflet.css';
import React, { useEffect, useRef, useState } from 'react';
import * as L from 'leaflet';
import * as esri from 'esri-leaflet';
import { 
  MapPin, 
  Layers, 
  Eye, 
  Building2, 
  HeartPulse, 
  GraduationCap, 
  MoonStar, 
  Store, 
  Hammer, 
  CheckCircle2, 
  Maximize2,
  Info,
  Compass,
  X
} from 'lucide-react';
import { MAP_FACILITIES } from '../../data/mockData';

export const GeoMapSection: React.FC = () => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const leafletMapRef = useRef<any>(null);

  // Layer toggles
  const [showFacilities, setShowFacilities] = useState(true);
  const [showProjects, setShowProjects] = useState(true);
  const [showBoundaries, setShowBoundaries] = useState(true);
  const [selectedFacility, setSelectedFacility] = useState<any>(null);
  const [mapStyle, setMapStyle] = useState<'standard' | 'satellite' | 'topo'>('standard');

  useEffect(() => {
    let isMounted = true;

    const initMap = async () => {
      if (typeof window === 'undefined' || !mapContainerRef.current) return;

      try {


        if (!isMounted || !mapContainerRef.current) return;

        // If map already initialized, remove it
        if (leafletMapRef.current) {
          leafletMapRef.current.remove();
        }

        // Center on Desa Sukadana, Argapura Majalengka (-6.8985, 108.3150)
        const map = L.map(mapContainerRef.current).setView([-6.8985, 108.3150], 15);
        leafletMapRef.current = map;

        // Tile layer based on style
        const tileUrls = {
          standard: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
          satellite: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
          topo: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'
        };

        const currentTile = L.tileLayer(tileUrls[mapStyle], {
          maxZoom: 19,
          attribution: '© OpenStreetMap & Pemdes Sukadana Argapura'
        }).addTo(map);

        // Village Boundary Polygon
        if (showBoundaries) {
          // Fallback static polygon if ESRI fails to load visually
          const villageCoords: [number, number][] = [
            [-6.8900, 108.3050],
            [-6.8880, 108.3280],
            [-6.9080, 108.3300],
            [-6.9100, 108.3070]
          ];
          const fallbackPolygon = L.polygon(villageCoords, {
            color: '#2563EB',
            fillColor: '#3B82F6',
            fillOpacity: 0.1,
            weight: 2,
            dashArray: '6, 6'
          }).addTo(map).bindPopup('<strong>Batas Wilayah Perkiraan (Fallback)</strong>');
          
          // Use BIG Peta Desa WMS / MapServer
          try {
            const bigLayer = esri.dynamicMapLayer({
              url: 'http://petadesa.big.go.id:6080/arcgis/rest/services/IGT_Perdesaan/MapServer',
              opacity: 0.7
            });
            bigLayer.addTo(map);
            
            // If esri layer added successfully, we can hide the fallback (or keep both)
            map.removeLayer(fallbackPolygon);
            
            // To ensure we center properly, BIG bounds for the area might be needed.
          } catch (e) {
            console.error("Failed to load BIG MapServer", e);
          }
        }

        // Add Facility Markers
        MAP_FACILITIES.forEach(fac => {
          if (fac.category === 'Proyek' && !showProjects) return;
          if (fac.category !== 'Proyek' && !showFacilities) return;

          const isProject = fac.category === 'Proyek';
          const markerColor = isProject ? '#F59E0B' : '#2563EB';

          const customIcon = L.divIcon({
            className: 'custom-map-icon',
            html: `
              <div style="
                background: ${markerColor};
                color: #ffffff;
                width: 32px;
                height: 32px;
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                box-shadow: 0 4px 10px rgba(0,0,0,0.3);
                border: 2px solid #ffffff;
                cursor: pointer;
              ">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#ffffff" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
            `,
            iconSize: [32, 32],
            iconAnchor: [16, 32]
          });

          const marker = L.marker([fac.lat, fac.lng], { icon: customIcon }).addTo(map);
          marker.on('click', () => {
            setSelectedFacility(fac);
          });
          marker.bindTooltip(`<strong>${fac.name}</strong><br><span style="font-size:11px">${fac.category}</span>`);
        });

      } catch (err) {
        console.error('Leaflet load error:', err);
      }
    };

    initMap();

    return () => {
      isMounted = false;
      if (leafletMapRef.current) {
        leafletMapRef.current.remove();
        leafletMapRef.current = null;
      }
    };
  }, [showFacilities, showProjects, showBoundaries, mapStyle]);

  return (
    <section id="peta" style={{ padding: '64px 0', background: 'var(--color-bg)' }}>
      <div className="container">
        {/* Section Header */}
        <div style={{ textAlign: 'center', maxWidth: '720px', margin: '0 auto 36px' }}>
          <span style={{
            background: 'var(--color-brand-50)',
            color: 'var(--color-brand-700)',
            padding: '4px 14px',
            borderRadius: 'var(--radius-full)',
            fontSize: '0.8125rem',
            fontWeight: 700,
            letterSpacing: '0.05em',
            textTransform: 'uppercase',
            display: 'inline-block',
            marginBottom: '12px'
          }}>
            Modul Geospasial Interaktif
          </span>
          <h2 className="text-title" style={{ marginBottom: '12px' }}>
            Peta Kawasan, Fasilitas & Pembangunan Desa
          </h2>
          <p style={{ color: 'var(--color-text-secondary)', fontSize: '1.0625rem' }}>
            Jelajahi batas wilayah desa, titik fasilitas umum, sebaran penduduk, serta lokasi proyek infrastruktur secara interaktif.
          </p>
        </div>

        {/* Map Control Bar */}
        <div style={{
          background: 'var(--color-surface)',
          borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0',
          border: '1px solid var(--color-border)',
          borderBottom: 'none',
          padding: '16px 20px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px'
        }}>
          {/* Layer toggles */}
          <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.8125rem', fontWeight: 700, color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Layers size={16} /> Lapisan Peta:
            </span>
            <button
              onClick={() => setShowBoundaries(!showBoundaries)}
              className={`btn btn-sm ${showBoundaries ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <MapPin size={14} /> Batas Wilayah ({showBoundaries ? 'Aktif' : 'Off'})
            </button>
            <button
              onClick={() => setShowFacilities(!showFacilities)}
              className={`btn btn-sm ${showFacilities ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Building2 size={14} /> Fasilitas Umum ({showFacilities ? 'Aktif' : 'Off'})
            </button>
            <button
              onClick={() => setShowProjects(!showProjects)}
              className={`btn btn-sm ${showProjects ? 'btn-primary' : 'btn-secondary'}`}
              style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Hammer size={14} /> Proyek Infrastruktur ({showProjects ? 'Aktif' : 'Off'})
            </button>
          </div>

          {/* Map style switch */}
          <div style={{
            display: 'flex',
            background: 'var(--color-surface-raised)',
            padding: '3px',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--color-border)'
          }}>
            {(['standard', 'satellite', 'topo'] as const).map(styleKey => (
              <button
                key={styleKey}
                onClick={() => setMapStyle(styleKey)}
                style={{
                  background: mapStyle === styleKey ? 'var(--color-surface)' : 'transparent',
                  color: mapStyle === styleKey ? 'var(--color-brand-600)' : 'var(--color-text-secondary)',
                  border: 'none',
                  borderRadius: 'var(--radius-sm)',
                  padding: '5px 10px',
                  fontSize: '0.75rem',
                  fontWeight: mapStyle === styleKey ? 700 : 500,
                  cursor: 'pointer',
                  textTransform: 'capitalize'
                }}
              >
                {styleKey === 'standard' ? 'Peta Standar' : styleKey === 'satellite' ? 'Satelit' : 'Topografi'}
              </button>
            ))}
          </div>
        </div>

        {/* Leaflet Map & Info Split Pane */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: selectedFacility ? '1fr 340px' : '1fr',
          border: '1px solid var(--color-border)',
          borderRadius: '0 0 var(--radius-xl) var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)',
          background: 'var(--color-surface)',
          minHeight: '520px'
        }}>
          {/* Leaflet DOM container */}
          <div 
            ref={mapContainerRef} 
            style={{ width: '100%', height: '520px', zIndex: 1 }}
          />

          {/* Selected facility detail panel */}
          {selectedFacility && (
            <div style={{
              background: 'var(--color-surface)',
              borderLeft: '1px solid var(--color-border)',
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              animation: 'slideUpFade 0.25s ease-out'
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                  <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    color: selectedFacility.category === 'Proyek' ? 'var(--color-warning-fg)' : 'var(--color-brand-700)',
                    background: selectedFacility.category === 'Proyek' ? 'var(--color-warning-50)' : 'var(--color-brand-50)',
                    padding: '3px 8px',
                    borderRadius: '4px'
                  }}>
                    {selectedFacility.category}
                  </span>
                  <button 
                    onClick={() => setSelectedFacility(null)}
                    style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-text-muted)', fontSize: '0.875rem', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                  >
                    <X size={14} /> Tutup
                  </button>
                </div>

                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, marginBottom: '10px' }}>
                  {selectedFacility.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', lineHeight: 1.6, marginBottom: '20px' }}>
                  {selectedFacility.desc}
                </p>

                <div style={{
                  background: 'var(--color-surface-raised)',
                  borderRadius: 'var(--radius-md)',
                  padding: '12px',
                  border: '1px solid var(--color-border)',
                  fontSize: '0.8125rem',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Koordinat GPS:</span>
                    <strong className="font-mono">{selectedFacility.lat.toFixed(4)}, {selectedFacility.lng.toFixed(4)}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--color-text-muted)' }}>Status Akses:</span>
                    <span style={{ color: 'var(--color-success-600)', fontWeight: 600 }}>Terbuka untuk Umum</span>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: '24px' }}>
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${selectedFacility.lat},${selectedFacility.lng}`}
                  target="_blank"
                  rel="noreferrer"
                  className="btn btn-primary"
                  style={{ width: '100%', textDecoration: 'none' }}
                >
                  <Compass size={16} /> Buka di Google Maps
                </a>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
