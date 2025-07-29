document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const clickSound = document.getElementById("click-sound");
  const loader = document.getElementById("loader");
  const sonidoOverlay = document.getElementById("reactivar-sonido");
  const startBtn = document.getElementById("start-experience");
  const TOTAL_MARCADORES = 22;

  let soundEnabled = false;
  let experienciaIniciada = false;

  // Mostrar botón iniciar al cargar
  window.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
    if (startBtn) startBtn.style.display = "block";
  });

  // Al presionar "Iniciar experiencia"
  startBtn.addEventListener("click", () => {
    soundEnabled = true;
    experienciaIniciada = true;
    localStorage.setItem("sound-enabled", "true");
    startBtn.style.display = "none";
    if (clickSound) clickSound.play().catch(() => {});
  });

  for (let i = 0; i < TOTAL_MARCADORES; i++) {
    const target = document.createElement("a-entity");
    target.setAttribute("mindar-image-target", `targetIndex: ${i}`);

    let videoEl = null;
    let plane = null;
    const videoId = `video-${i + 1}`;
    const videoSrc = `assets/videos/video${i + 1}.mp4`;

    target.addEventListener("targetFound", () => {
      if (!experienciaIniciada) return;

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
        videoEl.muted = false; // ahora sí permitimos sonido
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
        videoEl.muted = false;
        videoEl.load();
        intentarReproducirVideo(videoEl);
      }

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
