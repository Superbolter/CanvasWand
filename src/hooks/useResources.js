import React from "react";

const useResources = () => {
  function getCdnUrl() {
    // return window.assetCdnUrls[Math.floor(Math.random() * assetCdnUrls.length)];
    if (window.env_asset_url) {
      var cdn_link = window.env_asset_url;
      var cndIndex = window.currentCDNIndex;
      cdn_link = cdn_link.replace(/1/, cndIndex);

      if (window.currentCDNIndex < 4) {
        window.currentCDNIndex = window.currentCDNIndex + 1;
      } else {
        window.currentCDNIndex = 1;
      }
      return cdn_link;
    }

    return window.env_asset_url;
  }

  function getRomeCdnUrl() {
    // return window.assetCdnUrls[Math.floor(Math.random() * assetCdnUrls.length)];
    if (window.env_rome_asset_url) {
      var rome_cdn_link = window.env_rome_asset_url;
      var cndIndex = window.currentRomeCDNIndex;
      rome_cdn_link = rome_cdn_link.replace(/1/, cndIndex);

      if (window.currentRomeCDNIndex < 4) {
        window.currentRomeCDNIndex = window.currentRomeCDNIndex + 1;
      } else {
        window.currentRomeCDNIndex = 1;
      }
      return rome_cdn_link;
    }

    return window.env_rome_asset_url;
  }
  return {
    getCdnUrl,
    getRomeCdnUrl,
  };
};

export default useResources;
