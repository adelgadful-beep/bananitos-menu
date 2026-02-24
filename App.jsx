import { useState, useEffect } from "react";

// ─────────────────────────────────────────────────────────────────────────────
// CONFIGURATION
// To update these values, edit them here and redeploy to Vercel.
// ─────────────────────────────────────────────────────────────────────────────
const APPS_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzG3TIBMOTwwmw79lk0PRZMplpxPfGETXv6s6Wr66rkcfWAOtQZJ5jW_newRqsSW7L1/exec";

// Costa Rica country code (506) + the restaurant's number
const WHATSAPP_NUMBER = "50688744388";

// ─────────────────────────────────────────────────────────────────────────────
// FALLBACK MENU
// This data is shown if Google Sheets is temporarily unreachable.
// It also serves as the "skeleton" that the live data replaces on load.
// ─────────────────────────────────────────────────────────────────────────────
const FALLBACK_MENU = [
  // ── Entradas ──────────────────────────────────────────────────────────────
  { categoria:"Entradas", nombre:"Ceviche",
    descripcion:"Ceviche fresco de pescado con nachos crujientes",
    precio:2200, icon:"salad", foto:"" },
  { categoria:"Entradas", nombre:"Patacones con Frijoles",
    descripcion:"Patacones crujientes con frijoles negros",
    precio:2800, icon:"plate", foto:"" },
  // ── Bocas ──────────────────────────────────────────────────────────────────
  { categoria:"Bocas", nombre:"Filete de Pescado",
    descripcion:"Porción de filete de pescado frito",
    precio:2800, icon:"fish", foto:"" },
  { categoria:"Bocas", nombre:"Sopa Negra",
    descripcion:"Sopa negra tradicional costarricense",
    precio:2500, icon:"plate", foto:"" },
  { categoria:"Bocas", nombre:"Arroz Cantones",
    descripcion:"Arroz cantones porción boca",
    precio:2300, icon:"rice", foto:"" },
  { categoria:"Bocas", nombre:"Arroz con Camarones",
    descripcion:"Arroz con camarones porción boca",
    precio:2500, icon:"shrimp", foto:"" },
  { categoria:"Bocas", nombre:"Gallo de Salchichón",
    descripcion:"Gallo de salchichón en tortilla",
    precio:1800, icon:"plate", foto:"" },
  { categoria:"Bocas", nombre:"Gallo de Chorizo",
    descripcion:"Gallo de chorizo en tortilla",
    precio:2000, icon:"plate", foto:"" },
  { categoria:"Bocas", nombre:"Patacones con Carne Desmechada",
    descripcion:"Patacones con carne desmechada",
    precio:3000, icon:"plate", foto:"" },
  { categoria:"Bocas", nombre:"Hamburguesa Especial",
    descripcion:"Hamburguesa con todos los ingredientes",
    precio:2500, icon:"burger", foto:"" },
  { categoria:"Bocas", nombre:"Hamburguesa Sencilla",
    descripcion:"Hamburguesa sencilla",
    precio:1500, icon:"burger", foto:"" },
  { categoria:"Bocas", nombre:"Papas Fritas Grandes",
    descripcion:"Porción grande de papas fritas",
    precio:2000, icon:"fries", foto:"" },
  { categoria:"Bocas", nombre:"Salchipapas",
    descripcion:"Papas con salchicha",
    precio:2500, icon:"fries", foto:"" },
  { categoria:"Bocas", nombre:"Alitas Fritas con Papas",
    descripcion:"Alitas de pollo fritas con papas",
    precio:2500, icon:"meat", foto:"" },
  { categoria:"Bocas", nombre:"Nachos",
    descripcion:"Nachos con salsas",
    precio:3500, icon:"fries", foto:"" },
  { categoria:"Bocas", nombre:"Papicarne",
    descripcion:"Papas con carne sazonada",
    precio:3500, icon:"fries", foto:"" },
  // ── Tilapia ────────────────────────────────────────────────────────────────
  { categoria:"Tilapia", nombre:"Tilapia Mediana",
    descripcion:"Tilapia frita entera con patacones y ensalada",
    precio:5000, icon:"fish",
    // Real photo from Google Drive — uploaded by the owner
    foto:"https://drive.google.com/uc?export=view&id=1zWtY0FmS23bAlLczJng5JuLiFFZ8JF2c" },
  { categoria:"Tilapia", nombre:"Tilapia Grande",
    descripcion:"Tilapia frita grande con patacones y ensalada",
    precio:6000, icon:"fish",
    foto:"https://drive.google.com/uc?export=view&id=1zWtY0FmS23bAlLczJng5JuLiFFZ8JF2c" },
  // ── Platos Fuertes ─────────────────────────────────────────────────────────
  { categoria:"Platos Fuertes", nombre:"Costilla Ahumada",
    descripcion:"Costilla ahumada con acompañamientos",
    precio:4800, icon:"meat", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Fajitas de Pollo",
    descripcion:"Fajitas de pollo con tortillas y acompañamientos",
    precio:4500, icon:"meat", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Fajitas de Res",
    descripcion:"Fajitas de res con acompañamientos",
    precio:4500, icon:"meat", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Fajitas de Cerdo",
    descripcion:"Fajitas de cerdo con acompañamientos",
    precio:4000, icon:"meat", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Trocitos de Tilapia",
    descripcion:"Trocitos de tilapia fritos",
    precio:4500, icon:"fish", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Camarones Empanizados o al Ajillo",
    descripcion:"Camarones fritos empanizados o al ajillo",
    precio:4800, icon:"shrimp", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Filete de Pescado",
    descripcion:"Filete de pescado frito con acompañamientos",
    precio:4800, icon:"fish", foto:"" },
  { categoria:"Platos Fuertes", nombre:"Chuleta de Cerdo con Patacones",
    descripcion:"Chuleta de cerdo frita con patacones",
    precio:4000, icon:"meat", foto:"" },
  // ── Surtidos ───────────────────────────────────────────────────────────────
  { categoria:"Surtidos", nombre:"Surtido de 2 Carnes",
    descripcion:"2 tipos de carne + patacones y acompañamientos",
    precio:8000, icon:"box", foto:"" },
  { categoria:"Surtidos", nombre:"Surtido de 3 Carnes",
    descripcion:"3 tipos de carne + patacones y acompañamientos",
    precio:12000, icon:"box", foto:"" },
  { categoria:"Surtidos", nombre:"Surtido de 4 Carnes",
    descripcion:"4 tipos de carne + patacones y acompañamientos",
    precio:16000, icon:"box", foto:"" },
  // ── Casados ────────────────────────────────────────────────────────────────
  { categoria:"Casados", nombre:"Casado con Filete de Pescado",
    descripcion:"Casado completo con filete de pescado",
    precio:3500, icon:"plate", foto:"" },
  { categoria:"Casados", nombre:"Casado con Chuleta de Cerdo",
    descripcion:"Casado completo con chuleta de cerdo",
    precio:3500, icon:"plate", foto:"" },
  { categoria:"Casados", nombre:"Casado con Carne en Salsa",
    descripcion:"Casado completo con carne en salsa",
    precio:3800, icon:"plate", foto:"" },
  { categoria:"Casados", nombre:"Casado con Chuleta Ahumada",
    descripcion:"Casado completo con chuleta ahumada",
    precio:3800, icon:"plate", foto:"" },
  { categoria:"Casados", nombre:"Casado con Fajitas de Pollo",
    descripcion:"Casado completo con fajitas de pollo",
    precio:3500, icon:"plate", foto:"" },
  // ── Arroces ────────────────────────────────────────────────────────────────
  { categoria:"Arroces", nombre:"Arroz con Camarones (Entero)",
    descripcion:"Arroz con camarones frescos — porción entera",
    precio:4800, icon:"shrimp", foto:"" },
  { categoria:"Arroces", nombre:"Arroz con Camarones (Medio)",
    descripcion:"Arroz con camarones — porción media",
    precio:3800, icon:"shrimp", foto:"" },
  { categoria:"Arroces", nombre:"Arroz Cantones (Entero)",
    descripcion:"Arroz cantones estilo chino — porción entera",
    precio:3800, icon:"rice", foto:"" },
  { categoria:"Arroces", nombre:"Arroz Cantones (Medio)",
    descripcion:"Arroz cantones — porción media",
    precio:3000, icon:"rice", foto:"" },
  { categoria:"Arroces", nombre:"Arroz con Chorizo Chino (Entero)",
    descripcion:"Arroz con chorizo chino — porción entera",
    precio:3800, icon:"rice", foto:"" },
  { categoria:"Arroces", nombre:"Arroz con Chorizo Chino (Medio)",
    descripcion:"Arroz con chorizo chino — porción media",
    precio:3000, icon:"rice", foto:"" },
  // ── Bebidas ────────────────────────────────────────────────────────────────
  { categoria:"Bebidas", nombre:"Refresco Natural",
    descripcion:"Frescos naturales de frutas tropicales",
    precio:700, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Refresco en Lata",
    descripcion:"Coca-Cola, Pepsi, Sprite u otras",
    precio:800, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Agua Purificada",
    descripcion:"Botella de agua purificada",
    precio:500, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Cerveza Nacional",
    descripcion:"Imperial, Bavaria u otras nacionales",
    precio:1200, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Cerveza Importada",
    descripcion:"Corona, Heineken u otras importadas",
    precio:1500, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Café Negro",
    descripcion:"Café negro recién hecho",
    precio:700, icon:"drink", foto:"" },
  { categoria:"Bebidas", nombre:"Café con Leche",
    descripcion:"Café con leche caliente",
    precio:900, icon:"drink", foto:"" },
  // ── Cócteles ───────────────────────────────────────────────────────────────
  { categoria:"Cócteles", nombre:"Cóctel de la Casa",
    descripcion:"Pregunta por el cóctel especial del día",
    precio:2500, icon:"cocktail", foto:"" },
  { categoria:"Cócteles", nombre:"Piña Colada",
    descripcion:"Cóctel tropical con piña y coco",
    precio:2800, icon:"cocktail", foto:"" },
  { categoria:"Cócteles", nombre:"Margarita",
    descripcion:"Margarita clásica con sal",
    precio:2800, icon:"cocktail", foto:"" },
  { categoria:"Cócteles", nombre:"Guaro Sour",
    descripcion:"Guaro con limón y soda",
    precio:2200, icon:"cocktail", foto:"" },
  { categoria:"Cócteles", nombre:"Mojito",
    descripcion:"Mojito con menta fresca y limón",
    precio:2800, icon:"cocktail", foto:"" },
  { categoria:"Cócteles", nombre:"Sangría",
    descripcion:"Sangría de vino tinto con frutas",
    precio:2500, icon:"cocktail", foto:"" },
];

