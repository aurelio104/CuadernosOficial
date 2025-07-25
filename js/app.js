document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const TOTAL_MARCADORES = 22;

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${i}`);

    let videoEl = null;
    let plane = null;
    const videoId = `video-${i + 1}`;
    const videoSrc = `assets/videos/video${i + 1}.mp4`;

    target.addEventListener("targetFound", () => {
      console.log(`✅ Marcador detectado: targetIndex = ${i}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ${i}`;

      if (!videoEl) {
        videoEl = document.createElement("video");
        videoEl.setAttribute("id", videoId);
        videoEl.setAttribute("src", videoSrc);
        videoEl.setAttribute("loop", true);
        videoEl.setAttribute("muted", true);
        videoEl.setAttribute("playsinline", true);
        videoEl.setAttribute("crossorigin", "anonymous");
        videoEl.style.display = "none";
        document.body.appendChild(videoEl);

        videoEl.addEventListener("loadeddata", () => {
          plane = document.createElement("a-video");
          plane.setAttribute("src", `#${videoId}`);
          plane.setAttribute("width", "1");
          plane.setAttribute("height", "1.4");
          plane.setAttribute("position", "0 0 0");
          plane.setAttribute("rotation", "0 0 0");
          target.appendChild(plane);

          videoEl.play().catch(() => {
            console.warn(`⚠️ No se pudo reproducir el video: ${videoSrc}`);
          });
        });

        videoEl.load(); // fuerza el preload
      } else {
        videoEl.play().catch(() => {
          console.warn(`⚠️ No se pudo reproducir el video: ${videoSrc}`);
        });
      }
    });

    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: targetIndex = ${i}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      if (videoEl) videoEl.pause();
    });

    scene.appendChild(target);
  }
});
