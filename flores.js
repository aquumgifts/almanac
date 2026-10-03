/*
 * Dibujos de línea de las 12 flores de nacimiento, con la estética de Aquum.
 * Cada flor se dibuja en una caja de -50 a 50 (centro en 0,0); quien la usa la
 * mueve y la escala con transform. La flor queda «parada» sobre el punto (0, 40),
 * donde termina el tallo de las plantillas.
 *
 *   <script src="flores.js"></script>
 *   grupo.innerHTML = aquumFlor(mes)   // mes de 0 (enero) a 11 (diciembre)
 *
 * La usan la lámina de las 12 flores, las etiquetas, las tarjetas y los pines.
 */
(function () {
  const L = "#c98f8f";   // línea
  const F = "#f7e6e3";   // relleno suave
  const F2 = "#f0d9d6";  // relleno de fondo, un tono más
  const C = "#e8c08b";   // centros dorados
  const V = "#8a9a7b";   // verde de tallos y hojas
  const VF = "#dfe5d6";
  const W = 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';

  const rad = (g) => (g * Math.PI) / 180;
  const p = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];
  const f = (n) => n.toFixed(1);

  // Pétalo en gota desde el centro hacia el ángulo a: largo r, ancho w.
  function petalo(r, w, a, relleno = F, cx = 0, cy = 0) {
    const [px, py] = p(r, a), [l1x, l1y] = p(w, a - 90), [l2x, l2y] = p(w, a + 90);
    const [m1x, m1y] = p(r * 0.55, a);
    return `<path d="M${f(cx)} ${f(cy)} C ${f(cx + m1x + l1x)} ${f(cy + m1y + l1y)}, ${f(cx + px + l1x * 0.5)} ${f(cy + py + l1y * 0.5)}, ${f(cx + px)} ${f(cy + py)} C ${f(cx + px + l2x * 0.5)} ${f(cy + py + l2y * 0.5)}, ${f(cx + m1x + l2x)} ${f(cy + m1y + l2y)}, ${f(cx)} ${f(cy)} Z" fill="${relleno}" stroke="${L}" ${W}/>`;
  }
  // Círculo de borde en volantes redondeados (claveles, caléndulas, gladiolos).
  function ondulado(r, ondas, prof, relleno = F, cx = 0, cy = 0) {
    const ri = r - prof;
    const paso = 360 / ondas;
    let [x0, y0] = p(ri, 0);
    let d = `M${f(cx + x0)} ${f(cy + y0)}`;
    for (let i = 0; i < ondas; i++) {
      const a1 = (i + 1) * paso, am = i * paso + paso / 2;
      const [qx, qy] = p(r + prof * 0.6, am), [x1, y1] = p(ri, a1);
      d += ` Q ${f(cx + qx)} ${f(cy + qy)}, ${f(cx + x1)} ${f(cy + y1)}`;
    }
    return `<path d="${d} Z" fill="${relleno}" stroke="${L}" ${W}/>`;
  }
  const circulo = (r, relleno, cx = 0, cy = 0, linea = L) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${relleno}" stroke="${linea}" ${W}/>`;
  const tallito = (d) => `<path d="${d}" fill="none" stroke="${V}" ${W}/>`;
  const hojita = (d) => `<path d="${d}" fill="${VF}" stroke="${V}" ${W}/>`;

  const FLORES = [
    // 0 · Enero · Clavel: flor redonda de bordes rizados, en capas.
    () => ondulado(34, 18, 6, F2) + ondulado(26, 15, 5) + ondulado(15, 11, 4, F2),
    // 1 · Febrero · Violeta: cinco pétalos, dos arriba, dos al costado, uno grande abajo.
    () =>
      petalo(30, 15, -115, F2) + petalo(30, 15, -65, F2) + petalo(28, 13, 185) + petalo(28, 13, -5) + petalo(34, 17, 90) +
      `<path d="M-4 6 L0 16 L4 6" fill="none" stroke="${L}" ${W}/>` + circulo(4.5, C),
    // 2 · Marzo · Narciso: estrella de seis pétalos y trompeta al centro.
    () => {
      let s = "";
      for (let i = 0; i < 6; i++) s += petalo(36, 13, i * 60 - 90, i % 2 ? F2 : F);
      return s + ondulado(15, 12, 3, C) + circulo(7, "#f2d9a8");
    },
    // 3 · Abril · Margarita: muchos pétalos finos y botón dorado grande.
    () => {
      let s = "";
      for (let i = 0; i < 16; i++) s += petalo(36, 6, i * 22.5, "#ffffff");
      return s + circulo(10, C);
    },
    // 4 · Mayo · Lirio de los valles: tallo arqueado con campanitas colgando.
    () => {
      let s = tallito("M0 40 C -6 0, 4 -40, 34 -34") + tallito("M-1 28 C -12 12, -22 0, -26 -8");
      const campanas = [[-26, -8], [-2, -18], [10, -34], [24, -36]];
      campanas.forEach(([x, y], i) => {
        const r = 10 - i * 1.4;
        s += tallito(`M${x} ${y} L${x} ${y + 6}`);
        s += `<path d="M${f(x - r)} ${f(y + 6 + r * 1.3)} C ${f(x - r)} ${f(y + 6)}, ${f(x + r)} ${f(y + 6)}, ${f(x + r)} ${f(y + 6 + r * 1.3)} L${f(x + r * 0.6)} ${f(y + 6 + r * 1.05)} L${f(x + r * 0.2)} ${f(y + 6 + r * 1.35)} L${f(x - r * 0.2)} ${f(y + 6 + r * 1.05)} L${f(x - r * 0.6)} ${f(y + 6 + r * 1.35)} Z" fill="#ffffff" stroke="${L}" ${W}/>`;
      });
      return s + hojita("M2 40 C 22 16, 30 -4, 26 -16 C 10 0, 2 20, 2 40 Z");
    },
    // 5 · Junio · Rosa: cinco pétalos de afuera y un capullo en espiral al centro.
    () => {
      let s = "";
      for (let i = 0; i < 5; i++) s += petalo(34, 24, i * 72 - 90, F2);
      s += circulo(19, F);
      s += `<path d="M-14 4 C -16 -12, 2 -18, 12 -10 C 18 -4, 14 10, 2 12 C -6 13, -10 6, -6 0 C -3 -5, 4 -5, 5 0" fill="none" stroke="${L}" ${W}/>`;
      return s + `<path d="M-19 2 C -14 14, 6 20, 18 8" fill="none" stroke="${L}" ${W}/>`;
    },
    // 6 · Julio · Espuela de caballero: espiga alta de florcitas de cinco pétalos.
    () => {
      let s = tallito("M0 40 L0 -48");
      const filas = [[0, 26, 10], [-9, 10, 9], [9, 8, 9], [0, -6, 8.5], [-8, -20, 7.5], [7, -22, 7.5], [0, -34, 6.5], [0, -46, 4.5]];
      for (const [x, y, r] of filas) {
        for (let i = 0; i < 5; i++) s += petalo(r, r * 0.55, i * 72 - 90, F, x, y);
        s += circulo(r * 0.28, "#ffffff", x, y);
      }
      return s;
    },
    // 7 · Agosto · Gladiolo: espiga de flores en embudo, alternadas a cada lado.
    () => {
      let s = tallito("M0 40 C 2 0, -2 -30, 2 -50");
      const flores = [[-6, 24, 1, 15], [6, 8, 1, 14], [-6, -8, 1, 12.5], [6, -22, 1, 11], [-3, -36, 1, 8.5]];
      flores.forEach(([x, y, , r], i) => {
        const lado = i % 2 ? 1 : -1;
        s += ondulado(r, 8, r * 0.18, i % 2 ? F2 : F, x + lado * 4, y);
        s += circulo(r * 0.3, "#ffffff", x + lado * 4, y);
      });
      return s + `<path d="M2 -50 C 4 -56, 8 -58, 10 -60" fill="none" stroke="${V}" ${W}/>`;
    },
    // 8 · Septiembre · Áster: corona densa de rayos finos y botón dorado chico.
    () => {
      let s = "";
      for (let i = 0; i < 26; i++) s += petalo(34, 3.6, i * (360 / 26), i % 2 ? F2 : F);
      return s + ondulado(9, 10, 2, C);
    },
    // 9 · Octubre · Caléndula: pompón de volantes en tres capas.
    () => ondulado(34, 22, 5, "#f6dcc0") + ondulado(26, 18, 5, "#f2cfa7") + ondulado(17, 14, 4, "#f6dcc0") + ondulado(8, 9, 2.5, C),
    // 10 · Noviembre · Crisantemo: dos coronas de pétalos largos, muy llena.
    () => {
      let s = "";
      for (let i = 0; i < 24; i++) s += petalo(36, 5, i * 15 + 7.5, F2);
      for (let i = 0; i < 18; i++) s += petalo(25, 5, i * 20, F);
      for (let i = 0; i < 10; i++) s += petalo(13, 4, i * 36, F2);
      return s;
    },
    // 11 · Diciembre · Narciso blanco (paperwhite): racimo de estrellitas de seis pétalos.
    () => {
      let s = tallito("M0 40 L0 6");
      const flores = [[-16, -6, 13], [14, -10, 13], [0, -26, 12], [-4, 10, 10], [18, 12, 9]];
      for (const [x, y, r] of flores) {
        for (let i = 0; i < 6; i++) s += petalo(r, r * 0.42, i * 60 - 90, "#ffffff", x, y);
        s += circulo(r * 0.28, C, x, y);
      }
      return s;
    },
  ];

  // Pétalo con muesca en la punta (prímula, cosmos), apuntando al ángulo a.
  function muesca(r, w, a, relleno = F, cx = 0, cy = 0) {
    return `<path transform="translate(${f(cx)} ${f(cy)}) rotate(${f(a + 90)})" d="M0 0 C ${f(-w)} ${f(-r * 0.4)}, ${f(-w * 1.1)} ${f(-r * 0.9)}, ${f(-w * 0.5)} ${f(-r)} Q 0 ${f(-r * 0.8)}, ${f(w * 0.5)} ${f(-r)} C ${f(w * 1.1)} ${f(-r * 0.9)}, ${f(w)} ${f(-r * 0.4)}, 0 0 Z" fill="${relleno}" stroke="${L}" ${W}/>`;
  }
  const puntos = (n, r, rp, cx = 0, cy = 0) => {
    let s = "";
    for (let i = 0; i < n; i++) {
      const [x, y] = p(r, (360 / n) * i - 90);
      s += `<circle cx="${f(cx + x)}" cy="${f(cy + y)}" r="${rp}" fill="${L}" stroke="none"/>`;
    }
    return s;
  };

  // Segundas flores de cada mes, con el mismo trazo.
  const SEGUNDAS = [
    // 0 · Enero · Campanilla de invierno: tallo arqueado y una campana blanca colgando.
    () =>
      hojita("M-2 40 C -16 16, -18 -6, -12 -20 C -4 -2, -2 18, -2 40 Z") +
      tallito("M0 40 C 0 4, 2 -26, 16 -32") + tallito("M16 -32 C 20 -30, 20 -26, 18 -22") +
      petalo(30, 9, 112, "#ffffff", 18, -22) + petalo(30, 9, 68, "#ffffff", 18, -22) + petalo(32, 10, 90, "#ffffff", 18, -22) +
      `<circle cx="18" cy="-21" r="3.5" fill="${VF}" stroke="${V}" ${W}/>`,
    // 1 · Febrero · Prímula: cinco pétalos con muesca y ojo dorado.
    () => {
      let s = "";
      for (let i = 0; i < 5; i++) s += muesca(32, 15, i * 72 - 90, i % 2 ? F : F2);
      return s + `<path d="M0 -10 L3 -3 L10 -3 L4 2 L6 9 L0 5 L-6 9 L-4 2 L-10 -3 L-3 -3 Z" fill="${C}" stroke="${L}" ${W}/>` + circulo(3, "#ffffff");
    },
    // 2 · Marzo · Junquillo: tres narcisos chicos en un mismo tallo.
    () => {
      let s = tallito("M0 40 C 0 20, -4 4, -16 -8") + tallito("M0 22 C 4 6, 10 -8, 16 -14") + tallito("M0 30 L0 -26");
      for (const [x, y, r] of [[-17, -10, 15], [17, -16, 14], [0, -30, 13]]) {
        for (let i = 0; i < 6; i++) s += petalo(r, r * 0.38, i * 60 - 90, i % 2 ? F2 : F, x, y);
        s += ondulado(r * 0.38, 9, 1.4, C, x, y);
      }
      return s;
    },
    // 3 · Abril · Arvejilla: estandarte rizado, dos alas, quilla y zarcillo.
    () =>
      tallito("M0 40 L0 18") + tallito("M0 30 C 14 30, 22 22, 18 14 C 15 9, 9 12, 12 17") +
      ondulado(24, 14, 2.5, F2, 0, -12) +
      petalo(24, 13, 200, F, 0, 10) + petalo(24, 13, -20, F, 0, 10) +
      `<path d="M-8 10 C -6 22, 6 22, 8 10 C 3 14, -3 14, -8 10 Z" fill="#ffffff" stroke="${L}" ${W}/>`,
    // 4 · Mayo · Espino: racimo de florcitas blancas de cinco pétalos.
    () => {
      let s = hojita("M0 40 C -20 30, -30 18, -32 6 C -16 10, -6 22, 0 40 Z") + tallito("M0 40 L0 16");
      for (const [x, y, r] of [[-18, -6, 12], [16, -10, 12], [0, -26, 12], [-2, 6, 11], [20, 12, 9]]) {
        for (let i = 0; i < 5; i++) s += petalo(r, r * 0.62, i * 72 - 90, "#ffffff", x, y);
        s += circulo(r * 0.22, F2, x, y) + puntos(5, r * 0.42, 1.1, x, y);
      }
      return s;
    },
    // 5 · Junio · Madreselva: tubos finos en abanico con estambres largos.
    () => {
      let s = hojita("M0 34 C -18 34, -32 28, -38 18 C -22 16, -8 22, 0 34 Z") + hojita("M0 34 C 18 34, 32 28, 38 18 C 22 16, 8 22, 0 34 Z");
      for (let i = 0; i < 6; i++) {
        const a = -160 + i * 28;
        s += petalo(34, 4.5, a, i % 2 ? F : F2, 0, 18);
        const [lx, ly] = p(34, a), [ex, ey] = p(44, a + 8);
        s += `<path d="M${f(lx)} ${f(18 + ly)} L${f(ex)} ${f(18 + ey)}" stroke="${L}" ${W}/>` + `<circle cx="${f(ex)}" cy="${f(18 + ey)}" r="2" fill="${C}" stroke="none"/>`;
      }
      return s;
    },
    // 6 · Julio · Nenúfar: pétalos en punta sobre una hoja redonda flotando.
    () => {
      let s = `<path d="M0 22 L-6 30 C -30 34, -46 28, -46 20 C -46 10, -24 6, 0 8 C 24 6, 46 10, 46 20 C 46 28, 30 34, 6 30 Z" fill="${VF}" stroke="${V}" ${W}/>`;
      for (const a of [-170, -10, -150, -30]) s += petalo(30, 9, a, F2, 0, 16);
      for (const a of [-130, -50, -110, -70, -90]) s += petalo(34, 10, a, a === -90 ? "#ffffff" : F, 0, 16);
      return s + `<ellipse cx="0" cy="14" rx="9" ry="4" fill="${C}" stroke="${L}" ${W}/>`;
    },
    // 7 · Agosto · Amapola: cuatro pétalos grandes y centro oscuro con estambres.
    () => {
      let s = petalo(36, 28, -135, F2) + petalo(36, 28, -45, F2) + petalo(34, 26, 135, F) + petalo(34, 26, 45, F);
      s += `<circle r="9" fill="#5e5a52" stroke="${L}" ${W}/>`;
      for (let i = 0; i < 12; i++) {
        const [x, y] = p(15, i * 30);
        s += `<path d="M0 0 L${f(x)} ${f(y)}" stroke="#5e5a52" stroke-width="1.6"/><circle cx="${f(x)}" cy="${f(y)}" r="1.8" fill="#5e5a52" stroke="none"/>`;
      }
      return s + `<path d="M-5 0 L5 0 M0 -5 L0 5" stroke="#ffffff" stroke-width="1.6" stroke-linecap="round"/>`;
    },
    // 8 · Septiembre · Gloria de la mañana: embudo redondo con estrella al centro.
    () => {
      let s = ondulado(34, 5, 2.5, F2);
      for (let i = 0; i < 5; i++) {
        const [x, y] = p(31, i * 72 - 90), [m1x, m1y] = p(14, i * 72 - 102), [m2x, m2y] = p(14, i * 72 - 78);
        s += `<path d="M0 0 C ${f(m1x)} ${f(m1y)}, ${f(m1x)} ${f(m1y)}, ${f(x)} ${f(y)} C ${f(m2x)} ${f(m2y)}, ${f(m2x)} ${f(m2y)}, 0 0 Z" fill="${F}" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/>`;
      }
      return s + circulo(9, "#ffffff") + circulo(3.5, C);
    },
    // 9 · Octubre · Cosmos: ocho pétalos anchos con muesca y botón dorado.
    () => {
      let s = "";
      for (let i = 0; i < 8; i++) s += muesca(35, 12, i * 45 - 90, i % 2 ? F2 : F);
      return s + circulo(9, C) + puntos(8, 5, 1.2);
    },
    // 10 · Noviembre · solo tiene una: se repite el crisantemo.
    () => FLORES[10](),
    // 11 · Diciembre · Acebo: dos hojas con espinas y tres bayas.
    () => {
      const acebo = (a) =>
        `<g transform="rotate(${a})"><path d="M0 0 L-6 -6 L-13 -5 L-11 -14 L-17 -20 L-10 -24 L-11 -33 L-3 -32 L0 -42 L3 -32 L11 -33 L10 -24 L17 -20 L11 -14 L13 -5 L6 -6 Z" fill="${VF}" stroke="${V}" ${W}/><path d="M0 -2 L0 -36" stroke="${V}" stroke-width="1.6"/></g>`;
      return `<g transform="translate(0 14)">${acebo(-52)}${acebo(52)}${acebo(180)}</g>` +
        circulo(8, "#d98c8a", -8, 8) + circulo(8, "#d98c8a", 8, 8) + circulo(8, "#d98c8a", 0, -4) +
        `<path d="M-10 6 l2 -2 M6 6 l2 -2 M-2 -6 l2 -2" stroke="#ffffff" stroke-width="1.8" stroke-linecap="round"/>`;
    },
  ];

  window.aquumFlor = (mes) => FLORES[((mes % 12) + 12) % 12]();
  /** La segunda flor del mes (campanilla de invierno, prímula, junquillo…). */
  window.aquumFlorSegunda = (mes) => SEGUNDAS[((mes % 12) + 12) % 12]();
  window.aquumColocarSegunda = (grupo, mes, yCentro, escala) => {
    grupo.setAttribute("transform", `translate(0 ${yCentro}) scale(${escala})`);
    grupo.removeAttribute("stroke");
    grupo.removeAttribute("stroke-width");
    grupo.innerHTML = window.aquumFlorSegunda(mes);
  };
  /**
   * Pone la flor del mes en un <g> de una plantilla: el centro de la flor en
   * (0, yCentro), al tamaño «escala». La flor tapa la punta del tallo de la
   * plantilla; las flores en espiga traen su propio tallito hacia abajo.
   */
  window.aquumColocarFlor = (grupo, mes, yCentro, escala) => {
    grupo.setAttribute("transform", `translate(0 ${yCentro}) scale(${escala})`);
    grupo.removeAttribute("stroke");
    grupo.removeAttribute("stroke-width");
    grupo.innerHTML = window.aquumFlor(mes);
  };
  /** La misma flor en línea negra y relleno blanco, para colorear. */
  /**
   * Ramo con las flores de varios meses (una por persona), en una caja de
   * -150 a 150 de ancho y -175 a 175 de alto, en cúpula: tallos que se juntan abajo,
   * un papel de envolver y un lazo. Hasta 8 flores; los meses pueden repetirse.
   * Los meses van de 0 a 11; de 12 a 23 piden la segunda flor de ese mes.
   */
  const RAMOS = [
    [],
    [[0, -48]],
    [[-42, -40], [42, -40]],
    [[-62, -18], [0, -73], [62, -18]],
    [[-75, -13], [-28, -78], [28, -78], [75, -13]],
    [[-85, -8], [-42, -83], [42, -83], [85, -8], [0, -23]],
    [[-92, -3], [-56, -78], [0, -103], [56, -78], [92, -3], [0, -18]],
    [[-96, 2], [-66, -73], [-14, -106], [42, -93], [92, -33], [-32, -13], [36, -8]],
    [[-100, 7], [-76, -66], [-26, -106], [30, -102], [80, -62], [102, 7], [-32, -16], [36, -14]],
  ];
  window.aquumRamo = (meses) => {
    const n = Math.min(meses.length, 8);
    if (!n) return "";
    const pos = RAMOS[n];
    const escala = n <= 3 ? 1.05 : n <= 5 ? 0.92 : 0.8;
    let s = "";
    for (const [x, y] of pos) s += `<path d="M0 150 Q ${f(x * 0.3)} ${f(y * 0.3 + 60)}, ${f(x)} ${f(y)}" fill="none" stroke="${V}" ${W}/>`;
    s += hojita("M-10 52 C -44 36, -66 14, -100 18 C -82 42, -48 58, -10 52 Z") + hojita("M10 52 C 44 36, 66 14, 100 18 C 82 42, 48 58, 10 52 Z");
    // De atrás (arriba) hacia adelante (abajo), para que las de adelante tapen.
    const orden = pos.map((_, i) => i).sort((a, b) => pos[a][1] - pos[b][1]);
    // Un mes de 12 a 23 es la segunda flor del mes (mes - 12).
    const dibujo = (m) => (m >= 12 ? window.aquumFlorSegunda(m - 12) : window.aquumFlor(m));
    for (const i of orden) s += `<g transform="translate(${pos[i][0]} ${pos[i][1]}) scale(${escala})">${dibujo(meses[i])}</g>`;
    // Puntas de los tallos asomando bajo el papel.
    s += `<path d="M-4 150 L-9 172 M0 150 L0 174 M4 150 L9 172" stroke="${V}" ${W}/>`;
    // Papel de envolver en cono, con borde en zigzag, y lazo.
    s += `<path d="M-66 40 L66 40 L10 156 L-10 156 Z" fill="#fbf3ea" stroke="${L}" ${W}/>`;
    s += `<path d="M-66 40 L-44 54 L-22 40 L0 54 L22 40 L44 54 L66 40" fill="none" stroke="${L}" stroke-width="1.6" stroke-linejoin="round"/>`;
    s += `<path d="M0 104 C -20 86, -40 92, -35 106 C -30 118, -12 114, 0 104 Z M0 104 C 20 86, 40 92, 35 106 C 30 118, 12 114, 0 104 Z" fill="${F2}" stroke="${L}" ${W}/>`;
    s += `<path d="M-3 106 L-15 136 M3 106 L15 136" stroke="${L}" ${W}/>` + circulo(5.5, F, 0, 104);
    return s;
  };
  /**
   * Pasa un dibujo a línea de un solo color sobre blanco, para colorear o para
   * clipart: los rellenos quedan blancos, salvo los puntitos sin borde
   * (estambres), que toman el color de la línea para no desaparecer.
   */
  window.aquumEnLinea = (svg, tinta = "#2f2e2b") =>
    svg
      .replace(/fill="#[0-9a-fA-F]{6}" stroke="none"/g, 'fill="TINTA" stroke="none"')
      .replace(/fill="#[0-9a-fA-F]{6}"/g, 'fill="#ffffff"')
      .replace(/stroke="#[0-9a-fA-F]{6}"/g, 'stroke="TINTA"')
      .replace(/TINTA/g, tinta);
  window.aquumFlorColorear = (mes) => window.aquumEnLinea(window.aquumFlor(mes));
  window.aquumSegundaColorear = (mes) => window.aquumEnLinea(window.aquumFlorSegunda(mes));
  window.AQUUM_FLOR_COLORES = { L, F, F2, C, V, VF };
})();
(function () {
  // Flores de Navidad (no son flores de nacimiento): para la guía de flores
  // navideñas y sus láminas. Mismo trazo que las demás.
  //   aquumFlorNavidad("nochebuena" | "rosa" | "amarilis" | "muerdago")
  const L = "#c98f8f", F = "#f7e6e3", C = "#e8c08b", V = "#8a9a7b", VF = "#dfe5d6";
  const R = "#e7a3a0", R2 = "#f2c6c3", RL = "#c0605c";
  const W = 'stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"';
  const rad = (g) => (g * Math.PI) / 180;
  const p = (r, a) => [r * Math.cos(rad(a)), r * Math.sin(rad(a))];
  const f = (n) => n.toFixed(1);
  // Hoja o bráctea en punta: base redonda en el centro, punta afilada en el ángulo a.
  function punta(r, w, a, relleno, linea, cx = 0, cy = 0) {
    const [px, py] = p(r, a), [l1x, l1y] = p(w, a - 90), [l2x, l2y] = p(w, a + 90), [mx, my] = p(r * 0.45, a);
    return `<path d="M${f(cx)} ${f(cy)} C ${f(cx + mx + l1x)} ${f(cy + my + l1y)}, ${f(cx + px * 0.8 + l1x * 0.4)} ${f(cy + py * 0.8 + l1y * 0.4)}, ${f(cx + px)} ${f(cy + py)} C ${f(cx + px * 0.8 + l2x * 0.4)} ${f(cy + py * 0.8 + l2y * 0.4)}, ${f(cx + mx + l2x)} ${f(cy + my + l2y)}, ${f(cx)} ${f(cy)} Z" fill="${relleno}" stroke="${linea}" ${W}/>`;
  }
  // Pétalo ancho y redondeado (rosa de Navidad).
  function redondo(r, w, a, relleno, linea) {
    const [px, py] = p(r, a), [l1x, l1y] = p(w, a - 90), [l2x, l2y] = p(w, a + 90);
    return `<path d="M0 0 C ${f(l1x * 0.9)} ${f(l1y * 0.9)}, ${f(px + l1x)} ${f(py + l1y)}, ${f(px)} ${f(py)} C ${f(px + l2x)} ${f(py + l2y)}, ${f(l2x * 0.9)} ${f(l2y * 0.9)}, 0 0 Z" fill="${relleno}" stroke="${linea}" ${W}/>`;
  }
  const circulo = (r, relleno, cx = 0, cy = 0, linea = L) => `<circle cx="${f(cx)}" cy="${f(cy)}" r="${r}" fill="${relleno}" stroke="${linea}" ${W}/>`;
  const puntitos = (n, r, tam, color) => {
    let s = "";
    for (let i = 0; i < n; i++) { const [x, y] = p(r, (360 / n) * i); s += `<circle cx="${f(x)}" cy="${f(y)}" r="${tam}" fill="${color}" stroke="none"/>`; }
    return s;
  };
  const DIBUJOS = {
    // Nochebuena: seis brácteas grandes y seis chicas entre ellas, centro de botoncitos.
    nochebuena: () => {
      let s = "";
      for (let i = 0; i < 6; i++) s += punta(52, 13, i * 60 - 90, R, RL);
      for (let i = 0; i < 6; i++) s += punta(34, 10, i * 60 - 60, R2, RL);
      return s + circulo(4, "#c9d48b", -5, -3, V) + circulo(4, "#c9d48b", 5, -2, V) + circulo(4, "#e8c08b", 0, 5, V);
    },
    // Rosa de Navidad (eléboro): cinco pétalos anchos y blancos, corona de estambres.
    rosa: () => {
      let s = "";
      for (let i = 0; i < 5; i++) s += redondo(40, 24, i * 72 - 90, "#fbf7f2", L);
      return s + circulo(11, "#dfe5d6", 0, 0, V) + puntitos(14, 15, 2.2, C) + puntitos(8, 7, 1.6, C);
    },
    // Amarilis, de frente: seis pétalos en punta con una raya clara al medio.
    amarilis: () => {
      let s = "";
      for (let i = 0; i < 6; i++) {
        const a = i * 60 - 90;
        s += punta(50, 18, a, i % 2 ? R : R2, RL);
        const [x, y] = p(30, a);
        s += `<path d="M0 0 L${f(x)} ${f(y)}" stroke="white" stroke-width="3" stroke-linecap="round"/>`;
      }
      s += circulo(7, "#dfe5d6", 0, 0, V);
      for (let i = 0; i < 6; i++) { const [x, y] = p(18, i * 60 - 60); s += `<path d="M0 0 L${f(x)} ${f(y)}" stroke="${L}" stroke-width="1.4"/>` + `<circle cx="${f(x)}" cy="${f(y)}" r="2.2" fill="${C}" stroke="none"/>`; }
      return s;
    },
    // Muérdago: ramita en horquilla, pares de hojas largas y bayas blancas.
    muerdago: () => {
      const hoja = (x, y, a) => punta(30, 8, a, VF, V, x, y);
      return `<path d="M0 46 L0 10 M0 10 L-16 -14 M0 10 L16 -14" fill="none" stroke="${V}" ${W}/>` +
        hoja(-16, -14, -130) + hoja(-16, -14, -70) + hoja(16, -14, -110) + hoja(16, -14, -50) + hoja(0, 26, 200) + hoja(0, 26, -20) +
        circulo(6, "#ffffff", -6, 6, V) + circulo(6, "#ffffff", 6, 6, V) + circulo(6, "#ffffff", 0, -3, V);
    },
  };
  window.aquumFlorNavidad = (nombre) => DIBUJOS[nombre]();
  window.aquumNavidadColorear = (nombre) => window.aquumEnLinea(DIBUJOS[nombre]());
})();