// ─────────────────────────────────────────────────────────────────────────────
// ICON MAP
// Each category and item type gets a clean thin-line SVG icon.
// This replaces childish emojis with something that looks professional
// on any device (unlike emojis, which render differently on iOS vs Android).
// ─────────────────────────────────────────────────────────────────────────────
const CAT_ICON = {
  "Entradas":"salad","Bocas":"fries","Tilapia":"fish",
  "Platos Fuertes":"meat","Surtidos":"box","Casados":"plate",
  "Arroces":"rice","Bebidas":"drink","Cócteles":"cocktail",
};

const Icon = ({ type, color="#f5a800", size=32 }) => {
  const s = { width:size, height:size, display:"block" };
  const stroke = { fill:"none", stroke:color, strokeWidth:"1.4",
    strokeLinecap:"round", strokeLinejoin:"round" };
  const icons = {
    fish:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M6.5 12s-2-4 1-7 8-2 10 2-1 9-6 9-5-4-5-4z"/>
        <path d="M17.5 7.5l2-2M17.5 16.5l2 2"/>
        <circle cx="8" cy="11" r="1" fill={color} stroke="none"/>
      </svg>
    ),
    shrimp:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3c2 0 4 1.5 4 4s-2 4-4 4-4-1.5-4-4"/>
        <path d="M8 11c-2 1-3 3-2 5s3 3 5 3 4-2 4-4"/>
        <path d="M15 18l3 2M9 6l-2-2"/>
      </svg>
    ),
    meat:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M9 5c0-1 1-2 2-2s2 1 2 2c2 0 4 1.5 4 4s-2 3.5-4 3l-5 8H6l-1-1 4-6c-2 .5-4-1-4-3s2-4 4-5z"/>
      </svg>
    ),
    plate:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <ellipse cx="12" cy="13" rx="8" ry="5"/>
        <path d="M4 13c0 3 3.6 5 8 5s8-2 8-5"/>
        <path d="M12 3v4M9 5l3 2 3-2"/>
      </svg>
    ),
    rice:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M5 12c0-4 3-7 7-7s7 3 7 7"/>
        <path d="M3 12h18M5 12c0 4 3 7 7 7s7-3 7-7"/>
        <circle cx="9" cy="10" r=".8" fill={color} stroke="none"/>
        <circle cx="15" cy="10" r=".8" fill={color} stroke="none"/>
        <circle cx="12" cy="9" r=".8" fill={color} stroke="none"/>
      </svg>
    ),
    burger:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M6 10c0-3 2.5-5 6-5s6 2 6 5"/>
        <rect x="4" y="10" width="16" height="2.5" rx="1.2"/>
        <path d="M8 12.5c.5 1.5 2 2 4 2s3.5-.5 4-2"/>
        <rect x="4" y="15" width="16" height="2.5" rx="1.2"/>
      </svg>
    ),
    drink:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M7 3h10l-2 9a4 4 0 01-8 0L7 3z"/>
        <path d="M6 21h12M12 16v5M7 3l-1-1M17 3l1-1"/>
      </svg>
    ),
    cocktail:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M4 4h16l-8 9v6"/><path d="M9 19h6"/>
        <path d="M14 9l2-3"/>
        <circle cx="15.5" cy="6.5" r=".8" fill={color} stroke="none"/>
      </svg>
    ),
    salad:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M12 3c-3 0-5 2-5 5 0 1 .4 2 1 3H7c-2 0-3 1-3 3s1 3 3 3h10c2 0 3-1 3-3s-1-3-3-3h-1c.6-1 1-2 1-3 0-3-2-5-5-5z"/>
        <path d="M9 11c1-1 2-1.5 3-1.5s2 .5 3 1.5"/>
      </svg>
    ),
    fries:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M8 14V6M12 14V4M16 14V6"/>
        <path d="M5 14h14l-1.5 7h-11L5 14z"/>
      </svg>
    ),
    box:(
      <svg style={s} viewBox="0 0 24 24" {...stroke}>
        <path d="M3 9l9-6 9 6v10a2 2 0 01-2 2H5a2 2 0 01-2-2V9z"/>
        <path d="M9 22V12h6v10M3 9h18"/>
      </svg>
    ),
  };
  return icons[type] || icons.plate;
};

