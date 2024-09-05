import React from 'react'
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import ZoomInIcon from '@mui/icons-material/ZoomIn';

const ZoomComponent = ({ zoom, setZoom }) => {

    return (
      <div className="zoom-container">
        <button onClick={() => setZoom(Math.max((zoom - 0.5), 1))}>
          <ZoomOutIcon />
        </button>
        <input className="zoom-slider" type="range" min="1" max="4.5" step="0.1" value={zoom} onChange={(e) => setZoom(parseFloat(e.target.value))} style={{
          background: `linear-gradient(to right, #007AFF 0%, #007AFF ${(zoom - 1) / 3.5 * 100}%, #0000000D ${(zoom - 1) / 3.5 * 100}%, #0000000D 100%)`
        }}/>
        <button onClick={() => setZoom(Math.min((zoom + 0.5), 4.5))}>
          <ZoomInIcon />
        </button>
      </div>
    );
  }

  export default ZoomComponent;