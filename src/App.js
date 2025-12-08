import React, { useState, useEffect } from 'react';

// ==================== NAVBAR ====================
const Navbar = ({ currentPage, setCurrentPage, user }) => {
  const navItems = [
    { id: 'registro', label: 'Registro', icon: '📝' },
    { id: 'competencia', label: 'Competencia', icon: '🏊' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'resultados', label: 'Resultados', icon: '🏆' },
    { id: 'rankings', label: 'Rankings', icon: '📈' },
  ];

  return (
    <nav style={{
      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
      padding: '0',
      boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div style={{
        maxWidth: '1400px',
        margin: '0 auto',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '16px 0' }}>
          <span style={{ fontSize: '32px' }}>🏊</span>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: '700' }}>
              SISTEMA DE MARCAJE
            </h1>
            <span style={{ color: '#a8d4f0', fontSize: '11px', textTransform: 'uppercase' }}>
              Cronometraje IoT
            </span>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '4px' }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => setCurrentPage(item.id)}
              style={{
                background: currentPage === item.id ? 'rgba(255,255,255,0.2)' : 'transparent',
                border: 'none',
                color: 'white',
                padding: '12px 20px',
                cursor: 'pointer',
                borderRadius: '8px 8px 0 0',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: currentPage === item.id ? '600' : '400',
                borderBottom: currentPage === item.id ? '3px solid #4fc3f7' : '3px solid transparent'
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </div>

        {user && (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            color: 'white',
            background: 'rgba(255,255,255,0.1)',
            padding: '8px 16px',
            borderRadius: '20px'
          }}>
            <span>👤</span>
            <span style={{ fontSize: '14px' }}>{user}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

// ==================== LOGIN ====================
const LoginPage = ({ setCurrentPage, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Complete todos los campos');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas');
        return;
      }

      localStorage.setItem('user', JSON.stringify(data.user));
      setUser(data.user.nombre + ' ' + data.user.apellido);
      setCurrentPage('competencia');
    } catch (err) {
      setError('Error de conexión');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0a1628 0%, #1e3a5f 50%, #2d5a87 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '400px',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <div style={{
            width: '80px',
            height: '80px',
            background: 'linear-gradient(135deg, #1e3a5f 0%, #4fc3f7 100%)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px',
            fontSize: '40px'
          }}>🏊</div>
          <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px' }}>Bienvenido</h2>
          <p style={{ margin: 0, color: '#666' }}>Sistema de Marcaje Deportivo</p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>Usuario</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600' }}>Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{ background: '#ffebee', color: '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '20px' }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: '16px',
              background: loading ? '#90a4ae' : 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '16px',
              fontWeight: '600',
              cursor: loading ? 'wait' : 'pointer'
            }}
          >
            {loading ? '⏳ Ingresando...' : 'Ingresar'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center', color: '#999', fontSize: '13px' }}>
          Usuario: admin | Contraseña: admin123
        </div>
      </div>
    </div>
  );
};

