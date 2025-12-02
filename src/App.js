import React, { useState, useEffect, useCallback } from 'react';

// ==================== COMPONENTES DE NAVEGACIÓN ====================
const Navbar = ({ currentPage, setCurrentPage, user }) => {
  const navItems = [
    { id: 'login', label: 'Inicio', icon: '🏠' },
    { id: 'registro', label: 'Registro Deportista', icon: '📝' },
    { id: 'competencia', label: 'Competencia', icon: '🏊' },
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'resultados', label: 'Resultados', icon: '🏆' },
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
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '16px 0'
        }}>
          <span style={{ fontSize: '32px' }}>🏊</span>
          <div>
            <h1 style={{ color: 'white', margin: 0, fontSize: '20px', fontWeight: '700', letterSpacing: '0.5px' }}>
              SISTEMA DE MARCAJE
            </h1>
            <span style={{ color: '#a8d4f0', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Cronometraje Automatizado IoT
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
                transition: 'all 0.2s ease',
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
            <span style={{ fontSize: '20px' }}>👤</span>
            <span style={{ fontSize: '14px' }}>{user}</span>
          </div>
        )}
      </div>
    </nav>
  );
};

// ==================== PÁGINA DE LOGIN ====================
const LoginPage = ({ setCurrentPage, setUser }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Por favor complete todos los campos');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || 'Credenciales inválidas');
        setLoading(false);
        return;
      }

      // Guardar usuario en localStorage
      localStorage.setItem('user', JSON.stringify(data.user));
      localStorage.setItem('userId', data.user.id);
      
      setUser(data.user.nombre + ' ' + data.user.apellido);
      setCurrentPage('registro');
    } catch (err) {
      setError('Error de conexión con el servidor');
      console.error('Error login:', err);
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
      justifyContent: 'center',
      padding: '20px'
    }}>
      <div style={{
        background: 'white',
        borderRadius: '24px',
        padding: '48px',
        width: '100%',
        maxWidth: '440px',
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
          }}>
            🏊
          </div>
          <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px', fontWeight: '700' }}>
            Bienvenido
          </h2>
          <p style={{ margin: 0, color: '#666', fontSize: '15px' }}>
            Sistema de Marcaje Deportivo IoT
          </p>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '20px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
              Usuario
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Ingrese su usuario"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontWeight: '600', fontSize: '14px' }}>
              Contraseña
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingrese su contraseña"
              style={{
                width: '100%',
                padding: '14px 16px',
                border: '2px solid #e0e0e0',
                borderRadius: '12px',
                fontSize: '15px',
                transition: 'border-color 0.2s',
                boxSizing: 'border-box'
              }}
            />
          </div>

          {error && (
            <div style={{
              background: '#ffebee',
              color: '#c62828',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              ⚠️ {error}
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
              cursor: loading ? 'wait' : 'pointer',
              transition: 'transform 0.2s, box-shadow 0.2s',
              boxShadow: '0 4px 15px rgba(30,58,95,0.3)'
            }}
          >
            {loading ? '⏳ Verificando...' : 'Iniciar Sesión'}
          </button>
        </form>

        <p style={{ textAlign: 'center', marginTop: '24px', color: '#888', fontSize: '13px' }}>
          FEDESUB - Federación de Actividades Subacuáticas
        </p>
        <p style={{ textAlign: 'center', marginTop: '8px', color: '#aaa', fontSize: '12px' }}>
          Usuario: admin | Contraseña: admin123
        </p>
      </div>
    </div>
  );
};