// ─────────────────────────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────────────────────────
const fmt = (n) => "₡" + Number(n).toLocaleString("es-CR");

// Maps an icon name from the Sheets data to our internal icon keys.
// This lets you use common emoji names in the spreadsheet and still
// get the right SVG icon in the app.
const resolveIcon = (categoria, iconHint) => {
  if (iconHint) {
    const map = { "🐟":"fish","🦐":"shrimp","🥩":"meat","🍽️":"plate",
      "🍚":"rice","🍔":"burger","🥤":"drink","🍹":"cocktail",
      "🥗":"salad","🍟":"fries","🍱":"box","🐠":"fish","🍗":"meat",
      "🫘":"plate","🌮":"fries","🍲":"plate","🍺":"drink","☕":"drink" };
    if (map[iconHint]) return map[iconHint];
  }
  return CAT_ICON[categoria] || "plate";
};

// ─────────────────────────────────────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────────────────────────────────────
export default function App() {
  // ── State ──────────────────────────────────────────────────────────────────
  const [dark, setDark]                     = useState(() => {
    // Remember the user's theme preference across sessions
    try { return localStorage.getItem("bananitos_dark") === "true"; }
    catch { return false; }
  });
  const [menu, setMenu]                     = useState(FALLBACK_MENU);
  const [loading, setLoading]               = useState(true);
  const [activeCategory, setActiveCategory] = useState("Tilapia");
  const [cart, setCart]                     = useState([]);
  const [cartOpen, setCartOpen]             = useState(false);
  const [checkoutOpen, setCheckoutOpen]     = useState(false);
  const [customerName, setCustomerName]     = useState("");
  const [customerPhone, setCustomerPhone]   = useState("");
  const [tableInfo, setTableInfo]           = useState("");
  const [sending, setSending]               = useState(false);
  const [sent, setSent]                     = useState(false);

  // ── Persist dark mode preference ───────────────────────────────────────────
  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    try { localStorage.setItem("bananitos_dark", String(next)); } catch {}
  };

  // ── Fetch live menu from Google Sheets via Apps Script ─────────────────────
  // The Apps Script reads the MENÚ sheet and returns only rows where
  // column I (Activo) = "Sí". This lets the owner toggle dishes on/off
  // from the spreadsheet without touching any code.
  useEffect(() => {
    fetch(`${APPS_SCRIPT_URL}?action=getMenu`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.menu?.length > 0) {
          // Transform Sheets data into the shape our UI expects
          const live = data.menu.map((item) => ({
            categoria:   item.categoria   || "",
            nombre:      item.nombre      || "",
            descripcion: item.descripcion || "",
            precio:      Number(item.precio) || 0,
            foto:        item.imagen      || "",
            icon:        resolveIcon(item.categoria, item.emoji),
          }));
          setMenu(live);
          // Keep active category if it still exists, otherwise go to first
          const cats = [...new Set(live.map((i) => i.categoria))];
          if (!cats.includes(activeCategory)) setActiveCategory(cats[0]);
        }
        // If fetch fails silently, the fallback menu stays visible
      })
      .catch(() => {}) // Fallback menu already set as initial state
      .finally(() => setLoading(false));
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Derived values ─────────────────────────────────────────────────────────
  const categories = [...new Set(menu.map((i) => i.categoria))];
  const filtered   = menu.filter((i) => i.categoria === activeCategory);
  const cartTotal  = cart.reduce((s, i) => s + i.precio * i.cantidad, 0);
  const cartCount  = cart.reduce((s, i) => s + i.cantidad, 0);
  const servicio   = Math.round(cartTotal * 0.1);
  const totalFinal = cartTotal + servicio;

  // ── Cart operations ─────────────────────────────────────────────────────────
  const addToCart = (item) => setCart((prev) => {
    const ex = prev.find((c) => c.nombre === item.nombre);
    return ex
      ? prev.map((c) => c.nombre === item.nombre
          ? { ...c, cantidad: c.cantidad + 1 } : c)
      : [...prev, { ...item, cantidad: 1 }];
  });

  const removeFromCart = (nombre) => setCart((prev) => {
    const ex = prev.find((c) => c.nombre === nombre);
    if (ex?.cantidad > 1)
      return prev.map((c) => c.nombre === nombre
        ? { ...c, cantidad: c.cantidad - 1 } : c);
    return prev.filter((c) => c.nombre !== nombre);
  });

  const getQty = (nombre) =>
    cart.find((c) => c.nombre === nombre)?.cantidad || 0;

  // ── Send order via WhatsApp + register in Google Sheets ────────────────────
  const sendOrder = async () => {
    if (!customerName.trim()) return;
    setSending(true);

    const lines = cart
      .map((i) => `${i.cantidad}x ${i.nombre} — ${fmt(i.precio * i.cantidad)}`)
      .join("\n");

    const msg = encodeURIComponent(
      `🍌 *Pedido — Bar y Restaurante Bananitos*\n\n` +
      `👤 *Nombre:* ${customerName}\n` +
      (customerPhone ? `📞 *Teléfono:* ${customerPhone}\n` : "") +
      (tableInfo     ? `🪑 *Mesa:* ${tableInfo}\n`          : "") +
      `\n📋 *Pedido:*\n${lines}\n\n` +
      `💰 Subtotal: ${fmt(cartTotal)}\n` +
      `➕ Servicio (10%): ${fmt(servicio)}\n` +
      `✅ *Total: ${fmt(totalFinal)}*\n\n` +
      `_*El precio no incluye el 10% del servicio a la mesa._`
    );

    // Register the order in the PEDIDOS sheet — runs in the background.
    // Even if this fails, the WhatsApp message still goes through.
    try {
      await fetch(APPS_SCRIPT_URL, {
        method: "POST",
        body: JSON.stringify({
          items:         cart,
          nombreCliente: customerName,
          telefono:      customerPhone,
          mesa:          tableInfo || "WhatsApp",
          subtotal:      cartTotal,
        }),
      });
    } catch {}

    // Open WhatsApp with the order pre-filled
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${msg}`, "_blank");
    setSending(false);
    setSent(true);

    // Reset everything after showing the success screen for 3 seconds
    setTimeout(() => {
      setSent(false); setCheckoutOpen(false); setCartOpen(false);
      setCart([]); setCustomerName(""); setCustomerPhone(""); setTableInfo("");
    }, 3000);
  };

  // ─────────────────────────────────────────────────────────────────────────
  // THEME
  // All colors live here. Toggling `dark` switches every component at once.
  // ─────────────────────────────────────────────────────────────────────────
  const A = "#f5a800"; // Bananitos gold — the single dominant accent
  const t = {
    bg:    dark ? "#111111" : "#faf7f0",
    card:  dark ? "#1e1e1e" : "#ffffff",
    muted: dark ? "#282820" : "#f2ede3",
    brd:   dark ? "#333333" : "#e5ddd0",
    txt:   dark ? "#ede8dd" : "#1c1408",
    sub:   dark ? "#88887a" : "#7a6850",
    nav:   dark ? "rgba(17,17,17,.97)" : "rgba(250,247,240,.97)",
    imgBg: dark ? "#242418" : "#f0ebe0",
  };

  // A reusable category tab pill style
  const pill = (active) => ({
    flexShrink:0, padding:"7px 16px", borderRadius:100,
    border:`1.5px solid ${active ? A : t.brd}`,
    background: active ? A : t.card,
    color: active ? "#1c1408" : t.sub,
    fontFamily:"system-ui,sans-serif", fontSize:13,
    fontWeight: active ? 700 : 400, cursor:"pointer",
    transition:"all .18s", whiteSpace:"nowrap",
    boxShadow: active ? `0 3px 12px ${A}50` : "none",
    display:"flex", alignItems:"center", gap:6,
  });

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────
  return (
    <div style={{ minHeight:"100vh", background:t.bg, color:t.txt,
      fontFamily:"Georgia,'Times New Roman',serif", paddingBottom:110 }}>

      <style>{`
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(16px) }
          to   { opacity:1; transform:translateY(0) }
        }
        @keyframes popIn {
          0%,100% { transform:scale(1) }
          40%     { transform:scale(1.18) }
        }
        @keyframes spin {
          from { transform:rotate(0deg) }
          to   { transform:rotate(360deg) }
        }
        * { box-sizing:border-box; -webkit-tap-highlight-color:transparent }
        ::-webkit-scrollbar { width:0; height:0 }
        button:active { transform:scale(.95) !important }
        input:focus   { outline:none; border-color:${A} !important }
        .card:hover   {
          transform:translateY(-3px) !important;
          box-shadow:0 10px 30px rgba(0,0,0,.15) !important;
        }
      `}</style>

      {/* ── HEADER ── */}
      <header style={{ position:"sticky", top:0, zIndex:50,
        background:t.nav, backdropFilter:"blur(16px)",
        borderBottom:`1px solid ${t.brd}`,
        padding:"10px 18px", display:"flex",
        alignItems:"center", justifyContent:"space-between" }}>

        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ fontSize:28 }}>🍌</span>
          <div>
            <div style={{ fontSize:19, fontWeight:"bold", color:A, letterSpacing:-0.5 }}>
              BANANITOS
            </div>
            <div style={{ fontSize:9, color:t.sub, fontFamily:"system-ui,sans-serif",
              letterSpacing:2.5, textTransform:"uppercase" }}>
              Bar y Restaurante
            </div>
          </div>
        </div>

        <div style={{ display:"flex", gap:8, alignItems:"center" }}>
          {/* Dark mode toggle — remembers preference via localStorage */}
          <button onClick={toggleDark} title={dark ? "Modo claro" : "Modo oscuro"}
            style={{ width:36, height:36, borderRadius:"50%",
              border:`1px solid ${t.brd}`, background:t.muted,
              cursor:"pointer", fontSize:17,
              display:"flex", alignItems:"center", justifyContent:"center" }}>
            {dark ? "☀️" : "🌙"}
          </button>

          {/* Cart button — badge shows total item count */}
          <button onClick={() => setCartOpen(true)}
            style={{ position:"relative", width:42, height:42, borderRadius:"50%",
              background:A, border:"none", cursor:"pointer", fontSize:19,
              display:"flex", alignItems:"center", justifyContent:"center",
              boxShadow:`0 4px 16px ${A}55` }}>
            🛒
            {cartCount > 0 && (
              <span style={{ position:"absolute", top:-4, right:-4,
                background:"#ef4444", color:"#fff", fontSize:10, fontWeight:"bold",
                width:18, height:18, borderRadius:"50%",
                display:"flex", alignItems:"center", justifyContent:"center",
                animation:"popIn .3s ease" }}>
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* ── HERO BANNER ── */}
      <div style={{ background: dark
          ? "linear-gradient(160deg,#1e1600 0%,#111 60%)"
          : "linear-gradient(160deg,#fff8e0 0%,#faf7f0 60%)",
        padding:"32px 20px 24px", textAlign:"center",
        borderBottom:`3px solid ${A}`,
        position:"relative", overflow:"hidden" }}>

        {/* Decorative background blobs — add depth without distraction */}
        <div style={{ position:"absolute", bottom:-60, left:-60, width:200, height:200,
          borderRadius:"50%", background:A, opacity:.1, pointerEvents:"none" }}/>
        <div style={{ position:"absolute", top:-50, right:-50, width:160, height:160,
          borderRadius:"50%", background:A, opacity:.12, pointerEvents:"none" }}/>

        <div style={{ fontSize:48, marginBottom:8, position:"relative" }}>🍌</div>
        <div style={{ fontSize:"clamp(22px,5.5vw,32px)", fontWeight:"bold",
          color:A, marginBottom:5, position:"relative" }}>
          Bar y Restaurante Bananitos
        </div>
        <div style={{ fontSize:12, color:t.sub, fontFamily:"system-ui,sans-serif",
          letterSpacing:1, textTransform:"uppercase" }}>
          Germania, Siquirres · Limón, Costa Rica
        </div>
        <div style={{ fontSize:12, color:t.sub, fontFamily:"system-ui,sans-serif", marginTop:3 }}>
          🕐 11:00 a.m. – 10:00 p.m. · Todos los días
        </div>
        <span style={{ marginTop:12, display:"inline-block",
          background:`${A}22`, border:`1px solid ${A}55`,
          borderRadius:20, padding:"4px 16px",
          fontSize:11, color:A, fontFamily:"system-ui,sans-serif" }}>
          *Precio no incluye 10% de servicio a la mesa
        </span>
      </div>

      {/* ── CATEGORY TABS ── */}
      <div style={{ overflowX:"auto", display:"flex", gap:8, padding:"14px 16px",
        borderBottom:`1px solid ${t.brd}`, background:t.bg,
        position:"sticky", top:61, zIndex:40 }}>
        {categories.map((cat) => (
          <button key={cat} style={pill(cat === activeCategory)}
            onClick={() => setActiveCategory(cat)}>
            <Icon type={CAT_ICON[cat]||"plate"}
              color={cat === activeCategory ? "#1c1408" : t.sub} size={14} />
            {cat}
          </button>
        ))}
      </div>

      {/* ── LOADING INDICATOR ── */}
      {loading && (
        <div style={{ display:"flex", flexDirection:"column",
          alignItems:"center", justifyContent:"center",
          minHeight:"40vh", gap:14 }}>
          <div style={{ fontSize:40, animation:"spin 2s linear infinite" }}>🍌</div>
          <div style={{ fontSize:14, color:t.sub, fontFamily:"system-ui,sans-serif" }}>
            Cargando el menú...
          </div>
        </div>
      )}

      {/* ── MENU GRID ── */}
      {!loading && (
        <div style={{ padding:"22px 16px", maxWidth:720, margin:"0 auto" }}>
          <div style={{ fontSize:20, fontWeight:"bold", color:t.txt,
            marginBottom:18, display:"flex", alignItems:"center", gap:10 }}>
            <Icon type={CAT_ICON[activeCategory]||"plate"} color={A} size={22} />
            {activeCategory}
          </div>

          <div style={{ display:"grid",
            gridTemplateColumns:"repeat(auto-fill,minmax(250px,1fr))", gap:14 }}>
            {filtered.map((item, idx) => {
              const qty      = getQty(item.nombre);
              const hasPhoto = !!item.foto;

              return (
                <div key={idx} className="card" style={{
                  background:t.card, borderRadius:18,
                  border:`1px solid ${t.brd}`, overflow:"hidden",
                  display:"flex", flexDirection:"column",
                  boxShadow: dark
                    ? "0 2px 14px rgba(0,0,0,.4)"
                    : "0 2px 12px rgba(0,0,0,.07)",
                  transition:"transform .2s, box-shadow .2s",
                  animation:`fadeUp .3s ease ${idx * .055}s both`,
                }}>

                  {/* ── Photo section (tall card) or icon placeholder ── */}
                  {hasPhoto ? (
                    <div style={{ position:"relative", height:160,
                      overflow:"hidden", background:t.imgBg }}>
                      <img src={item.foto} alt={item.nombre}
                        style={{ width:"100%", height:"100%",
                          objectFit:"cover", display:"block",
                          transition:"transform .4s" }}
                        onError={(e) => {
                          // If the Drive link fails (e.g. permissions issue),
                          // hide the broken image and show the icon fallback.
                          e.target.style.display = "none";
                          e.target.parentElement
                            .querySelector(".img-fb").style.display = "flex";
                        }}
                      />
                      {/* Hidden fallback — only appears if image fails */}
                      <div className="img-fb" style={{ display:"none",
                        position:"absolute", inset:0,
                        alignItems:"center", justifyContent:"center",
                        background:t.imgBg }}>
                        <Icon type={item.icon} color={A} size={44} />
                      </div>
                      {/* Gradient at bottom improves text readability */}
                      <div style={{ position:"absolute", bottom:0, left:0,
                        right:0, height:56,
                        background:`linear-gradient(transparent,${t.card}dd)` }}/>
                    </div>
                  ) : (
                    /* No photo: sophisticated gradient + centered icon */
                    <div style={{ height:100, position:"relative",
                      overflow:"hidden", display:"flex",
                      alignItems:"center", justifyContent:"center",
                      background: dark
                        ? "linear-gradient(135deg,#221e0e,#1a1a12)"
                        : "linear-gradient(135deg,#fdf5e0,#f5edd0)" }}>
                      <div style={{ position:"absolute", inset:0,
                        backgroundImage:`radial-gradient(circle at 50% 50%,${A}25 0%,transparent 65%)` }}/>
                      <Icon type={item.icon} color={A} size={38} />
                    </div>
                  )}

                  {/* ── Card body ── */}
                  <div style={{ padding:"14px 16px 16px", flex:1,
                    display:"flex", flexDirection:"column", gap:10 }}>
                    <div>
                      <div style={{ fontSize:15, fontWeight:600,
                        color:t.txt, lineHeight:1.3 }}>
                        {item.nombre}
                      </div>
                      {item.descripcion && (
                        <div style={{ fontSize:12, color:t.sub, marginTop:4,
                          lineHeight:1.5, fontFamily:"system-ui,sans-serif" }}>
                          {item.descripcion}
                        </div>
                      )}
                    </div>

                    <div style={{ display:"flex", alignItems:"center",
                      justifyContent:"space-between", marginTop:"auto" }}>
                      <div style={{ fontSize:18, fontWeight:"bold", color:A }}>
                        {fmt(item.precio)}
                      </div>

                      {/* Add button vs quantity controls */}
                      {qty === 0 ? (
                        <button onClick={() => addToCart(item)} style={{
                          padding:"8px 18px", borderRadius:100, border:"none",
                          background:A, color:"#1c1408", fontSize:13, fontWeight:700,
                          fontFamily:"system-ui,sans-serif", cursor:"pointer",
                          boxShadow:`0 3px 10px ${A}44` }}>
                          + Agregar
                        </button>
                      ) : (
                        <div style={{ display:"flex", alignItems:"center", gap:8 }}>
                          <button onClick={() => removeFromCart(item.nombre)} style={{
                            width:30, height:30, borderRadius:"50%", border:"none",
                            background:t.muted, color:t.txt, fontSize:18,
                            fontWeight:"bold", cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center" }}>
                            −
                          </button>
                          <span style={{ fontSize:15, fontWeight:"bold",
                            minWidth:18, textAlign:"center",
                            fontFamily:"system-ui,sans-serif" }}>
                            {qty}
                          </span>
                          <button onClick={() => addToCart(item)} style={{
                            width:30, height:30, borderRadius:"50%", border:"none",
                            background:A, color:"#1c1408", fontSize:18,
                            fontWeight:"bold", cursor:"pointer",
                            display:"flex", alignItems:"center", justifyContent:"center",
                            boxShadow:`0 2px 8px ${A}44` }}>
                            +
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ── CART DRAWER ── */}
      {cartOpen && (
        <>
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
            zIndex:80, backdropFilter:"blur(4px)" }}
            onClick={() => setCartOpen(false)} />

          <div style={{ position:"fixed", bottom:0, left:0, right:0,
            maxHeight:"88vh", background:t.card,
            borderRadius:"22px 22px 0 0", zIndex:90,
            display:"flex", flexDirection:"column",
            boxShadow:"0 -8px 40px rgba(0,0,0,.3)", overflow:"hidden" }}>

            {/* Drag handle */}
            <div style={{ width:38, height:4, background:t.brd,
              borderRadius:2, margin:"12px auto 0" }}/>

            {/* Header */}
            <div style={{ padding:"14px 20px 12px",
              borderBottom:`1px solid ${t.brd}`,
              display:"flex", alignItems:"center", justifyContent:"space-between" }}>
              <div style={{ fontSize:17, fontWeight:"bold", color:t.txt }}>
                🛒 Tu Pedido
              </div>
              <button onClick={() => setCartOpen(false)} style={{
                width:30, height:30, borderRadius:"50%",
                border:`1px solid ${t.brd}`, background:t.muted,
                cursor:"pointer", fontSize:14, color:t.sub,
                display:"flex", alignItems:"center", justifyContent:"center" }}>
                ✕
              </button>
            </div>

            {/* Items list */}
            <div style={{ overflowY:"auto", flex:1, padding:"0 20px" }}>
              {cart.length === 0 ? (
                <div style={{ padding:"44px 0", textAlign:"center" }}>
                  <div style={{ width:56, height:56, margin:"0 auto 12px",
                    background:t.muted, borderRadius:16,
                    display:"flex", alignItems:"center", justifyContent:"center" }}>
                    <Icon type="plate" color={t.sub} size={28} />
                  </div>
                  <div style={{ fontSize:16, fontWeight:600, color:t.txt }}>
                    Tu carrito está vacío
                  </div>
                  <div style={{ fontSize:12, color:t.sub,
                    fontFamily:"system-ui,sans-serif", marginTop:5 }}>
                    Agrega algo delicioso del menú
                  </div>
                </div>
              ) : (
                cart.map((item, i) => (
                  <div key={i} style={{ display:"flex", alignItems:"center",
                    padding:"12px 0", borderBottom:`1px solid ${t.brd}`, gap:10 }}>
                    <div style={{ width:36, height:36, borderRadius:10,
                      background:t.muted, flexShrink:0,
                      display:"flex", alignItems:"center", justifyContent:"center" }}>
                      <Icon type={item.icon} color={A} size={18} />
                    </div>
                    <div style={{ flex:1, fontSize:13, lineHeight:1.3,
                      fontFamily:"system-ui,sans-serif", color:t.txt }}>
                      {item.nombre}
                    </div>
                    <div style={{ display:"flex", alignItems:"center", gap:6 }}>
                      <button onClick={() => removeFromCart(item.nombre)} style={{
                        width:26, height:26, borderRadius:"50%", border:"none",
                        background:t.muted, color:t.txt, fontSize:16, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>−</button>
                      <span style={{ fontSize:13, fontWeight:"bold",
                        minWidth:16, textAlign:"center",
                        fontFamily:"system-ui,sans-serif" }}>{item.cantidad}</span>
                      <button onClick={() => addToCart(item)} style={{
                        width:26, height:26, borderRadius:"50%", border:"none",
                        background:A, color:"#1c1408", fontSize:16, cursor:"pointer",
                        display:"flex", alignItems:"center", justifyContent:"center" }}>+</button>
                    </div>
                    <div style={{ fontSize:13, fontWeight:"bold", color:A,
                      minWidth:65, textAlign:"right",
                      fontFamily:"system-ui,sans-serif" }}>
                      {fmt(item.precio * item.cantidad)}
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer with totals and checkout button */}
            {cart.length > 0 && (
              <div style={{ padding:"16px 20px", borderTop:`1px solid ${t.brd}` }}>
                {[["Subtotal", fmt(cartTotal)], ["Servicio (10%)", fmt(servicio)]].map(([l,v]) => (
                  <div key={l} style={{ display:"flex", justifyContent:"space-between",
                    fontSize:13, color:t.sub, fontFamily:"system-ui,sans-serif",
                    marginBottom:5 }}>
                    <span>{l}</span><span>{v}</span>
                  </div>
                ))}
                <div style={{ display:"flex", justifyContent:"space-between",
                  fontSize:17, fontWeight:"bold", color:t.txt,
                  marginBottom:16, marginTop:8 }}>
                  <span>Total</span>
                  <span style={{ color:A }}>{fmt(totalFinal)}</span>
                </div>
                <button onClick={() => { setCartOpen(false); setCheckoutOpen(true); }}
                  style={{ width:"100%", padding:14, borderRadius:14, border:"none",
                    background:`linear-gradient(135deg,${A},#c78500)`,
                    color:"#1c1408", fontSize:15, fontWeight:700,
                    fontFamily:"system-ui,sans-serif", cursor:"pointer",
                    boxShadow:`0 4px 20px ${A}55` }}>
                  📲 Confirmar por WhatsApp
                </button>
              </div>
            )}
          </div>
        </>
      )}

      {/* ── CHECKOUT MODAL ── */}
      {checkoutOpen && (
        <>
          <div style={{ position:"fixed", inset:0, background:"rgba(0,0,0,.55)",
            zIndex:95, backdropFilter:"blur(4px)" }}
            onClick={() => !sending && setCheckoutOpen(false)} />

          <div style={{ position:"fixed", inset:0, zIndex:100,
            display:"flex", alignItems:"flex-end", justifyContent:"center" }}>
            <div style={{ background:t.card, borderRadius:"22px 22px 0 0",
              width:"100%", maxWidth:480, maxHeight:"92vh",
              overflowY:"auto", padding:"24px 20px 36px",
              boxShadow:"0 -8px 40px rgba(0,0,0,.4)" }}>

              {/* Success screen */}
              {sent ? (
                <div style={{ textAlign:"center", padding:"32px 0" }}>
                  <div style={{ fontSize:64, marginBottom:14 }}>🎉</div>
                  <div style={{ fontSize:20, fontWeight:"bold", color:"#16a34a" }}>
                    ¡Pedido enviado!
                  </div>
                  <div style={{ fontSize:13, color:t.sub,
                    fontFamily:"system-ui,sans-serif", marginTop:6 }}>
                    Se abrió WhatsApp con tu pedido listo para confirmar.
                  </div>
                </div>
              ) : (
                <>
                  <div style={{ fontSize:19, fontWeight:"bold",
                    color:t.txt, textAlign:"center", marginBottom:20 }}>
                    📲 Confirmar Pedido
                  </div>

                  {/* Customer info fields */}
                  {[
                    ["Tu nombre *",                  "Ej: Juan Pérez",          customerName,  setCustomerName,  "text"],
                    ["Teléfono (opcional)",          "Ej: 8888-0000",           customerPhone, setCustomerPhone, "tel"],
                    ["Mesa o información adicional", "Mesa 3, Para llevar...",  tableInfo,     setTableInfo,     "text"],
                  ].map(([lbl,ph,val,set,type]) => (
                    <div key={lbl}>
                      <label style={{ fontSize:11, fontWeight:600, color:t.sub,
                        fontFamily:"system-ui,sans-serif", textTransform:"uppercase",
                        letterSpacing:1, marginBottom:5, display:"block" }}>{lbl}</label>
                      <input type={type} placeholder={ph} value={val}
                        onChange={(e) => set(e.target.value)} style={{
                          width:"100%", padding:"11px 14px", borderRadius:12,
                          border:`1.5px solid ${t.brd}`, background:t.muted,
                          color:t.txt, fontSize:14, fontFamily:"system-ui,sans-serif",
                          marginBottom:14, transition:"border-color .2s" }} />
                    </div>
                  ))}

                  {/* Order summary */}
                  <div style={{ background:t.muted, borderRadius:12,
                    padding:14, marginBottom:16 }}>
                    {cart.map((item, i) => (
                      <div key={i} style={{ display:"flex",
                        justifyContent:"space-between", fontSize:12,
                        color:t.sub, fontFamily:"system-ui,sans-serif",
                        marginBottom:3 }}>
                        <span>{item.cantidad}x {item.nombre}</span>
                        <span style={{ color:A, fontWeight:"bold" }}>
                          {fmt(item.precio * item.cantidad)}
                        </span>
                      </div>
                    ))}
                    <div style={{ borderTop:`1px solid ${t.brd}`,
                      paddingTop:8, marginTop:8 }}>
                      {[["Subtotal",fmt(cartTotal)],["Servicio 10%",fmt(servicio)]].map(([l,v])=>(
                        <div key={l} style={{ display:"flex",
                          justifyContent:"space-between", fontSize:12,
                          color:t.sub, fontFamily:"system-ui,sans-serif",
                          marginBottom:3 }}>
                          <span>{l}</span><span>{v}</span>
                        </div>
                      ))}
                      <div style={{ display:"flex", justifyContent:"space-between",
                        fontSize:16, fontWeight:"bold", color:t.txt, marginTop:4 }}>
                        <span>Total</span>
                        <span style={{ color:A }}>{fmt(totalFinal)}</span>
                      </div>
                    </div>
                  </div>

                  {/* WhatsApp send button */}
                  <button onClick={sendOrder}
                    disabled={!customerName.trim() || sending}
                    style={{ width:"100%", padding:14, borderRadius:14, border:"none",
                      background:"linear-gradient(135deg,#25D366,#128C7E)",
                      color:"#fff", fontSize:15, fontWeight:700,
                      fontFamily:"system-ui,sans-serif",
                      cursor: (!customerName.trim() || sending) ? "not-allowed" : "pointer",
                      opacity: (!customerName.trim() || sending) ? .6 : 1,
                      boxShadow:"0 4px 18px #25D36655",
                      display:"flex", alignItems:"center",
                      justifyContent:"center", gap:8 }}>
                    {sending ? "⏳ Enviando..." : "📲 Enviar por WhatsApp"}
                  </button>

                  <p style={{ textAlign:"center", fontSize:11, color:t.sub,
                    fontFamily:"system-ui,sans-serif", marginTop:10 }}>
                    Se abrirá WhatsApp con tu pedido listo para enviar
                  </p>
                </>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