// ==================== REGISTRO ====================
const RegistroPage = ({ deportistas, setDeportistas }) => {
  const [formData, setFormData] = useState({ nombre: '', apellido: '', rut: '', edad: '', categoria: '', club: '' });
  const [rfid, setRfid] = useState('');
  const [mensaje, setMensaje] = useState(null);
  const [clubes, setClubes] = useState([]);
  const [categorias, setCategorias] = useState([]);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [c, cat, dep] = await Promise.all([
        fetch('/api/catalogos/clubes').then(r => r.json()),
        fetch('/api/catalogos/categorias').then(r => r.json()),
        fetch('/api/deportistas').then(r => r.json())
      ]);
      setClubes(c);
      setCategorias(cat);
      setDeportistas(dep);
    } catch (e) {
      console.error(e);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!rfid) {
      setMensaje({ type: 'error', text: 'Ingrese un código RFID' });
      return;
    }

    try {
      const clubObj = clubes.find(c => c.nombre === formData.club);
      const catObj = categorias.find(c => c.nombre === formData.categoria);

      const response = await fetch('/api/deportistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut: formData.rut,
          nombre: formData.nombre,
          apellido: formData.apellido,
          edad: parseInt(formData.edad),
          idClub: clubObj?.id,
          idCategoria: catObj?.id,
          rfidCode: rfid
        })
      });

      if (!response.ok) throw new Error((await response.json()).error);

      setMensaje({ type: 'success', text: `✅ ${formData.nombre} registrado` });
      setFormData({ nombre: '', apellido: '', rut: '', edad: '', categoria: '', club: '' });
      setRfid('');
      cargarDatos();
    } catch (error) {
      setMensaje({ type: 'error', text: error.message });
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>📝 Registro de Deportistas</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <input placeholder="Nombre" value={formData.nombre} onChange={(e) => setFormData({...formData, nombre: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
              <input placeholder="Apellido" value={formData.apellido} onChange={(e) => setFormData({...formData, apellido: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <input placeholder="RUT" value={formData.rut} onChange={(e) => setFormData({...formData, rut: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
              <input type="number" placeholder="Edad" value={formData.edad} onChange={(e) => setFormData({...formData, edad: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <select value={formData.categoria} onChange={(e) => setFormData({...formData, categoria: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                <option value="">Categoría...</option>
                {categorias.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
              <select value={formData.club} onChange={(e) => setFormData({...formData, club: e.target.value})} required style={{ padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px' }}>
                <option value="">Club...</option>
                {clubes.map(c => <option key={c.id} value={c.nombre}>{c.nombre}</option>)}
              </select>
            </div>
            <input placeholder="Código RFID de la pulsera" value={rfid} onChange={(e) => setRfid(e.target.value)} style={{ width: '100%', padding: '12px', border: '2px solid #e0e0e0', borderRadius: '8px', marginBottom: '16px', boxSizing: 'border-box' }} />
            
            {mensaje && <div style={{ background: mensaje.type === 'success' ? '#e8f5e9' : '#ffebee', color: mensaje.type === 'success' ? '#2e7d32' : '#c62828', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>{mensaje.text}</div>}
            
            <button type="submit" style={{ width: '100%', padding: '16px', background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)', color: 'white', border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600', cursor: 'pointer' }}>
              Registrar Deportista
            </button>
          </form>
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 16px' }}>Deportistas ({deportistas.length})</h3>
          <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
            {deportistas.map(d => (
              <div key={d.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '12px', borderBottom: '1px solid #eee' }}>
                <div style={{ width: '40px', height: '40px', background: '#1e3a5f', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: '700' }}>
                  {d.nombre?.[0]}{d.apellido?.[0]}
                </div>
                <div>
                  <div style={{ fontWeight: '600' }}>{d.nombre} {d.apellido}</div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{d.categoria?.nombre || d.categoria} • RFID: {d.rfidCode || d.rfid_code || 'N/A'}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== COMPETENCIA ====================
const CompetenciaPage = ({ deportistas, setDeportistas, setCurrentPage, setCarreraActual }) => {
  const [pruebaId, setPruebaId] = useState('');
  const [categoriaId, setCategoriaId] = useState('');
  const [pruebas, setPruebas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [p, c, d] = await Promise.all([
        fetch('/api/catalogos/pruebas').then(r => r.json()),
        fetch('/api/catalogos/categorias').then(r => r.json()),
        fetch('/api/deportistas').then(r => r.json())
      ]);
      setPruebas(p);
      setCategorias(c);
      setDeportistas(d);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getDeportistas = (catId) => {
    const cat = categorias.find(c => c.id === catId);
    return deportistas.filter(d => (d.categoria?.nombre || d.categoria) === cat?.nombre);
  };

  const iniciar = async () => {
    try {
      // Crear competencia
      const compResp = await fetch('/api/competencias', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre: `Competencia ${new Date().toLocaleDateString()}`, fecha: new Date().toISOString().split('T')[0], lugar: 'Piscina' })
      });
      const compData = await compResp.json();

      // Crear carrera
      const carreraResp = await fetch('/api/carreras', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idCompetencia: compData.competencia.id, idPrueba: pruebaId, idCategoria: categoriaId, numeroSerie: 1 })
      });
      const carreraData = await carreraResp.json();

      const prueba = pruebas.find(p => p.id === pruebaId);
      const cat = categorias.find(c => c.id === categoriaId);

      setCarreraActual({
        id: carreraData.carrera.id,
        prueba,
        categoria: cat.nombre,
        deportistasDisponibles: getDeportistas(categoriaId),
        participaciones: [],
        tiempoInicio: null
      });
      setCurrentPage('dashboard');
    } catch (e) {
      alert('Error: ' + e.message);
    }
  };

  if (loading) return <div style={{ padding: '32px', textAlign: 'center' }}>⏳ Cargando...</div>;

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>🏊 Nueva Competencia</h2>
      
      <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          <div>
            <h3 style={{ marginBottom: '16px' }}>Prueba</h3>
            {pruebas.map(p => (
              <button key={p.id} onClick={() => setPruebaId(p.id)} style={{
                display: 'block', width: '100%', padding: '16px', marginBottom: '8px',
                border: pruebaId === p.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
                background: pruebaId === p.id ? '#e3f2fd' : 'white',
                borderRadius: '12px', textAlign: 'left', cursor: 'pointer'
              }}>
                <div style={{ fontWeight: '600' }}>{p.nombre}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>{p.num_carriles} carriles • {p.distancia_metros}m</div>
              </button>
            ))}
          </div>
          <div>
            <h3 style={{ marginBottom: '16px' }}>Categoría</h3>
            {categorias.map(c => (
              <button key={c.id} onClick={() => setCategoriaId(c.id)} style={{
                display: 'block', width: '100%', padding: '16px', marginBottom: '8px',
                border: categoriaId === c.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
                background: categoriaId === c.id ? '#e3f2fd' : 'white',
                borderRadius: '12px', textAlign: 'left', cursor: 'pointer'
              }}>
                <span style={{ fontWeight: '600' }}>{c.nombre}</span>
                <span style={{ float: 'right', background: '#e8f5e9', color: '#2e7d32', padding: '2px 10px', borderRadius: '12px', fontSize: '13px' }}>
                  {getDeportistas(c.id).length}
                </span>
              </button>
            ))}
          </div>
        </div>

        <button onClick={iniciar} disabled={!pruebaId || !categoriaId} style={{
          width: '100%', padding: '18px',
          background: pruebaId && categoriaId ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)' : '#e0e0e0',
          color: pruebaId && categoriaId ? 'white' : '#999',
          border: 'none', borderRadius: '12px', fontSize: '16px', fontWeight: '600',
          cursor: pruebaId && categoriaId ? 'pointer' : 'not-allowed'
        }}>
          Continuar →
        </button>
      </div>
    </div>
  );
};

// ==================== DASHBOARD ====================
const DashboardPage = ({ carreraActual, setCarreraActual, setHistorialResultados }) => {
  const [timer, setTimer] = useState(0);
  const [mensaje, setMensaje] = useState(null);
  const [iniciada, setIniciada] = useState(false);

  const formatTime = (ms) => {
    if (!ms && ms !== 0) return '--:--.--';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  useEffect(() => {
    let interval;
    if (iniciada && carreraActual?.tiempoInicio) {
      interval = setInterval(() => setTimer(Date.now() - carreraActual.tiempoInicio), 10);
    }
    return () => clearInterval(interval);
  }, [iniciada, carreraActual?.tiempoInicio]);

  const asignarDeportista = async (dep, carril) => {
    try {
      const resp = await fetch(`/api/carreras/${carreraActual.id}/asignar-carril`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rfidCode: dep.rfidCode || dep.rfid_code, carril })
      });
      if (!resp.ok) throw new Error((await resp.json()).error);

      setCarreraActual({
        ...carreraActual,
        participaciones: [...carreraActual.participaciones, { carril, deportista: dep, tiempo: null }]
      });
      setMensaje({ type: 'success', text: `✅ ${dep.nombre} → Carril ${carril}` });
    } catch (e) {
      setMensaje({ type: 'error', text: e.message });
    }
  };

  const iniciarCarrera = async () => {
    const t = Date.now();
    try {
      await fetch(`/api/carreras/${carreraActual.id}/iniciar`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tiempoInicio: t })
      });
      setCarreraActual({ ...carreraActual, tiempoInicio: t });
      setIniciada(true);
      setMensaje({ type: 'success', text: '🟢 ¡CARRERA INICIADA!' });
    } catch (e) {
      setMensaje({ type: 'error', text: e.message });
    }
  };

  const registrarLlegada = async (carril) => {
    const p = carreraActual.participaciones.find(x => x.carril === carril);
    if (!p || p.tiempo !== null) return;

    const t = Date.now();
    try {
      const resp = await fetch(`/api/carreras/${carreraActual.id}/registrar-llegada`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ carril, tiempoLlegada: t, rfidCode: p.deportista.rfidCode || p.deportista.rfid_code })
      });
      const data = await resp.json();

      setCarreraActual({
        ...carreraActual,
        participaciones: carreraActual.participaciones.map(x => x.carril === carril ? { ...x, tiempo: data.tiempoFinalMs } : x)
      });
      setMensaje({ type: 'success', text: `🏁 ${p.deportista.nombre}: ${formatTime(data.tiempoFinalMs)}` });
    } catch (e) {
      setMensaje({ type: 'error', text: e.message });
    }
  };

  const finalizar = async () => {
    try {
      const resp = await fetch(`/api/carreras/${carreraActual.id}/finalizar`, { method: 'PUT' });
      const data = await resp.json();

      setHistorialResultados(prev => [...prev, {
        id: carreraActual.id,
        prueba: carreraActual.prueba.nombre,
        categoria: carreraActual.categoria,
        fecha: new Date().toLocaleDateString(),
        resultados: data.resultados.map(r => ({
          posicion: r.posicion,
          deportista: { nombre: r.deportista_nombre, apellido: r.deportista_apellido, club: r.club_nombre },
          carril: r.carril,
          tiempo: r.tiempo_final_ms
        }))
      }]);
      setCarreraActual(null);
      setIniciada(false);
    } catch (e) {
      setMensaje({ type: 'error', text: e.message });
    }
  };

  if (!carreraActual) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <span style={{ fontSize: '64px' }}>🏊</span>
        <h2>No hay carrera activa</h2>
        <p style={{ color: '#666' }}>Ve a Competencia para crear una</p>
      </div>
    );
  }

  const { prueba, participaciones = [], deportistasDisponibles = [] } = carreraActual;
  const numCarriles = prueba?.num_carriles || 8;
  const todos = participaciones.length > 0 && participaciones.every(p => p.tiempo !== null);
  const sinAsignar = deportistasDisponibles.filter(d => !participaciones.some(p => p.deportista.id === d.id));

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
        <div>
          <h2 style={{ margin: 0, color: '#1e3a5f' }}>📊 {prueba?.nombre}</h2>
          <p style={{ margin: 0, color: '#666' }}>Categoría {carreraActual.categoria}</p>
        </div>
        <div style={{
          background: iniciada ? '#1e3a5f' : '#f5f5f5',
          color: iniciada ? 'white' : '#333',
          padding: '16px 32px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '36px',
          fontWeight: '700'
        }}>
          {formatTime(timer)}
        </div>
      </div>

      {mensaje && (
        <div style={{
          background: mensaje.type === 'success' ? '#e8f5e9' : '#ffebee',
          color: mensaje.type === 'success' ? '#2e7d32' : '#c62828',
          padding: '16px', borderRadius: '12px', marginBottom: '24px',
          display: 'flex', justifyContent: 'space-between'
        }}>
          <span>{mensaje.text}</span>
          <button onClick={() => setMensaje(null)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>✕</button>
        </div>
      )}

      <div style={{ display: 'flex', gap: '16px', marginBottom: '24px' }}>
        {!iniciada && participaciones.length > 0 && (
          <button onClick={iniciarCarrera} style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>
            🔔 INICIAR CARRERA
          </button>
        )}
        {iniciada && todos && (
          <button onClick={finalizar} style={{
            padding: '16px 32px',
            background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
            color: 'white', border: 'none', borderRadius: '12px',
            fontSize: '16px', fontWeight: '600', cursor: 'pointer'
          }}>
            🏆 Finalizar Carrera
          </button>
        )}
      </div>

      {!iniciada && sinAsignar.length > 0 && (
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 16px' }}>Asignar deportistas</h3>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {sinAsignar.map(d => (
              <div key={d.id} style={{ background: '#e3f2fd', padding: '12px', borderRadius: '8px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ fontWeight: '600' }}>{d.nombre} {d.apellido}</span>
                <select onChange={(e) => { if (e.target.value) { asignarDeportista(d, parseInt(e.target.value)); e.target.value = ''; } }} style={{ padding: '6px', borderRadius: '6px', border: '1px solid #1976d2' }}>
                  <option value="">Carril...</option>
                  {Array.from({ length: numCarriles }, (_, i) => i + 1).filter(c => !participaciones.some(p => p.carril === c)).map(c => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${Math.min(numCarriles, 8)}, 1fr)`, gap: '16px' }}>
        {Array.from({ length: numCarriles }, (_, i) => i + 1).map(carril => {
          const p = participaciones.find(x => x.carril === carril);
          const done = p?.tiempo !== null && p?.tiempo !== undefined;
          return (
            <div
              key={carril}
              onClick={() => iniciada && p && !done && registrarLlegada(carril)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: done ? '3px solid #4caf50' : p ? '3px solid #1976d2' : '3px solid #e0e0e0',
                cursor: iniciada && p && !done ? 'pointer' : 'default',
                textAlign: 'center',
                position: 'relative'
              }}
            >
              <div style={{
                position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)',
                background: p ? '#1976d2' : '#9e9e9e', color: 'white',
                width: '32px', height: '32px', borderRadius: '50%',
                display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700'
              }}>{carril}</div>
              
              <div style={{ marginTop: '8px', fontSize: '14px', color: '#666' }}>CARRIL {carril}</div>
              
              {p ? (
                <>
                  <div style={{
                    width: '60px', height: '60px',
                    background: done ? 'linear-gradient(135deg, #2e7d32, #4caf50)' : 'linear-gradient(135deg, #1e3a5f, #4fc3f7)',
                    borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    margin: '12px auto', color: 'white', fontWeight: '700', fontSize: '20px'
                  }}>{done ? '✓' : `${p.deportista.nombre[0]}${p.deportista.apellido[0]}`}</div>
                  <div style={{ fontWeight: '600' }}>{p.deportista.nombre} {p.deportista.apellido}</div>
                  <div style={{
                    background: done ? '#e8f5e9' : '#f5f5f5',
                    padding: '12px', borderRadius: '8px', marginTop: '12px',
                    fontFamily: 'monospace', fontSize: '24px', fontWeight: '700',
                    color: done ? '#2e7d32' : '#333'
                  }}>{formatTime(p.tiempo)}</div>
                  {iniciada && !done && <div style={{ marginTop: '12px', padding: '8px', background: '#fff3e0', borderRadius: '6px', fontSize: '12px', color: '#e65100' }}>👆 Click para registrar</div>}
                </>
              ) : (
                <div style={{ padding: '40px', color: '#999' }}>
                  <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>👤</span>
                  Vacío
                </div>
              )}
            </div>
          );
        })}
      </div>

      {iniciada && (
        <div style={{
          position: 'fixed', bottom: '32px', right: '32px',
          background: 'linear-gradient(135deg, #2e7d32, #4caf50)',
          color: 'white', padding: '16px 24px', borderRadius: '12px',
          display: 'flex', alignItems: 'center', gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
        }}>
          <span style={{ fontSize: '24px' }}>🔔</span>
          <span style={{ fontWeight: '600' }}>Carrera en curso</span>
        </div>
      )}
    </div>
  );
};

// ==================== RESULTADOS ====================
const ResultadosPage = ({ historialResultados, setHistorialResultados }) => {
  const [sel, setSel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cargarHistorial();
  }, []);

  const cargarHistorial = async () => {
    try {
      const resp = await fetch('/api/carreras/historial/resultados');
      const data = await resp.json();
      setHistorialResultados(data);
    } catch (e) {
      console.error('Error cargando historial:', e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return '--:--.--';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px' }}>⏳</span>
        <p>Cargando resultados...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>🏆 Resultados</h2>
      
      <div style={{ display: 'grid', gridTemplateColumns: '300px 1fr', gap: '32px' }}>
        <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          <h3 style={{ margin: '0 0 16px' }}>Competencias</h3>
          {historialResultados.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📋</span>
              Sin resultados
            </div>
          ) : (
            historialResultados.map(c => (
              <button key={c.id} onClick={() => setSel(c)} style={{
                display: 'block', width: '100%', padding: '16px', marginBottom: '8px',
                border: sel?.id === c.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
                background: sel?.id === c.id ? '#e3f2fd' : 'white',
                borderRadius: '12px', textAlign: 'left', cursor: 'pointer'
              }}>
                <div style={{ fontWeight: '600' }}>{c.prueba}</div>
                <div style={{ fontSize: '13px', color: '#666' }}>{c.categoria} • {c.fecha}</div>
              </button>
            ))
          )}
        </div>

        <div style={{ background: 'white', borderRadius: '16px', padding: '32px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
          {sel ? (
            <>
              <h3 style={{ margin: '0 0 24px', color: '#1e3a5f' }}>{sel.prueba} - {sel.categoria}</h3>
              
              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '16px', marginBottom: '32px' }}>
                {sel.resultados[1] && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px' }}>🥈</div>
                    <div style={{ background: '#C0C0C0', padding: '20px', borderRadius: '8px 8px 0 0', minWidth: '100px', height: '70px' }}>
                      <div style={{ color: 'white', fontWeight: '700' }}>{sel.resultados[1].deportista.nombre}</div>
                      <div style={{ color: 'white', fontFamily: 'monospace' }}>{formatTime(sel.resultados[1].tiempo)}</div>
                    </div>
                  </div>
                )}
                {sel.resultados[0] && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '48px' }}>🥇</div>
                    <div style={{ background: '#FFD700', padding: '24px', borderRadius: '8px 8px 0 0', minWidth: '110px', height: '90px' }}>
                      <div style={{ color: '#333', fontWeight: '700', fontSize: '16px' }}>{sel.resultados[0].deportista.nombre}</div>
                      <div style={{ color: '#333', fontFamily: 'monospace', fontSize: '20px', fontWeight: '700' }}>{formatTime(sel.resultados[0].tiempo)}</div>
                    </div>
                  </div>
                )}
                {sel.resultados[2] && (
                  <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '36px' }}>🥉</div>
                    <div style={{ background: '#CD7F32', padding: '20px', borderRadius: '8px 8px 0 0', minWidth: '100px', height: '50px' }}>
                      <div style={{ color: 'white', fontWeight: '700' }}>{sel.resultados[2].deportista.nombre}</div>
                      <div style={{ color: 'white', fontFamily: 'monospace' }}>{formatTime(sel.resultados[2].tiempo)}</div>
                    </div>
                  </div>
                )}
              </div>

              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Pos</th>
                    <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Deportista</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>Carril</th>
                    <th style={{ padding: '12px', textAlign: 'right', color: '#666' }}>Tiempo</th>
                  </tr>
                </thead>
                <tbody>
                  {sel.resultados.map(r => (
                    <tr key={r.carril} style={{ borderBottom: '1px solid #f0f0f0' }}>
                      <td style={{ padding: '16px 12px' }}>
                        {r.posicion === 1 ? '🥇' : r.posicion === 2 ? '🥈' : r.posicion === 3 ? '🥉' : r.posicion}
                      </td>
                      <td style={{ padding: '16px 12px', fontWeight: '600' }}>{r.deportista.nombre} {r.deportista.apellido}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'center' }}>{r.carril}</td>
                      <td style={{ padding: '16px 12px', textAlign: 'right', fontFamily: 'monospace', fontSize: '18px', fontWeight: '600', color: r.posicion === 1 ? '#2e7d32' : '#333' }}>
                        {formatTime(r.tiempo)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
              <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👈</span>
              Seleccione una competencia
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ==================== RANKINGS ====================
const RankingsPage = () => {
  const [tab, setTab] = useState('general'); // 'general', 'categoria', 'prueba', 'clubes'
  const [categorias, setCategorias] = useState([]);
  const [pruebas, setPruebas] = useState([]);
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState('');
  const [ranking, setRanking] = useState([]);
  const [loading, setLoading] = useState(false);
  const [infoExtra, setInfoExtra] = useState(null);

  useEffect(() => {
    cargarCatalogos();
  }, []);

  useEffect(() => {
    if (tab === 'general') cargarRankingGeneral();
    if (tab === 'clubes') cargarRankingClubes();
  }, [tab]);

  useEffect(() => {
    if (tab === 'categoria' && categoriaSeleccionada) {
      cargarRankingCategoria(categoriaSeleccionada);
    }
  }, [categoriaSeleccionada, tab]);

  useEffect(() => {
    if (tab === 'prueba' && pruebaSeleccionada) {
      cargarRankingPrueba(pruebaSeleccionada);
    }
  }, [pruebaSeleccionada, tab]);

  const cargarCatalogos = async () => {
    try {
      const [cat, pru] = await Promise.all([
        fetch('/api/catalogos/categorias').then(r => r.json()),
        fetch('/api/catalogos/pruebas').then(r => r.json())
      ]);
      setCategorias(cat);
      setPruebas(pru);
    } catch (e) {
      console.error(e);
    }
  };

  const cargarRankingGeneral = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/rankings/general').then(r => r.json());
      setRanking(data);
      setInfoExtra(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cargarRankingCategoria = async (idCategoria) => {
    setLoading(true);
    try {
      const data = await fetch(`/api/rankings/categoria/${idCategoria}`).then(r => r.json());
      setRanking(data.ranking || []);
      setInfoExtra({ tipo: 'categoria', data: data.categoria });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cargarRankingPrueba = async (idPrueba) => {
    setLoading(true);
    try {
      const url = categoriaSeleccionada 
        ? `/api/rankings/prueba/${idPrueba}?idCategoria=${categoriaSeleccionada}`
        : `/api/rankings/prueba/${idPrueba}`;
      const data = await fetch(url).then(r => r.json());
      setRanking(data.ranking || []);
      setInfoExtra({ tipo: 'prueba', data: data.prueba });
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const cargarRankingClubes = async () => {
    setLoading(true);
    try {
      const data = await fetch('/api/rankings/clubes').then(r => r.json());
      setRanking(data);
      setInfoExtra(null);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (ms) => {
    if (!ms) return '--:--.--';
    const m = Math.floor(ms / 60000);
    const s = Math.floor((ms % 60000) / 1000);
    const cs = Math.floor((ms % 1000) / 10);
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}.${String(cs).padStart(2, '0')}`;
  };

  const getMedalla = (pos) => {
    if (pos === 1) return '🥇';
    if (pos === 2) return '🥈';
    if (pos === 3) return '🥉';
    return pos;
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2 style={{ color: '#1e3a5f', marginBottom: '24px' }}>📈 Rankings</h2>

      {/* Tabs */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        {[
          { id: 'general', label: '🏅 General', desc: 'Todos los deportistas' },
          { id: 'categoria', label: '👥 Por Categoría', desc: 'Senior, Juvenil, etc.' },
          { id: 'prueba', label: '🏊 Por Prueba', desc: 'Mejores tiempos' },
          { id: 'clubes', label: '🏢 Clubes', desc: 'Ranking de clubes' },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => { setTab(t.id); setRanking([]); }}
            style={{
              padding: '12px 20px',
              border: tab === t.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
              background: tab === t.id ? '#e3f2fd' : 'white',
              borderRadius: '12px',
              cursor: 'pointer',
              textAlign: 'left'
            }}
          >
            <div style={{ fontWeight: '600' }}>{t.label}</div>
            <div style={{ fontSize: '12px', color: '#666' }}>{t.desc}</div>
          </button>
        ))}
      </div>

      {/* Filtros */}
      {tab === 'categoria' && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          <label style={{ fontWeight: '600', marginRight: '12px' }}>Seleccionar categoría:</label>
          <select
            value={categoriaSeleccionada}
            onChange={(e) => setCategoriaSeleccionada(e.target.value)}
            style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '200px' }}
          >
            <option value="">-- Seleccione --</option>
            {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
          </select>
        </div>
      )}

      {tab === 'prueba' && (
        <div style={{ background: 'white', padding: '16px', borderRadius: '12px', marginBottom: '24px', display: 'flex', gap: '24px', flexWrap: 'wrap' }}>
          <div>
            <label style={{ fontWeight: '600', marginRight: '12px' }}>Seleccionar prueba:</label>
            <select
              value={pruebaSeleccionada}
              onChange={(e) => setPruebaSeleccionada(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '200px' }}
            >
              <option value="">-- Seleccione --</option>
              {pruebas.map(p => <option key={p.id} value={p.id}>{p.nombre} ({p.distancia_metros}m)</option>)}
            </select>
          </div>
          <div>
            <label style={{ fontWeight: '600', marginRight: '12px' }}>Filtrar por categoría (opcional):</label>
            <select
              value={categoriaSeleccionada}
              onChange={(e) => setCategoriaSeleccionada(e.target.value)}
              style={{ padding: '10px', borderRadius: '8px', border: '2px solid #e0e0e0', minWidth: '200px' }}
            >
              <option value="">Todas las categorías</option>
              {categorias.map(c => <option key={c.id} value={c.id}>{c.nombre}</option>)}
            </select>
          </div>
        </div>
      )}

      {/* Info Extra */}
      {infoExtra && (
        <div style={{ background: '#e3f2fd', padding: '16px', borderRadius: '12px', marginBottom: '24px' }}>
          {infoExtra.tipo === 'categoria' && (
            <span style={{ fontWeight: '600' }}>📊 Ranking de categoría: {infoExtra.data?.nombre}</span>
          )}
          {infoExtra.tipo === 'prueba' && (
            <span style={{ fontWeight: '600' }}>🏊 Mejores tiempos en: {infoExtra.data?.nombre} ({infoExtra.data?.distancia_metros}m)</span>
          )}
        </div>
      )}

      {/* Tabla de Ranking */}
      <div style={{ background: 'white', borderRadius: '16px', padding: '24px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '40px' }}>⏳ Cargando...</div>
        ) : ranking.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
            <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>📋</span>
            {tab === 'general' || tab === 'clubes' ? 'No hay datos de ranking aún' : 'Seleccione una opción para ver el ranking'}
          </div>
        ) : (
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666', width: '60px' }}>Pos</th>
                <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>
                  {tab === 'clubes' ? 'Club' : 'Deportista'}
                </th>
                {tab !== 'clubes' && <th style={{ padding: '12px', textAlign: 'left', color: '#666' }}>Club</th>}
                {(tab === 'general' || tab === 'categoria') && (
                  <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>Categoría</th>
                )}
                {tab === 'prueba' && (
                  <>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>Mejor Tiempo</th>
                    <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>Promedio</th>
                  </>
                )}
                <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>🥇</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>🥈</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>🥉</th>
                <th style={{ padding: '12px', textAlign: 'center', color: '#666' }}>Puntos</th>
              </tr>
            </thead>
            <tbody>
              {ranking.map((r, idx) => (
                <tr key={r.id || idx} style={{ borderBottom: '1px solid #f0f0f0', background: r.posicion <= 3 ? '#fffde7' : 'transparent' }}>
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontSize: '18px' }}>
                    {getMedalla(r.posicion)}
                  </td>
                  <td style={{ padding: '16px 12px' }}>
                    <div style={{ fontWeight: '600' }}>
                      {tab === 'clubes' ? r.nombre : `${r.nombre} ${r.apellido}`}
                    </div>
                    {tab === 'clubes' && (
                      <div style={{ fontSize: '12px', color: '#666' }}>{r.total_deportistas} deportistas</div>
                    )}
                  </td>
                  {tab !== 'clubes' && (
                    <td style={{ padding: '16px 12px', color: '#666' }}>{r.club_nombre || '-'}</td>
                  )}
                  {(tab === 'general' || tab === 'categoria') && (
                    <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                      <span style={{ background: '#e8f5e9', color: '#2e7d32', padding: '4px 12px', borderRadius: '12px', fontSize: '12px' }}>
                        {r.categoria_nombre || '-'}
                      </span>
                    </td>
                  )}
                  {tab === 'prueba' && (
                    <>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontFamily: 'monospace', fontWeight: '700', color: '#1976d2' }}>
                        {formatTime(r.mejor_tiempo_ms)}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'center', fontFamily: 'monospace', color: '#666' }}>
                        {formatTime(r.tiempo_promedio_ms)}
                      </td>
                    </>
                  )}
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#ffd700' }}>
                    {tab === 'clubes' ? r.medallas_oro : r.primer_lugar}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#c0c0c0' }}>
                    {tab === 'clubes' ? r.medallas_plata : r.segundo_lugar}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center', fontWeight: '600', color: '#cd7f32' }}>
                    {tab === 'clubes' ? r.medallas_bronce : r.tercer_lugar}
                  </td>
                  <td style={{ padding: '16px 12px', textAlign: 'center' }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)', 
                      color: 'white', 
                      padding: '6px 16px', 
                      borderRadius: '20px', 
                      fontWeight: '700',
                      fontSize: '14px'
                    }}>
                      {r.puntos_totales || 0}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Leyenda de puntos */}
      <div style={{ marginTop: '24px', background: '#f5f5f5', padding: '16px', borderRadius: '12px' }}>
        <h4 style={{ margin: '0 0 12px', color: '#666' }}>📊 Sistema de puntuación:</h4>
        <div style={{ display: 'flex', gap: '24px', flexWrap: 'wrap', fontSize: '14px', color: '#666' }}>
          <span>🥇 1° lugar = 10 pts</span>
          <span>🥈 2° lugar = 6 pts</span>
          <span>🥉 3° lugar = 4 pts</span>
          <span>4° lugar = 3 pts</span>
          <span>5° lugar = 2 pts</span>
          <span>6°+ lugar = 1 pt</span>
        </div>
      </div>
    </div>
  );
};

// ==================== APP ====================
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [deportistas, setDeportistas] = useState([]);
  const [carreraActual, setCarreraActual] = useState(null);
  const [historialResultados, setHistorialResultados] = useState([]);

  const renderPage = () => {
    switch (currentPage) {
      case 'login': return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
      case 'registro': return <RegistroPage deportistas={deportistas} setDeportistas={setDeportistas} />;
      case 'competencia': return <CompetenciaPage deportistas={deportistas} setDeportistas={setDeportistas} setCurrentPage={setCurrentPage} setCarreraActual={setCarreraActual} />;
      case 'dashboard': return <DashboardPage carreraActual={carreraActual} setCarreraActual={setCarreraActual} setHistorialResultados={setHistorialResultados} />;
      case 'resultados': return <ResultadosPage historialResultados={historialResultados} setHistorialResultados={setHistorialResultados} />;
      case 'rankings': return <RankingsPage />;
      default: return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f5f7fa', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
      {currentPage !== 'login' && <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />}
      {renderPage()}
    </div>
  );
}
