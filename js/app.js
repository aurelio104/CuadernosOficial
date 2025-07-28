document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const enableSoundBtn = document.getElementById("enable-sound");
  const clickSound = document.getElementById("click-sound");
  const loader = document.getElementById("loader");
  const sonidoOverlay = document.getElementById("reactivar-sonido");
  const TOTAL_MARCADORES = 22;

  let soundEnabled = false;

  const soundEnabledPref = localStorage.getItem("sound-enabled");
  if (soundEnabledPref === "true") {
    soundEnabled = true;
    enableSoundBtn.style.display = "none";
  }

  enableSoundBtn.addEventListener("click", () => {
    if (clickSound) clickSound.play().catch(() => {});
    soundEnabled = true;
    localStorage.setItem("sound-enabled", "true");
    enableSoundBtn.style.display = "none";
  });

  window.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
  });

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
        videoEl.setAttribute("playsinline", true);
        videoEl.setAttribute("crossorigin", "anonymous");
        videoEl.style.display = "none";
        videoEl.muted = !soundEnabled;
        document.body.appendChild(videoEl);

        videoEl.addEventListener("loadeddata", () => {
          plane = document.createElement("a-video");
          plane.setAttribute("src", `#${videoId}`);
          plane.setAttribute("width", "1");
          plane.setAttribute("height", "1.4");
          plane.setAttribute("position", "0 0 0");
          plane.setAttribute("rotation", "0 0 0");
          target.appendChild(plane);

          intentarReproducirVideo(videoEl);
        });

        videoEl.load();
      } else {
        videoEl.muted = !soundEnabled;
        videoEl.load();
        intentarReproducirVideo(videoEl);
      }

      // Acción si el usuario toca "Reactivar sonido"
      if (sonidoOverlay) {
        sonidoOverlay.onclick = () => {
          sonidoOverlay.style.display = "none";
          videoEl.muted = false;
          videoEl.currentTime = 0;
          videoEl.play().catch(() => {
            console.warn(`🚫 Aún no se puede reproducir con audio.`);
          });
        };
      }
    });

    target.addEventListener("targetLost", () => {
      console.log(`🕳️ Marcador perdido: targetIndex = ${i}`);
      if (markerInfo) markerInfo.innerText = `Marcador: ---`;
      if (videoEl) {
        videoEl.pause();
        videoEl.currentTime = 0;
      }
    });

    scene.appendChild(target);
  }

  function intentarReproducirVideo(videoEl) {
    videoEl.play().catch(() => {
      console.warn(`⚠️ No se pudo reproducir con sonido. Probando sin sonido.`);
      videoEl.muted = true;
      videoEl.play().then(() => {
        if (sonidoOverlay) sonidoOverlay.style.display = "block";
      }).catch(() => {
        console.warn(`🚫 Falla incluso en modo silencioso`);
      });
    });
  }
});
