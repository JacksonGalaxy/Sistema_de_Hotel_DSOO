'use client';

import { useTiposClientes, TipoCliente } from '@/hooks/useTiposClientes';

const badgeTipo = (tipo: TipoCliente) => {
  const estilos: Record<TipoCliente, string> = {
    ESTANDAR: 'bg-slate-100 text-slate-600',
    PREMIUM:  'bg-amber-100 text-amber-700',
    VIP:      'bg-purple-100 text-purple-700',
  };
  return estilos[tipo];
};

const badgeEstadoMem = (estado: string) => {
  const estilos: Record<string, string> = {
    ACTIVA:    'bg-green-100 text-green-700',
    VENCIDA:   'bg-red-100 text-red-600',
    CANCELADA: 'bg-slate-100 text-slate-500',
  };
  return estilos[estado] ?? 'bg-slate-100 text-slate-500';
};

export default function TiposClientes() {
  const {
    clientes,
    beneficios,
    auditoria,
    tarifas,
    vistaActiva,
    setVistaActiva,
    mensaje,
    formRegistrar,
    formMembresia,
    costoPreview,
    clienteMembresia,
    handleChangeRegistrar,
    handleSubmitRegistrar,
    handleChangeMembresia,
    handleSubmitMembresia,
    verificarExpiraciones,
    getBeneficiosPorTipo,
  } = useTiposClientes();

  const pestañas = [
    ['lista',      'Clientes'],
    ['registrar',  'Registrar'],
    ['membresia',  'Membresía'],
    ['beneficios', 'Beneficios'],
    ['auditoria',  'Auditoría'],
  ] as const;

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* ── Encabezado ────────────────────────────────────────── */}
        <div className="bg-slate-900 rounded-xl px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-amber-500">
              Tipos de Clientes
            </h1>
            <p className="mt-1 text-slate-300 text-sm">
              Registro, membresías y beneficios por nivel de cliente.
            </p>
          </div>
          {/* UC-11: botón de verificación de expiración */}
          <button
            onClick={verificarExpiraciones}
            className="bg-amber-500 text-slate-900 font-bold px-5 py-2 rounded-lg hover:bg-amber-400 transition text-sm whitespace-nowrap"
          >
            ⟳ Verificar Expiraciones (UC-11)
          </button>
        </div>

        {/* ── Mensaje de feedback ───────────────────────────────── */}
        {mensaje && (
          <div className={`mb-4 px-5 py-3 rounded-lg text-sm font-medium border-l-4 ${
            mensaje.tipo === 'exito'
              ? 'bg-green-50 border-green-500 text-green-800'
              : 'bg-red-50 border-red-500 text-red-800'
          }`}>
            {mensaje.texto}
          </div>
        )}

        {/* ── Pestañas ──────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {pestañas.map(([v, label]) => (
            <button
              key={v}
              onClick={() => setVistaActiva(v)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                vistaActiva === v
                  ? 'bg-slate-900 text-amber-500'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* ════════════════════════════════════════════════════════
            VISTA: LISTA DE CLIENTES
        ════════════════════════════════════════════════════════ */}
        {vistaActiva === 'lista' && (
          <div className="space-y-4">

            {/* Tarjetas de resumen */}
            <div className="grid grid-cols-3 gap-3 mb-2">
              {(['ESTANDAR', 'PREMIUM', 'VIP'] as TipoCliente[]).map(tipo => (
                <div key={tipo} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-100 text-center">
                  <p className="text-xs text-slate-500 mb-1">{tipo}</p>
                  <p className={`text-2xl font-bold ${
                    tipo === 'ESTANDAR' ? 'text-slate-700' :
                    tipo === 'PREMIUM'  ? 'text-amber-600' : 'text-purple-600'
                  }`}>
                    {clientes.filter(c => c.tipo_cliente === tipo).length}
                  </p>
                </div>
              ))}
            </div>

            {/* Tabla de clientes */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-slate-800">Clientes Registrados</h2>
                  <p className="text-xs text-slate-500 mt-0.5">{clientes.length} clientes en total</p>
                </div>
                <button
                  onClick={() => setVistaActiva('registrar')}
                  className="text-sm bg-slate-900 text-amber-500 px-4 py-2 rounded-lg hover:bg-slate-800 transition font-medium"
                >
                  + Registrar
                </button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">N° Cliente</th>
                      <th className="px-5 py-3 text-left">Nombre</th>
                      <th className="px-5 py-3 text-left">Correo</th>
                      <th className="px-5 py-3 text-left">Tipo</th>
                      <th className="px-5 py-3 text-left">Membresía</th>
                      <th className="px-5 py-3 text-left">Vence</th>
                      <th className="px-5 py-3 text-left">Registro</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {clientes.map(c => (
                      <tr key={c.id_cliente} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-mono text-xs text-slate-600">{c.numero_cliente}</td>
                        <td className="px-5 py-3 font-medium text-slate-800">{c.nombre_completo}</td>
                        <td className="px-5 py-3 text-slate-600 text-xs">{c.correo_electronico}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeTipo(c.tipo_cliente)}`}>
                            {c.tipo_cliente}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {c.membresia ? (
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeEstadoMem(c.membresia.estado)}`}>
                              {c.membresia.estado} · {c.membresia.plan_meses}m
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">Sin membresía</span>
                          )}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">
                          {c.membresia?.fecha_fin ?? '—'}
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500">{c.fecha_registro}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VISTA: REGISTRAR CLIENTE — UC-09
        ════════════════════════════════════════════════════════ */}
        {vistaActiva === 'registrar' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-8 py-5">
              <h2 className="text-xl font-serif font-bold text-amber-500">Registrar Nuevo Cliente</h2>
              <p className="mt-1 text-slate-300 text-xs">
                UC-09 · El cliente se registra automáticamente como tipo ESTÁNDAR.
              </p>
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmitRegistrar}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre_completo"
                      value={formRegistrar.nombre_completo}
                      onChange={handleChangeRegistrar}
                      placeholder="Ej. María González"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correo_electronico"
                      value={formRegistrar.correo_electronico}
                      onChange={handleChangeRegistrar}
                      placeholder="cliente@email.com"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Teléfono <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="tel"
                      name="telefono"
                      value={formRegistrar.telefono}
                      onChange={handleChangeRegistrar}
                      placeholder="555-0000"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Documento de Identificación <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="documento_identificacion"
                      value={formRegistrar.documento_identificacion}
                      onChange={handleChangeRegistrar}
                      placeholder="DOC-00000"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Dirección <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="direccion"
                      value={formRegistrar.direccion}
                      onChange={handleChangeRegistrar}
                      placeholder="Calle, número, colonia, ciudad"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>
                </div>

                {/* Aviso tipo inicial */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <p className="text-sm text-amber-700">
                    <strong>UC-09:</strong> Todo cliente nuevo se registra como tipo <strong>ESTÁNDAR</strong> de manera automática.
                    Para activar una membresía Premium o VIP, use la sección <em>Membresía</em>.
                  </p>
                </div>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-amber-500 font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition shadow-md"
                  >
                    Registrar Cliente
                  </button>
                  <button
                    type="button"
                    onClick={() => setVistaActiva('lista')}
                    className="px-6 py-3 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50 transition text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VISTA: ACTIVAR MEMBRESÍA — UC-10
        ════════════════════════════════════════════════════════ */}
        {vistaActiva === 'membresia' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-8 py-5">
              <h2 className="text-xl font-serif font-bold text-amber-500">Activar / Extender Membresía</h2>
              <p className="mt-1 text-slate-300 text-xs">
                UC-10 · Si el cliente ya tiene una membresía activa, se extenderá con el nuevo plan.
              </p>
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmitMembresia}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Selección de cliente */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="id_cliente"
                      value={formMembresia.id_cliente}
                      onChange={handleChangeMembresia}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione un cliente...</option>
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nombre_completo} — {c.tipo_cliente} ({c.numero_cliente})
                          {c.membresia?.estado === 'ACTIVA' ? ' · Membresía activa hasta ' + c.membresia.fecha_fin : ''}
                        </option>
                      ))}
                    </select>

                    {/* Estado actual de membresía del cliente */}
                    {clienteMembresia && (
                      <div className={`mt-2 px-4 py-2 rounded-lg text-xs font-medium flex items-center gap-2 ${
                        clienteMembresia.membresia?.estado === 'ACTIVA'
                          ? 'bg-amber-50 text-amber-700 border border-amber-200'
                          : clienteMembresia.membresia?.estado === 'VENCIDA'
                          ? 'bg-red-50 text-red-600 border border-red-200'
                          : 'bg-green-50 text-green-700 border border-green-200'
                      }`}>
                        {clienteMembresia.membresia?.estado === 'ACTIVA'
                          ? `⚠ Membresía activa (${clienteMembresia.membresia.plan_meses} meses) — vence ${clienteMembresia.membresia.fecha_fin}. Se extenderá.`
                          : clienteMembresia.membresia?.estado === 'VENCIDA'
                          ? `✗ Membresía vencida el ${clienteMembresia.membresia.fecha_fin}. Se activará una nueva.`
                          : '✓ Sin membresía activa. Se creará una nueva.'}
                      </div>
                    )}
                  </div>

                  {/* Tipo de membresía */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de Membresía <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo_membresia"
                      value={formMembresia.tipo_membresia}
                      onChange={handleChangeMembresia}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione tipo...</option>
                      <option value="PREMIUM">Premium</option>
                      <option value="VIP">VIP</option>
                    </select>
                  </div>

                  {/* Plan en meses */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Plan <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="plan_meses"
                      value={formMembresia.plan_meses}
                      onChange={handleChangeMembresia}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione plan...</option>
                      <option value={3}>3 meses</option>
                      <option value={6}>6 meses</option>
                      <option value={12}>12 meses</option>
                    </select>
                  </div>

                  {/* Tipo de pago */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de Pago <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo_pago"
                      value={formMembresia.tipo_pago}
                      onChange={handleChangeMembresia}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione tipo de pago...</option>
                      <option value="EFECTIVO">Efectivo</option>
                      <option value="TARJETA_CREDITO">Tarjeta de Crédito</option>
                      <option value="TARJETA_DEBITO">Tarjeta de Débito</option>
                      <option value="TRANSFERENCIA">Transferencia</option>
                    </select>
                  </div>
                </div>

                {/* Preview del costo */}
                {costoPreview !== null && formMembresia.tipo_membresia && formMembresia.plan_meses && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5">
                    <h3 className="text-sm font-bold text-amber-800 mb-3">💳 Resumen del Plan</h3>
                    <div className="grid grid-cols-3 gap-3 text-center">
                      <div>
                        <p className="text-xs text-amber-700">Tipo</p>
                        <p className="text-lg font-bold text-slate-800">{formMembresia.tipo_membresia}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-700">Duración</p>
                        <p className="text-lg font-bold text-slate-800">{formMembresia.plan_meses} meses</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-700">Costo Total</p>
                        <p className="text-lg font-bold text-green-700">${costoPreview.toLocaleString()}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Tabla de tarifas referencia */}
                <details className="border border-slate-200 rounded-lg">
                  <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 rounded-lg">
                    📊 Ver tabla de tarifas
                  </summary>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-sm text-center">
                      <thead className="bg-slate-50 text-slate-600 text-xs uppercase">
                        <tr>
                          <th className="px-4 py-2 text-left">Plan</th>
                          <th className="px-4 py-2 text-amber-600">Premium</th>
                          <th className="px-4 py-2 text-purple-600">VIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {([3, 6, 12] as const).map(m => (
                          <tr key={m} className="hover:bg-slate-50">
                            <td className="px-4 py-2 text-left font-medium text-slate-700">{m} meses</td>
                            <td className="px-4 py-2 text-amber-600 font-semibold">${tarifas.PREMIUM[m].toLocaleString()}</td>
                            <td className="px-4 py-2 text-purple-600 font-semibold">${tarifas.VIP[m].toLocaleString()}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>

                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-amber-500 font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition shadow-md"
                  >
                    Activar Membresía
                  </button>
                  <button
                    type="button"
                    onClick={() => setVistaActiva('lista')}
                    className="px-6 py-3 border border-slate-300 text-slate-600 rounded-md hover:bg-slate-50 transition text-sm font-medium"
                  >
                    Cancelar
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VISTA: BENEFICIOS — UC-12
        ════════════════════════════════════════════════════════ */}
        {vistaActiva === 'beneficios' && (
          <div className="space-y-4">
            <div className="bg-white rounded-xl shadow-lg px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Beneficios por Tipo de Cliente</h2>
              <p className="text-xs text-slate-500 mt-0.5">UC-12 · Tabla comparativa de privilegios según nivel.</p>
            </div>

            {/* Tarjetas de beneficios */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(['ESTANDAR', 'PREMIUM', 'VIP'] as TipoCliente[]).map(tipo => {
                const b = getBeneficiosPorTipo(tipo);
                if (!b) return null;
                const colores: Record<TipoCliente, { borde: string; titulo: string; badge: string }> = {
                  ESTANDAR: { borde: 'border-slate-300',  titulo: 'text-slate-700',  badge: 'bg-slate-100 text-slate-600'  },
                  PREMIUM:  { borde: 'border-amber-400',  titulo: 'text-amber-700',  badge: 'bg-amber-100 text-amber-700'  },
                  VIP:      { borde: 'border-purple-400', titulo: 'text-purple-700', badge: 'bg-purple-100 text-purple-700' },
                };
                const col = colores[tipo];
                return (
                  <div key={tipo} className={`bg-white rounded-xl shadow-md border-t-4 ${col.borde} p-6 space-y-4`}>
                    <div className="flex items-center justify-between">
                      <h3 className={`text-xl font-bold ${col.titulo}`}>{tipo}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full font-semibold ${col.badge}`}>
                        {clientes.filter(c => c.tipo_cliente === tipo).length} clientes
                      </span>
                    </div>
                    <p className="text-xs text-slate-500">{b.descripcion}</p>

                    <div className="space-y-3 text-sm">
                      <div className="flex items-start gap-2">
                        <span className={b.acceso_villas ? 'text-green-500' : 'text-red-400'}>
                          {b.acceso_villas ? '✓' : '✗'}
                        </span>
                        <span className="text-slate-700">
                          <strong>Villas:</strong> {b.acceso_villas ? 'Acceso permitido' : 'Sin acceso'}
                        </span>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-amber-500">★</span>
                        <div>
                          <strong className="text-slate-700">Amenidades:</strong>
                          <p className="text-xs text-slate-500 mt-0.5">{b.tipo_amenidades}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-blue-500">⬆</span>
                        <div>
                          <strong className="text-slate-700">Prioridad:</strong>
                          <p className="text-xs text-slate-500 mt-0.5">{b.prioridad_reserva}</p>
                        </div>
                      </div>

                      <div className="flex items-start gap-2">
                        <span className="text-slate-500">⊘</span>
                        <div>
                          <strong className="text-slate-700">Cancelación:</strong>
                          <p className="text-xs text-slate-500 mt-0.5">{b.politica_cancelacion}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Tabla comparativa rápida */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-semibold text-slate-800">Comparativa rápida</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-center">
                  <thead className="bg-slate-50 text-slate-600 text-xs uppercase tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Beneficio</th>
                      <th className="px-5 py-3">Estándar</th>
                      <th className="px-5 py-3 text-amber-600">Premium</th>
                      <th className="px-5 py-3 text-purple-600">VIP</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {[
                      ['Acceso a Villas',           '✗', '✓', '✓'],
                      ['Amenidades',                'Básicas', 'Extendidas', 'Sin límite'],
                      ['Prioridad de Reserva',      'Normal', 'Media', 'Alta'],
                      ['Cancelación sin cargo',     'Hasta 48h antes', 'Hasta 24h antes', 'Hasta check-in'],
                      ['Penalización al cancelar',  '50% (<48h)', '30% (<24h)', 'Sin cargo'],
                      ['Upgrade temporal',          '100%', 'Hasta 110%', 'Hasta 140%'],
                    ].map(([beneficio, est, pre, vip]) => (
                      <tr key={beneficio} className="hover:bg-slate-50">
                        <td className="px-5 py-3 text-left font-medium text-slate-700">{beneficio}</td>
                        <td className="px-5 py-3 text-slate-500">{est}</td>
                        <td className="px-5 py-3 text-amber-600 font-medium">{pre}</td>
                        <td className="px-5 py-3 text-purple-600 font-medium">{vip}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ════════════════════════════════════════════════════════
            VISTA: AUDITORÍA
        ════════════════════════════════════════════════════════ */}
        {vistaActiva === 'auditoria' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-slate-800">Bitácora de Auditoría</h2>
                <p className="text-xs text-slate-500 mt-0.5">Registro de acciones sobre clientes y membresías.</p>
              </div>
              <span className="text-xs bg-slate-100 text-slate-600 px-3 py-1 rounded-full font-medium">
                {auditoria.length} registros
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Fecha / Hora</th>
                    <th className="px-5 py-3 text-left">Acción</th>
                    <th className="px-5 py-3 text-left">Descripción</th>
                    <th className="px-5 py-3 text-left">ID</th>
                    <th className="px-5 py-3 text-left">IP Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditoria.map(reg => {
                    const accionColor: Record<string, string> = {
                      REGISTRAR_CLIENTE:   'bg-green-100 text-green-700',
                      ACTIVAR_MEMBRESIA:   'bg-blue-100 text-blue-700',
                      EXTENDER_MEMBRESIA:  'bg-indigo-100 text-indigo-700',
                      EXPIRACION_MEMBRESIA:'bg-red-100 text-red-600',
                    };
                    return (
                      <tr key={reg.id_registro} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 text-slate-600 whitespace-nowrap text-xs">{reg.fecha_hora}</td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${accionColor[reg.accion] ?? 'bg-slate-100 text-slate-600'}`}>
                            {reg.accion}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-700 text-xs">{reg.descripcion}</td>
                        <td className="px-5 py-3 text-slate-500 text-xs">{reg.id_entidad}</td>
                        <td className="px-5 py-3 text-slate-500 font-mono text-xs">{reg.ip_origen}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}