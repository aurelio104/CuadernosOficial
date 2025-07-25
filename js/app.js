document.addEventListener("DOMContentLoaded", () => {
  const scene = document.querySelector("a-scene");
  const markerInfo = document.getElementById("marker-info");
  const enableSoundBtn = document.getElementById("enable-sound");
  const clickSound = document.getElementById("click-sound");
  const loader = document.getElementById("loader");
  const TOTAL_MARCADORES = 22;

  let soundEnabled = false;

  // Verifica si el usuario ya activó el sonido anteriormente
  const soundEnabledPref = localStorage.getItem("sound-enabled");
  if (soundEnabledPref === "true") {
    soundEnabled = true;
    enableSoundBtn.style.display = "none";
  }

  // Botón para activar sonido
  enableSoundBtn.addEventListener("click", () => {
    if (clickSound) clickSound.play().catch(() => {});
    soundEnabled = true;
    localStorage.setItem("sound-enabled", "true");
    enableSoundBtn.style.display = "none";
  });

  // Ocultar loader cuando la página haya cargado
  window.addEventListener("load", () => {
    if (loader) loader.style.display = "none";
  });

  // Crear marcadores dinámicamente
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

          // Intentar reproducir con sonido (si fue activado)
          videoEl.play().catch(() => {
            console.warn(`⚠️ No se pudo reproducir el video con sonido: ${videoSrc}`);
            videoEl.muted = true;
            videoEl.play().catch(() => {
              console.warn(`🚫 Falla incluso con muted: ${videoSrc}`);
            });
          });
        });

        videoEl.load(); // Forzar preload
      } else {
        videoEl.muted = !soundEnabled;
        videoEl.play().catch(() => {
          console.warn(`⚠️ No se pudo reproducir el video con sonido: ${videoSrc}`);
          videoEl.muted = true;
          videoEl.play().catch(() => {
            console.warn(`🚫 Falla incluso con muted: ${videoSrc}`);
          });
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