// ==================== PÁGINA DE REGISTRO DE DEPORTISTA ====================
const RegistroDeportistaPage = ({ deportistas, setDeportistas }) => {
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    edad: '',
    categoria: '',
    club: '',
    rut: ''
  });
  const [rfidScanning, setRfidScanning] = useState(false);
  const [rfidAssigned, setRfidAssigned] = useState(null);
  const [rfidManual, setRfidManual] = useState('');
  const [message, setMessage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const [clubes, setClubes] = useState([]);

  // Cargar datos al montar el componente
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      // Cargar deportistas
      const respDeportistas = await fetch('/api/deportistas');
      const dataDeportistas = await respDeportistas.json();
      setDeportistas(dataDeportistas);

      // Cargar categorías
      const respCategorias = await fetch('/api/catalogos/categorias');
      const dataCategorias = await respCategorias.json();
      setCategorias(dataCategorias);

      // Cargar clubes
      const respClubes = await fetch('/api/catalogos/clubes');
      const dataClubes = await respClubes.json();
      setClubes(dataClubes);
    } catch (error) {
      console.error('Error cargando datos:', error);
      setMessage({ type: 'error', text: 'Error al cargar datos del servidor' });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!rfidAssigned) {
      setMessage({ type: 'error', text: 'Debe asignar una pulsera RFID al deportista' });
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // Buscar IDs de categoría y club
      const categoriaObj = categorias.find(c => c.nombre === formData.categoria);
      const clubObj = clubes.find(c => c.nombre === formData.club);

      const response = await fetch('/api/deportistas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          rut: formData.rut,
          nombre: formData.nombre,
          apellido: formData.apellido,
          edad: parseInt(formData.edad),
          idCategoria: categoriaObj?.id,
          idClub: clubObj?.id,
          rfidCode: rfidAssigned
        })
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Error al registrar deportista' });
        return;
      }

      setMessage({ type: 'success', text: `Deportista ${formData.nombre} ${formData.apellido} registrado exitosamente` });
      
      // Recargar lista de deportistas
      await cargarDatos();
      
      // Reset form
      setFormData({ nombre: '', apellido: '', edad: '', categoria: '', club: '', rut: '' });
      setRfidAssigned(null);
      setRfidManual('');
    } catch (error) {
      console.error('Error:', error);
      setMessage({ type: 'error', text: 'Error de conexión con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  const scanRFID = async () => {
    setRfidScanning(true);
    setMessage(null);
    
    try {
      // Buscar el último evento RFID del sensor
      const response = await fetch('/api/eventos?limit=1&evento=TOQUE');
      const eventos = await response.json();
      
      if (eventos.length > 0 && eventos[0].rfid) {
        // Verificar que el RFID no esté ya asignado
        const checkResponse = await fetch(`/api/deportistas/rfid/${eventos[0].rfid}`);
        
        if (checkResponse.ok) {
          const deportistaExistente = await checkResponse.json();
          setMessage({ 
            type: 'error', 
            text: `Este RFID ya está asignado a ${deportistaExistente.nombre} ${deportistaExistente.apellido}` 
          });
          setRfidScanning(false);
          return;
        }
        
        setRfidAssigned(eventos[0].rfid);
        setMessage({ type: 'info', text: `Pulsera RFID detectada: ${eventos[0].rfid}` });
      } else {
        // Si no hay evento reciente, simular o pedir ingreso manual
        setMessage({ type: 'info', text: 'No se detectó RFID. Puede ingresarlo manualmente abajo.' });
      }
    } catch (error) {
      console.error('Error escaneando RFID:', error);
      setMessage({ type: 'info', text: 'No se detectó RFID. Puede ingresarlo manualmente.' });
    } finally {
      setRfidScanning(false);
    }
  };

  const asignarRfidManual = () => {
    if (rfidManual.trim()) {
      setRfidAssigned(rfidManual.trim());
      setMessage({ type: 'info', text: `RFID asignado manualmente: ${rfidManual.trim()}` });
      setRfidManual('');
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px' }}>
          📝 Registro de Deportista
        </h2>
        <p style={{ margin: 0, color: '#666' }}>
          Ingrese los datos del deportista y asigne su pulsera RFID usando el sensor RFID #2
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Formulario */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <h3 style={{ margin: '0 0 24px', color: '#333', fontSize: '18px' }}>
            Datos del Deportista
          </h3>

          <form onSubmit={handleSubmit}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  Nombre
                </label>
                <input
                  type="text"
                  value={formData.nombre}
                  onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  Apellido
                </label>
                <input
                  type="text"
                  value={formData.apellido}
                  onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '16px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  RUT
                </label>
                <input
                  type="text"
                  value={formData.rut}
                  onChange={(e) => setFormData({...formData, rut: e.target.value})}
                  placeholder="12.345.678-9"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  Edad
                </label>
                <input
                  type="number"
                  value={formData.edad}
                  onChange={(e) => setFormData({...formData, edad: e.target.value})}
                  min="6"
                  max="80"
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  Categoría
                </label>
                <select
                  value={formData.categoria}
                  onChange={(e) => setFormData({...formData, categoria: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                >
                  <option value="">Seleccione...</option>
                  {categorias.map(cat => (
                    <option key={cat.id} value={cat.nombre}>{cat.nombre}</option>
                  ))}
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '6px', color: '#555', fontSize: '14px', fontWeight: '500' }}>
                  Club
                </label>
                <select
                  value={formData.club}
                  onChange={(e) => setFormData({...formData, club: e.target.value})}
                  required
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '2px solid #e0e0e0',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box',
                    background: 'white'
                  }}
                >
                  <option value="">Seleccione...</option>
                  {clubes.map(club => (
                    <option key={club.id} value={club.nombre}>{club.nombre}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Sección RFID */}
            <div style={{
              background: '#f8f9fa',
              borderRadius: '12px',
              padding: '20px',
              marginBottom: '24px',
              border: '2px dashed #dee2e6'
            }}>
              <h4 style={{ margin: '0 0 16px', color: '#333', fontSize: '16px' }}>
                📡 Asignación de Pulsera RFID (Sensor #2)
              </h4>
              
              {rfidAssigned ? (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: '#e8f5e9',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  color: '#2e7d32'
                }}>
                  <span style={{ fontSize: '24px' }}>✅</span>
                  <div>
                    <div style={{ fontWeight: '600' }}>Pulsera Asignada</div>
                    <div style={{ fontFamily: 'monospace' }}>{rfidAssigned}</div>
                  </div>
                  <button
                    type="button"
                    onClick={() => setRfidAssigned(null)}
                    style={{
                      marginLeft: 'auto',
                      background: 'none',
                      border: 'none',
                      color: '#666',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={scanRFID}
                    disabled={rfidScanning}
                    style={{
                      width: '100%',
                      padding: '16px',
                      background: rfidScanning ? '#90caf9' : 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '15px',
                      fontWeight: '600',
                      cursor: rfidScanning ? 'wait' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '10px',
                      marginBottom: '12px'
                    }}
                  >
                    {rfidScanning ? (
                      <>
                        <span style={{ animation: 'pulse 1s infinite' }}>📡</span>
                        Buscando RFID...
                      </>
                    ) : (
                      <>
                        <span>📡</span>
                        Detectar Pulsera RFID
                      </>
                    )}
                  </button>
                  
                  {/* Input manual de RFID */}
                  <div style={{ display: 'flex', gap: '8px' }}>
                    <input
                      type="text"
                      value={rfidManual}
                      onChange={(e) => setRfidManual(e.target.value)}
                      placeholder="O ingrese código RFID manualmente..."
                      style={{
                        flex: 1,
                        padding: '10px 12px',
                        border: '2px solid #e0e0e0',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                    <button
                      type="button"
                      onClick={asignarRfidManual}
                      disabled={!rfidManual.trim()}
                      style={{
                        padding: '10px 16px',
                        background: rfidManual.trim() ? '#4caf50' : '#e0e0e0',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: rfidManual.trim() ? 'pointer' : 'not-allowed'
                      }}
                    >
                      Asignar
                    </button>
                  </div>
                </>
              )}
            </div>

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
              {loading ? '⏳ Guardando...' : 'Registrar Deportista'}
            </button>
          </form>
        </div>

        {/* Lista de deportistas registrados */}
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '32px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <h3 style={{ margin: 0, color: '#333', fontSize: '18px' }}>
              Deportistas Registrados ({deportistas.length})
            </h3>
            <button
              onClick={cargarDatos}
              style={{
                padding: '8px 16px',
                background: '#e3f2fd',
                color: '#1976d2',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              🔄 Actualizar
            </button>
          </div>

          {message && (
            <div style={{
              background: message.type === 'success' ? '#e8f5e9' : message.type === 'error' ? '#ffebee' : '#e3f2fd',
              color: message.type === 'success' ? '#2e7d32' : message.type === 'error' ? '#c62828' : '#1565c0',
              padding: '12px 16px',
              borderRadius: '8px',
              marginBottom: '20px',
              fontSize: '14px'
            }}>
              {message.text}
            </div>
          )}

          <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
            {deportistas.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👥</span>
                No hay deportistas registrados
              </div>
            ) : (
              deportistas.map(dep => (
                <div
                  key={dep.id}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '16px',
                    padding: '16px',
                    borderBottom: '1px solid #eee',
                    transition: 'background 0.2s'
                  }}
                >
                  <div style={{
                    width: '48px',
                    height: '48px',
                    background: 'linear-gradient(135deg, #1e3a5f 0%, #4fc3f7 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '700',
                    fontSize: '18px'
                  }}>
                    {dep.nombre?.[0] || '?'}{dep.apellido?.[0] || '?'}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: '600', color: '#333' }}>
                      {dep.nombre} {dep.apellido}
                    </div>
                    <div style={{ fontSize: '13px', color: '#666' }}>
                      {dep.categoria?.nombre || dep.categoria || 'Sin categoría'} • {dep.club?.nombre || dep.club || 'Sin club'}
                    </div>
                    <div style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
                      {dep.rfidCode || dep.rfid_code || 'Sin RFID'}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

// ==================== PÁGINA DE SELECCIÓN DE COMPETENCIA ====================
const CompetenciaPage = ({ deportistas, setDeportistas, setCurrentPage, setCompetenciaActual }) => {
  const [pruebaSeleccionada, setPruebaSeleccionada] = useState('');
  const [categoriaSeleccionada, setCategoriaSeleccionada] = useState('');
  const [pruebas, setPruebas] = useState([]);
  const [categorias, setCategorias] = useState([]);
  const [loading, setLoading] = useState(true);

  // Cargar datos al montar
  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    setLoading(true);
    try {
      // Cargar pruebas
      const respPruebas = await fetch('/api/catalogos/pruebas');
      const dataPruebas = await respPruebas.json();
      setPruebas(dataPruebas);

      // Cargar categorías
      const respCategorias = await fetch('/api/catalogos/categorias');
      const dataCategorias = await respCategorias.json();
      setCategorias(dataCategorias);

      // Cargar deportistas actualizados
      const respDeportistas = await fetch('/api/deportistas');
      const dataDeportistas = await respDeportistas.json();
      setDeportistas(dataDeportistas);
    } catch (error) {
      console.error('Error cargando datos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Contar deportistas por categoría
  const contarDeportistasPorCategoria = (categoriaNombre) => {
    return deportistas.filter(d => {
      const catNombre = d.categoria?.nombre || d.categoria;
      return catNombre === categoriaNombre;
    }).length;
  };

  // Obtener deportistas de una categoría
  const getDeportistasCategoria = (categoriaNombre) => {
    return deportistas.filter(d => {
      const catNombre = d.categoria?.nombre || d.categoria;
      return catNombre === categoriaNombre;
    });
  };

  const iniciarCompetencia = () => {
    if (!pruebaSeleccionada || !categoriaSeleccionada) {
      alert('Debe seleccionar una prueba y categoría');
      return;
    }

    const prueba = pruebas.find(p => p.id === pruebaSeleccionada);
    const deportistasInscritos = getDeportistasCategoria(categoriaSeleccionada);
    
    setCompetenciaActual({
      prueba: {
        id: prueba.id,
        nombre: prueba.nombre,
        carriles: prueba.num_carriles || 8
      },
      categoria: categoriaSeleccionada,
      deportistasInscritos: deportistasInscritos,
      carriles: Array(prueba.num_carriles || 8).fill(null),
      estado: 'asignacion',
      tiempoInicio: null,
      tiempos: {}
    });
    setCurrentPage('dashboard');
  };

  if (loading) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>⏳</span>
        <p>Cargando datos...</p>
      </div>
    );
  }

  return (
    <div style={{ padding: '32px', maxWidth: '1000px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px' }}>
          🏊 Preparación de Competencia
        </h2>
        <p style={{ margin: 0, color: '#666' }}>
          Seleccione la prueba y categoría para iniciar el proceso de asignación de carriles
        </p>
      </div>

      <div style={{
        background: 'white',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px', marginBottom: '32px' }}>
          {/* Selección de Prueba */}
          <div>
            <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>
              Seleccionar Prueba
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {pruebas.map(prueba => (
                <button
                  key={prueba.id}
                  onClick={() => setPruebaSeleccionada(prueba.id)}
                  style={{
                    padding: '16px 20px',
                    border: pruebaSeleccionada === prueba.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    background: pruebaSeleccionada === prueba.id ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                    {prueba.nombre}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {prueba.num_carriles || 8} carriles • {prueba.distancia_metros || '?'}m
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Selección de Categoría */}
          <div>
            <h3 style={{ margin: '0 0 16px', color: '#333', fontSize: '18px' }}>
              Seleccionar Categoría
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {categorias.map(cat => {
                const count = contarDeportistasPorCategoria(cat.nombre);
                return (
                  <button
                    key={cat.id}
                    onClick={() => setCategoriaSeleccionada(cat.nombre)}
                    style={{
                      padding: '16px 20px',
                      border: categoriaSeleccionada === cat.nombre ? '2px solid #1976d2' : '2px solid #e0e0e0',
                      borderRadius: '12px',
                      background: categoriaSeleccionada === cat.nombre ? '#e3f2fd' : 'white',
                      cursor: 'pointer',
                      textAlign: 'left',
                      transition: 'all 0.2s',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <span style={{ fontWeight: '600', color: '#333' }}>{cat.nombre}</span>
                    <span style={{
                      background: count > 0 ? '#e8f5e9' : '#f5f5f5',
                      color: count > 0 ? '#2e7d32' : '#999',
                      padding: '4px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      fontWeight: '600'
                    }}>
                      {count} deportistas
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Resumen de selección */}
        {pruebaSeleccionada && categoriaSeleccionada && (
          <div style={{
            background: '#f8f9fa',
            borderRadius: '12px',
            padding: '24px',
            marginBottom: '24px'
          }}>
            <h4 style={{ margin: '0 0 16px', color: '#333' }}>Resumen de Competencia</h4>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Prueba</div>
                <div style={{ fontWeight: '600', color: '#1e3a5f' }}>
                  {pruebas.find(p => p.id === pruebaSeleccionada)?.nombre}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Categoría</div>
                <div style={{ fontWeight: '600', color: '#1e3a5f' }}>
                  {categoriaSeleccionada}
                </div>
              </div>
              <div>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '4px' }}>Deportistas Disponibles</div>
                <div style={{ fontWeight: '600', color: '#1e3a5f' }}>
                  {contarDeportistasPorCategoria(categoriaSeleccionada)}
                </div>
              </div>
            </div>
            
            {/* Lista de deportistas disponibles */}
            {contarDeportistasPorCategoria(categoriaSeleccionada) > 0 && (
              <div style={{ marginTop: '16px', paddingTop: '16px', borderTop: '1px solid #e0e0e0' }}>
                <div style={{ fontSize: '13px', color: '#666', marginBottom: '8px' }}>Deportistas inscritos:</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {getDeportistasCategoria(categoriaSeleccionada).map(dep => (
                    <span
                      key={dep.id}
                      style={{
                        background: '#e3f2fd',
                        color: '#1565c0',
                        padding: '4px 12px',
                        borderRadius: '16px',
                        fontSize: '13px'
                      }}
                    >
                      {dep.nombre} {dep.apellido}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        <button
          onClick={iniciarCompetencia}
          disabled={!pruebaSeleccionada || !categoriaSeleccionada || contarDeportistasPorCategoria(categoriaSeleccionada) === 0}
          style={{
            width: '100%',
            padding: '18px',
            background: pruebaSeleccionada && categoriaSeleccionada && contarDeportistasPorCategoria(categoriaSeleccionada) > 0
              ? 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)' 
              : '#e0e0e0',
            color: pruebaSeleccionada && categoriaSeleccionada && contarDeportistasPorCategoria(categoriaSeleccionada) > 0 ? 'white' : '#999',
            border: 'none',
            borderRadius: '12px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: pruebaSeleccionada && categoriaSeleccionada && contarDeportistasPorCategoria(categoriaSeleccionada) > 0 ? 'pointer' : 'not-allowed'
          }}
        >
          {contarDeportistasPorCategoria(categoriaSeleccionada) === 0 && categoriaSeleccionada 
            ? 'No hay deportistas en esta categoría' 
            : 'Continuar a Asignación de Carriles →'}
        </button>
      </div>
    </div>
  );
};

// ==================== PÁGINA DE DASHBOARD DE COMPETENCIA ====================
const DashboardPage = ({ competenciaActual, setCompetenciaActual, setHistorialResultados }) => {
  const [scanning, setScanning] = useState(false);
  const [competenciaIniciada, setCompetenciaIniciada] = useState(false);
  const [timer, setTimer] = useState(0);
  const [ultimoEvento, setUltimoEvento] = useState(null);
  const [mensaje, setMensaje] = useState(null);
  const [modoAutomatico, setModoAutomatico] = useState(true);
  const [tiempoInicioReal, setTiempoInicioReal] = useState(null);

  // Timer para la competencia
  useEffect(() => {
    let interval;
    if (competenciaIniciada && competenciaActual?.tiempoInicio) {
      interval = setInterval(() => {
        setTimer(Date.now() - competenciaActual.tiempoInicio);
      }, 10);
    }
    return () => clearInterval(interval);
  }, [competenciaIniciada, competenciaActual?.tiempoInicio]);

  // Polling de eventos IoT (cada 500ms)
  useEffect(() => {
    if (!modoAutomatico) return;

    const pollEventos = async () => {
      try {
        // Obtener últimos eventos
        const response = await fetch('/api/eventos?limit=5');
        const eventos = await response.json();
        
        if (eventos.length > 0) {
          const eventoReciente = eventos[0];
          
          // Verificar si es un evento nuevo (últimos 3 segundos)
          const tiempoEvento = new Date(eventoReciente.recibido_en).getTime();
          const ahora = Date.now();
          
          if (ahora - tiempoEvento < 3000 && eventoReciente.id_evento !== ultimoEvento?.id_evento) {
            setUltimoEvento(eventoReciente);
            procesarEvento(eventoReciente);
          }
        }
      } catch (error) {
        console.error('Error polling eventos:', error);
      }
    };

    const interval = setInterval(pollEventos, 500);
    return () => clearInterval(interval);
  }, [modoAutomatico, ultimoEvento, competenciaActual, competenciaIniciada]);

  // Procesar evento del sensor
  const procesarEvento = async (evento) => {
    console.log('📡 Evento recibido:', evento);
    
    const { carril, rfid, evento: tipoEvento, ts_evento } = evento;

    // Si es evento de INICIO (botón del juez)
    if (tipoEvento === 'INICIO' || (carril === 0 && tipoEvento === 'TOQUE')) {
      if (!competenciaIniciada) {
        setMensaje({ type: 'success', text: '🏁 ¡COMPETENCIA INICIADA por el juez!' });
        iniciarCompetenciaConTimestamp(ts_evento);
      }
      return;
    }

    // Si es evento TOQUE
    if (tipoEvento === 'TOQUE') {
      // Durante asignación de carriles
      if (!competenciaIniciada) {
        await asignarCarrilPorRFID(rfid, carril);
      } 
      // Durante la competencia (llegada a meta)
      else {
        await registrarLlegadaPorRFID(rfid, carril, ts_evento);
      }
    }
  };

  // Asignar carril por RFID
  const asignarCarrilPorRFID = async (rfid, carrilSugerido) => {
    try {
      // Buscar deportista por RFID
      const response = await fetch(`/api/deportistas/rfid/${rfid}`);
      
      if (!response.ok) {
        setMensaje({ type: 'error', text: `⚠️ RFID ${rfid} no registrado en el sistema` });
        return;
      }
      
      const deportista = await response.json();
      
      // Verificar si ya está asignado
      if (competenciaActual.carriles.some(c => c?.id === deportista.id)) {
        setMensaje({ type: 'info', text: `ℹ️ ${deportista.nombre} ya está asignado a un carril` });
        return;
      }

      // Buscar carril libre (preferir el sugerido por el sensor)
      let carrilIndex = carrilSugerido ? carrilSugerido - 1 : -1;
      
      if (carrilIndex < 0 || carrilIndex >= competenciaActual.carriles.length || competenciaActual.carriles[carrilIndex] !== null) {
        carrilIndex = competenciaActual.carriles.findIndex(c => c === null);
      }

      if (carrilIndex === -1) {
        setMensaje({ type: 'error', text: '⚠️ No hay carriles disponibles' });
        return;
      }

      // Asignar deportista al carril
      const nuevosCarriles = [...competenciaActual.carriles];
      nuevosCarriles[carrilIndex] = deportista;
      
      setCompetenciaActual({
        ...competenciaActual,
        carriles: nuevosCarriles
      });

      setMensaje({ 
        type: 'success', 
        text: `✅ ${deportista.nombre} ${deportista.apellido} asignado al carril ${carrilIndex + 1}` 
      });

    } catch (error) {
      console.error('Error asignando carril:', error);
      setMensaje({ type: 'error', text: 'Error al buscar deportista' });
    }
  };

  // Iniciar competencia con timestamp del sensor
  const iniciarCompetenciaConTimestamp = (tsEvento) => {
    const tiempoInicio = Date.now();
    setTiempoInicioReal(tsEvento); // Guardar timestamp del microcontrolador
    
    setCompetenciaActual({
      ...competenciaActual,
      tiempoInicio: tiempoInicio,
      tiempoInicioSensor: tsEvento,
      estado: 'en_curso'
    });
    setCompetenciaIniciada(true);
  };

  // Registrar llegada por RFID
  const registrarLlegadaPorRFID = async (rfid, carril, tsEvento) => {
    // Buscar en qué carril está el deportista con ese RFID
    let carrilIndex = -1;
    
    // Primero intentar por carril del sensor
    if (carril > 0 && carril <= competenciaActual.carriles.length) {
      const depEnCarril = competenciaActual.carriles[carril - 1];
      if (depEnCarril && (depEnCarril.rfid_code === rfid || depEnCarril.rfidCode === rfid)) {
        carrilIndex = carril - 1;
      }
    }

    // Si no, buscar por RFID
    if (carrilIndex === -1) {
      carrilIndex = competenciaActual.carriles.findIndex(c => 
        c && (c.rfid_code === rfid || c.rfidCode === rfid)
      );
    }

    if (carrilIndex === -1) {
      setMensaje({ type: 'error', text: `⚠️ RFID ${rfid} no encontrado en los carriles` });
      return;
    }

    // Verificar si ya llegó
    if (competenciaActual.tiempos && competenciaActual.tiempos[carrilIndex] !== undefined) {
      return; // Ya registrado
    }

    // Calcular tiempo
    let tiempoFinal;
    if (competenciaActual.tiempoInicioSensor && tsEvento) {
      // Usar timestamps del microcontrolador (más precisos)
      tiempoFinal = tsEvento - competenciaActual.tiempoInicioSensor;
    } else {
      // Fallback a tiempo del sistema
      tiempoFinal = Date.now() - competenciaActual.tiempoInicio;
    }

    const deportista = competenciaActual.carriles[carrilIndex];
    
    setCompetenciaActual({
      ...competenciaActual,
      tiempos: {
        ...competenciaActual.tiempos,
        [carrilIndex]: tiempoFinal
      }
    });

    setMensaje({ 
      type: 'success', 
      text: `🏁 ${deportista.nombre} ${deportista.apellido} - Tiempo: ${formatTime(tiempoFinal)}` 
    });
  };

  if (!competenciaActual) {
    return (
      <div style={{ padding: '32px', textAlign: 'center' }}>
        <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>🏊</span>
        <h2 style={{ color: '#333' }}>No hay competencia activa</h2>
        <p style={{ color: '#666' }}>Vaya a la sección de Competencia para configurar una nueva prueba</p>
      </div>
    );
  }

  const { prueba, categoria, carriles, deportistasInscritos, estado, tiempos = {} } = competenciaActual;

  // Escanear RFID manual (simulación o para testing)
  const escanearRFIDManual = () => {
    if (deportistasInscritos.length === 0) return;
    
    setScanning(true);
    setTimeout(() => {
      const carrilLibre = carriles.findIndex(c => c === null);
      if (carrilLibre !== -1 && deportistasInscritos.length > 0) {
        const deportistasNoAsignados = deportistasInscritos.filter(
          d => !carriles.some(c => c?.id === d.id)
        );
        
        if (deportistasNoAsignados.length > 0) {
          const deportistaRandom = deportistasNoAsignados[Math.floor(Math.random() * deportistasNoAsignados.length)];
          const nuevosCarriles = [...carriles];
          nuevosCarriles[carrilLibre] = deportistaRandom;
          setCompetenciaActual({
            ...competenciaActual,
            carriles: nuevosCarriles
          });
          setMensaje({ type: 'success', text: `✅ ${deportistaRandom.nombre} asignado al carril ${carrilLibre + 1}` });
        }
      }
      setScanning(false);
    }, 1500);
  };

  // Iniciar la competencia manualmente
  const iniciarCompetencia = () => {
    iniciarCompetenciaConTimestamp(Date.now());
  };

  // Registrar llegada manual (click en carril)
  const registrarLlegada = (carrilIndex) => {
    if (!competenciaIniciada || tiempos[carrilIndex] !== undefined) return;
    
    const tiempoLlegada = Date.now();
    const tiempoFinal = tiempoLlegada - competenciaActual.tiempoInicio;
    
    const deportista = carriles[carrilIndex];
    
    setCompetenciaActual({
      ...competenciaActual,
      tiempos: {
        ...competenciaActual.tiempos,
        [carrilIndex]: tiempoFinal
      }
    });

    setMensaje({ 
      type: 'success', 
      text: `🏁 ${deportista.nombre} ${deportista.apellido} - Tiempo: ${formatTime(tiempoFinal)}` 
    });
  };

  // Formatear tiempo
  const formatTime = (ms) => {
    if (ms === undefined) return '--:--.--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  // Verificar si todos terminaron
  const todosTerminaron = carriles.filter(c => c !== null).length > 0 &&
    carriles.every((c, i) => c === null || tiempos[i] !== undefined);

  // Finalizar competencia
  const finalizarCompetencia = () => {
    const resultados = carriles
      .map((deportista, index) => {
        if (!deportista) return null;
        return {
          deportista,
          carril: index + 1,
          tiempo: tiempos[index],
          posicion: 0
        };
      })
      .filter(r => r !== null)
      .sort((a, b) => a.tiempo - b.tiempo)
      .map((r, index) => ({ ...r, posicion: index + 1 }));

    setHistorialResultados(prev => [...prev, {
      id: Date.now(),
      prueba: prueba.nombre,
      categoria: categoria,
      fecha: new Date().toLocaleDateString(),
      hora: new Date().toLocaleTimeString(),
      resultados
    }]);

    setCompetenciaActual(null);
    setCompetenciaIniciada(false);
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '24px'
      }}>
        <div>
          <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px' }}>
            📊 Dashboard de Competencia
          </h2>
          <p style={{ margin: 0, color: '#666' }}>
            {prueba.nombre} - Categoría {categoria}
          </p>
        </div>
        
        {/* Indicador modo automático */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          background: modoAutomatico ? '#e8f5e9' : '#f5f5f5',
          padding: '8px 16px',
          borderRadius: '20px'
        }}>
          <span style={{ fontSize: '16px' }}>{modoAutomatico ? '📡' : '🔌'}</span>
          <span style={{ fontSize: '13px', color: modoAutomatico ? '#2e7d32' : '#666' }}>
            {modoAutomatico ? 'Sensores conectados' : 'Modo manual'}
          </span>
          <button
            onClick={() => setModoAutomatico(!modoAutomatico)}
            style={{
              background: modoAutomatico ? '#4caf50' : '#9e9e9e',
              border: 'none',
              borderRadius: '12px',
              width: '44px',
              height: '24px',
              cursor: 'pointer',
              position: 'relative'
            }}
          >
            <div style={{
              width: '20px',
              height: '20px',
              background: 'white',
              borderRadius: '50%',
              position: 'absolute',
              top: '2px',
              left: modoAutomatico ? '22px' : '2px',
              transition: 'left 0.2s'
            }} />
          </button>
        </div>
        
        {/* Timer principal */}
        <div style={{
          background: competenciaIniciada ? '#1e3a5f' : '#f5f5f5',
          color: competenciaIniciada ? 'white' : '#333',
          padding: '16px 32px',
          borderRadius: '12px',
          fontFamily: 'monospace',
          fontSize: '36px',
          fontWeight: '700',
          letterSpacing: '2px'
        }}>
          {formatTime(timer)}
        </div>
      </div>

      {/* Mensaje de eventos */}
      {mensaje && (
        <div style={{
          background: mensaje.type === 'success' ? '#e8f5e9' : mensaje.type === 'error' ? '#ffebee' : '#e3f2fd',
          color: mensaje.type === 'success' ? '#2e7d32' : mensaje.type === 'error' ? '#c62828' : '#1565c0',
          padding: '16px 24px',
          borderRadius: '12px',
          marginBottom: '24px',
          fontSize: '16px',
          fontWeight: '500',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <span>{mensaje.text}</span>
          <button
            onClick={() => setMensaje(null)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px' }}
          >
            ✕
          </button>
        </div>
      )}

      {/* Estado de la competencia */}
      <div style={{
        display: 'flex',
        gap: '16px',
        marginBottom: '24px'
      }}>
        <div style={{
          flex: 1,
          background: estado === 'asignacion' ? '#fff3e0' : '#e8f5e9',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px'
        }}>
          <span style={{ fontSize: '24px' }}>{estado === 'asignacion' ? '📋' : '🏁'}</span>
          <div>
            <div style={{ fontWeight: '600', color: '#333' }}>
              {estado === 'asignacion' ? 'Asignación de Carriles' : 'Competencia en Curso'}
            </div>
            <div style={{ fontSize: '13px', color: '#666' }}>
              {estado === 'asignacion' 
                ? 'Pase las pulseras por el RFID #1 para asignar carriles'
                : 'Los deportistas están compitiendo'}
            </div>
          </div>
        </div>

        {!competenciaIniciada && (
          <button
            onClick={escanearRFIDManual}
            disabled={scanning || carriles.every(c => c !== null)}
            style={{
              padding: '16px 32px',
              background: scanning ? '#90caf9' : 'linear-gradient(135deg, #1976d2 0%, #2196f3 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: scanning ? 'wait' : 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            {scanning ? '📡 Escaneando...' : '📡 Escanear RFID #1'}
          </button>
        )}

        {!competenciaIniciada && carriles.some(c => c !== null) && (
          <button
            onClick={iniciarCompetencia}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🔔 Iniciar Competencia (Touch Juez)
          </button>
        )}

        {todosTerminaron && (
          <button
            onClick={finalizarCompetencia}
            style={{
              padding: '16px 32px',
              background: 'linear-gradient(135deg, #f57c00 0%, #ff9800 100%)',
              color: 'white',
              border: 'none',
              borderRadius: '12px',
              fontSize: '15px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '10px'
            }}
          >
            🏆 Finalizar y Ver Resultados
          </button>
        )}
      </div>

      {/* Carriles */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${prueba.carriles}, 1fr)`,
        gap: '16px'
      }}>
        {carriles.map((deportista, index) => {
          const tiempoCarril = tiempos[index];
          const terminado = tiempoCarril !== undefined;
          
          return (
            <div
              key={index}
              onClick={() => competenciaIniciada && deportista && !terminado && registrarLlegada(index)}
              style={{
                background: 'white',
                borderRadius: '16px',
                padding: '24px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                border: terminado ? '3px solid #4caf50' : deportista ? '3px solid #1976d2' : '3px solid #e0e0e0',
                cursor: competenciaIniciada && deportista && !terminado ? 'pointer' : 'default',
                transition: 'all 0.2s',
                position: 'relative'
              }}
            >
              {/* Número de carril */}
              <div style={{
                position: 'absolute',
                top: '-12px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: deportista ? '#1976d2' : '#9e9e9e',
                color: 'white',
                width: '32px',
                height: '32px',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontWeight: '700',
                fontSize: '16px'
              }}>
                {index + 1}
              </div>

              <div style={{ textAlign: 'center', marginTop: '8px' }}>
                <div style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>
                  CARRIL {index + 1}
                </div>

                {deportista ? (
                  <>
                    <div style={{
                      width: '60px',
                      height: '60px',
                      background: terminado 
                        ? 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)'
                        : 'linear-gradient(135deg, #1e3a5f 0%, #4fc3f7 100%)',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      margin: '0 auto 12px',
                      color: 'white',
                      fontWeight: '700',
                      fontSize: '20px'
                    }}>
                      {terminado ? '✓' : `${deportista.nombre[0]}${deportista.apellido[0]}`}
                    </div>
                    <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                      {deportista.nombre} {deportista.apellido}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666', marginBottom: '12px' }}>
                      {deportista.club}
                    </div>
                    
                    {/* Tiempo */}
                    <div style={{
                      background: terminado ? '#e8f5e9' : '#f5f5f5',
                      padding: '12px',
                      borderRadius: '8px',
                      fontFamily: 'monospace',
                      fontSize: '24px',
                      fontWeight: '700',
                      color: terminado ? '#2e7d32' : '#333'
                    }}>
                      {formatTime(tiempoCarril)}
                    </div>

                    {competenciaIniciada && !terminado && (
                      <div style={{
                        marginTop: '12px',
                        padding: '8px',
                        background: '#fff3e0',
                        borderRadius: '6px',
                        fontSize: '12px',
                        color: '#e65100'
                      }}>
                        👆 Toque para registrar llegada
                      </div>
                    )}
                  </>
                ) : (
                  <div style={{
                    padding: '40px 20px',
                    color: '#999'
                  }}>
                    <span style={{ fontSize: '32px', display: 'block', marginBottom: '8px' }}>👤</span>
                    Carril vacío
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Indicador de bocina */}
      {competenciaIniciada && (
        <div style={{
          position: 'fixed',
          bottom: '32px',
          right: '32px',
          background: 'linear-gradient(135deg, #2e7d32 0%, #4caf50 100%)',
          color: 'white',
          padding: '16px 24px',
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          animation: 'pulse 2s infinite'
        }}>
          <span style={{ fontSize: '24px' }}>🔔</span>
          <span style={{ fontWeight: '600' }}>¡Competencia en curso!</span>
        </div>
      )}
    </div>
  );
};

// ==================== PÁGINA DE RESULTADOS ====================
const ResultadosPage = ({ historialResultados }) => {
  const [competenciaSeleccionada, setCompetenciaSeleccionada] = useState(null);

  const formatTime = (ms) => {
    if (ms === undefined) return '--:--.--';
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    const centiseconds = Math.floor((ms % 1000) / 10);
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}.${centiseconds.toString().padStart(2, '0')}`;
  };

  const getMedalColor = (posicion) => {
    switch(posicion) {
      case 1: return '#FFD700';
      case 2: return '#C0C0C0';
      case 3: return '#CD7F32';
      default: return '#e0e0e0';
    }
  };

  const getMedalEmoji = (posicion) => {
    switch(posicion) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return '';
    }
  };

  return (
    <div style={{ padding: '32px', maxWidth: '1200px', margin: '0 auto' }}>
      <div style={{ marginBottom: '32px' }}>
        <h2 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '28px' }}>
          🏆 Resultados de Competencias
        </h2>
        <p style={{ margin: 0, color: '#666' }}>
          Historial completo de todas las competencias realizadas
        </p>
      </div>

      {historialResultados.length === 0 ? (
        <div style={{
          background: 'white',
          borderRadius: '16px',
          padding: '60px',
          textAlign: 'center',
          boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
        }}>
          <span style={{ fontSize: '64px', display: 'block', marginBottom: '20px' }}>📊</span>
          <h3 style={{ color: '#333', margin: '0 0 12px' }}>No hay resultados registrados</h3>
          <p style={{ color: '#666' }}>Los resultados aparecerán aquí después de finalizar una competencia</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
          {/* Lista de competencias */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '24px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            <h3 style={{ margin: '0 0 20px', color: '#333', fontSize: '18px' }}>
              Competencias Realizadas
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {historialResultados.map(comp => (
                <button
                  key={comp.id}
                  onClick={() => setCompetenciaSeleccionada(comp)}
                  style={{
                    padding: '16px',
                    border: competenciaSeleccionada?.id === comp.id ? '2px solid #1976d2' : '2px solid #e0e0e0',
                    borderRadius: '12px',
                    background: competenciaSeleccionada?.id === comp.id ? '#e3f2fd' : 'white',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontWeight: '600', color: '#333', marginBottom: '4px' }}>
                    {comp.prueba}
                  </div>
                  <div style={{ fontSize: '13px', color: '#666' }}>
                    {comp.categoria} • {comp.fecha}
                  </div>
                  <div style={{ fontSize: '12px', color: '#999' }}>
                    {comp.hora} • {comp.resultados.length} participantes
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Detalle de resultados */}
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
          }}>
            {competenciaSeleccionada ? (
              <>
                <div style={{ marginBottom: '24px' }}>
                  <h3 style={{ margin: '0 0 8px', color: '#1e3a5f', fontSize: '24px' }}>
                    {competenciaSeleccionada.prueba}
                  </h3>
                  <p style={{ margin: 0, color: '#666' }}>
                    {competenciaSeleccionada.categoria} • {competenciaSeleccionada.fecha} {competenciaSeleccionada.hora}
                  </p>
                </div>

                {/* Podio */}
                <div style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'flex-end',
                  gap: '16px',
                  marginBottom: '32px',
                  padding: '24px',
                  background: '#f8f9fa',
                  borderRadius: '12px'
                }}>
                  {/* Segundo lugar */}
                  {competenciaSeleccionada.resultados[1] && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '40px', marginBottom: '8px' }}>🥈</div>
                      <div style={{
                        background: '#C0C0C0',
                        padding: '20px',
                        borderRadius: '8px 8px 0 0',
                        minWidth: '120px',
                        height: '80px'
                      }}>
                        <div style={{ color: 'white', fontWeight: '700', fontSize: '14px' }}>
                          {competenciaSeleccionada.resultados[1].deportista.nombre}
                        </div>
                        <div style={{ color: 'white', fontSize: '18px', fontFamily: 'monospace' }}>
                          {formatTime(competenciaSeleccionada.resultados[1].tiempo)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Primer lugar */}
                  {competenciaSeleccionada.resultados[0] && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '48px', marginBottom: '8px' }}>🥇</div>
                      <div style={{
                        background: '#FFD700',
                        padding: '20px',
                        borderRadius: '8px 8px 0 0',
                        minWidth: '140px',
                        height: '100px'
                      }}>
                        <div style={{ color: '#333', fontWeight: '700', fontSize: '16px' }}>
                          {competenciaSeleccionada.resultados[0].deportista.nombre}
                        </div>
                        <div style={{ color: '#333', fontSize: '20px', fontFamily: 'monospace', fontWeight: '700' }}>
                          {formatTime(competenciaSeleccionada.resultados[0].tiempo)}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tercer lugar */}
                  {competenciaSeleccionada.resultados[2] && (
                    <div style={{ textAlign: 'center' }}>
                      <div style={{ fontSize: '36px', marginBottom: '8px' }}>🥉</div>
                      <div style={{
                        background: '#CD7F32',
                        padding: '20px',
                        borderRadius: '8px 8px 0 0',
                        minWidth: '110px',
                        height: '60px'
                      }}>
                        <div style={{ color: 'white', fontWeight: '700', fontSize: '13px' }}>
                          {competenciaSeleccionada.resultados[2].deportista.nombre}
                        </div>
                        <div style={{ color: 'white', fontSize: '16px', fontFamily: 'monospace' }}>
                          {formatTime(competenciaSeleccionada.resultados[2].tiempo)}
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Tabla completa de resultados */}
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e0e0e0' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '600' }}>Pos</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '600' }}>Deportista</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#666', fontWeight: '600' }}>Club</th>
                      <th style={{ padding: '12px', textAlign: 'center', color: '#666', fontWeight: '600' }}>Carril</th>
                      <th style={{ padding: '12px', textAlign: 'right', color: '#666', fontWeight: '600' }}>Tiempo</th>
                    </tr>
                  </thead>
                  <tbody>
                    {competenciaSeleccionada.resultados.map((resultado) => (
                      <tr 
                        key={resultado.carril}
                        style={{ 
                          borderBottom: '1px solid #f0f0f0',
                          background: resultado.posicion <= 3 ? `${getMedalColor(resultado.posicion)}15` : 'transparent'
                        }}
                      >
                        <td style={{ padding: '16px 12px' }}>
                          <span style={{ fontSize: '20px' }}>{getMedalEmoji(resultado.posicion)}</span>
                          <span style={{ 
                            fontWeight: '700', 
                            color: resultado.posicion <= 3 ? getMedalColor(resultado.posicion) : '#333',
                            marginLeft: resultado.posicion <= 3 ? '0' : '0'
                          }}>
                            {resultado.posicion <= 3 ? '' : resultado.posicion}
                          </span>
                        </td>
                        <td style={{ padding: '16px 12px' }}>
                          <div style={{ fontWeight: '600', color: '#333' }}>
                            {resultado.deportista.nombre} {resultado.deportista.apellido}
                          </div>
                          <div style={{ fontSize: '12px', color: '#999', fontFamily: 'monospace' }}>
                            {resultado.deportista.rfid}
                          </div>
                        </td>
                        <td style={{ padding: '16px 12px', color: '#666' }}>
                          {resultado.deportista.club}
                        </td>
                        <td style={{ padding: '16px 12px', textAlign: 'center', color: '#666' }}>
                          {resultado.carril}
                        </td>
                        <td style={{ 
                          padding: '16px 12px', 
                          textAlign: 'right',
                          fontFamily: 'monospace',
                          fontSize: '18px',
                          fontWeight: '600',
                          color: resultado.posicion === 1 ? '#2e7d32' : '#333'
                        }}>
                          {formatTime(resultado.tiempo)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Botón de exportar */}
                <div style={{ marginTop: '24px', display: 'flex', gap: '12px' }}>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5a87 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📄 Exportar PDF
                  </button>
                  <button
                    style={{
                      padding: '12px 24px',
                      background: 'white',
                      color: '#1e3a5f',
                      border: '2px solid #1e3a5f',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    📊 Exportar Excel
                  </button>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '60px', color: '#999' }}>
                <span style={{ fontSize: '48px', display: 'block', marginBottom: '16px' }}>👈</span>
                Seleccione una competencia para ver los resultados
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

// ==================== COMPONENTE PRINCIPAL ====================
export default function App() {
  const [currentPage, setCurrentPage] = useState('login');
  const [user, setUser] = useState(null);
  const [deportistas, setDeportistas] = useState([
    { id: 1, nombre: 'Carlos', apellido: 'González', edad: 22, categoria: 'Senior', club: 'Club Acuático Santiago', rut: '18.456.789-0', rfid: 'RFID-ABC123DEF', fechaRegistro: '01/12/2025' },
    { id: 2, nombre: 'María', apellido: 'Fernández', edad: 19, categoria: 'Senior', club: 'Club Naval Valparaíso', rut: '19.567.890-1', rfid: 'RFID-GHI456JKL', fechaRegistro: '01/12/2025' },
    { id: 3, nombre: 'Pedro', apellido: 'Muñoz', edad: 24, categoria: 'Senior', club: 'Club Deportivo Concepción', rut: '17.345.678-2', rfid: 'RFID-MNO789PQR', fechaRegistro: '01/12/2025' },
    { id: 4, nombre: 'Ana', apellido: 'López', edad: 21, categoria: 'Senior', club: 'Club La Serena', rut: '20.678.901-3', rfid: 'RFID-STU012VWX', fechaRegistro: '01/12/2025' },
    { id: 5, nombre: 'Diego', apellido: 'Soto', edad: 16, categoria: 'Juvenil', club: 'Club Acuático Santiago', rut: '21.789.012-4', rfid: 'RFID-YZA345BCD', fechaRegistro: '01/12/2025' },
    { id: 6, nombre: 'Sofía', apellido: 'Ramírez', edad: 17, categoria: 'Juvenil', club: 'Club Naval Valparaíso', rut: '22.890.123-5', rfid: 'RFID-EFG678HIJ', fechaRegistro: '01/12/2025' },
  ]);
  const [competenciaActual, setCompetenciaActual] = useState(null);
  const [historialResultados, setHistorialResultados] = useState([]);

  // Renderizar página actual
  const renderPage = () => {
    switch(currentPage) {
      case 'login':
        return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
      case 'registro':
        return <RegistroDeportistaPage deportistas={deportistas} setDeportistas={setDeportistas} />;
      case 'competencia':
        return <CompetenciaPage deportistas={deportistas} setDeportistas={setDeportistas} setCurrentPage={setCurrentPage} setCompetenciaActual={setCompetenciaActual} />;
      case 'dashboard':
        return <DashboardPage competenciaActual={competenciaActual} setCompetenciaActual={setCompetenciaActual} setHistorialResultados={setHistorialResultados} />;
      case 'resultados':
        return <ResultadosPage historialResultados={historialResultados} />;
      default:
        return <LoginPage setCurrentPage={setCurrentPage} setUser={setUser} />;
    }
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f5f7fa',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      {currentPage !== 'login' && (
        <Navbar currentPage={currentPage} setCurrentPage={setCurrentPage} user={user} />
      )}
      {renderPage()}
      
      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.5; }
        }
        
        input:focus, select:focus, button:focus {
          outline: none;
          border-color: #1976d2;
        }
        
        button:hover {
          transform: translateY(-1px);
        }
        
        button:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
}
