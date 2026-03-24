'use client';

import { useReservasAlojamiento } from '@/hooks/useReservasAlojamiento';
import { TipoCliente, ReservaAlojamiento } from '@/hooks/useReservasAlojamiento';

// ─── Badge helpers ────────────────────────────────────────────────
const badgeEstadoReserva = (estado: string) => {
  const estilos: Record<string, string> = {
    CONFIRMADA: 'bg-green-100 text-green-700',
    PENDIENTE:  'bg-yellow-100 text-yellow-700',
    CANCELADA:  'bg-red-100 text-red-600',
    COMPLETADA: 'bg-slate-100 text-slate-600',
  };
  return estilos[estado] ?? 'bg-slate-100 text-slate-500';
};

const badgeTipoCliente = (tipo: TipoCliente) => {
  const estilos: Record<TipoCliente, string> = {
    ESTANDAR: 'bg-slate-100 text-slate-600',
    PREMIUM:  'bg-amber-100 text-amber-700',
    VIP:      'bg-purple-100 text-purple-700',
  };
  return estilos[tipo];
};

const etiquetaTipo = (tipo: string) =>
  tipo.replace('HABITACION_', 'HAB. ').replace('_', ' ');

export default function ReservasAlojamiento() {
  const {
    reservas,
    alojamientos,
    clientes,
    reglasUpgrade,
    vistaActiva,
    setVistaActiva,
    reservaSeleccionada,
    setReservaSeleccionada,
    mensaje,
    formCrear,
    preview,
    handleChangeCrear,
    handleSubmitCrear,
    cancelarReserva,
    getNombreCliente,
    getTipoCliente,
    getNumeroUnidad,
    getTipoAlojamiento,
    alojamientosDisponibles,
    clienteSeleccionado,
  } = useReservasAlojamiento();

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-6xl mx-auto">

        {/* ── Encabezado ───────────────────────────────────────── */}
        <div className="bg-slate-900 rounded-xl px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-amber-500">
              Reservas de Alojamiento
            </h1>
            <p className="mt-1 text-slate-300 text-sm">
              Gestión de reservas con upgrade temporal y políticas por tipo de cliente.
            </p>
          </div>
          <button
            onClick={() => { setVistaActiva('crear'); setReservaSeleccionada(null); }}
            className="bg-amber-500 text-slate-900 font-bold px-5 py-2 rounded-lg hover:bg-amber-400 transition text-sm whitespace-nowrap"
          >
            + Nueva Reserva
          </button>
        </div>

        {/* ── Mensaje de feedback ──────────────────────────────── */}
        {mensaje && (
          <div
            className={`mb-4 px-5 py-3 rounded-lg text-sm font-medium border-l-4 ${
              mensaje.tipo === 'exito'
                ? 'bg-green-50 border-green-500 text-green-800'
                : 'bg-red-50 border-red-500 text-red-800'
            }`}
          >
            {mensaje.texto}
          </div>
        )}

        {/* ── Pestañas ─────────────────────────────────────────── */}
        <div className="flex flex-wrap gap-2 mb-6">
          {([
            ['lista',     'Reservas'],
            ['crear',     'Nueva Reserva'],
            ['detalle',   'Alojamientos'],
          ] as const).map(([v, label]) => (
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

        {/* ══════════════════════════════════════════════════════
            VISTA: LISTA DE RESERVAS — UC-08 Cancelar
        ══════════════════════════════════════════════════════ */}
        {vistaActiva === 'lista' && (
          <div className="space-y-4">

            {/* Resumen rápido */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-2">
              {(
                [
                  ['Confirmadas', reservas.filter(r => r.estado === 'CONFIRMADA').length,  'text-green-600'],
                  ['Pendientes',  reservas.filter(r => r.estado === 'PENDIENTE').length,   'text-yellow-600'],
                  ['Canceladas',  reservas.filter(r => r.estado === 'CANCELADA').length,   'text-red-600'],
                  ['Completadas', reservas.filter(r => r.estado === 'COMPLETADA').length,  'text-slate-600'],
                ] as [string, number, string][]
              ).map(([label, count, color]) => (
                <div key={label} className="bg-white rounded-lg px-4 py-3 shadow-sm border border-slate-100">
                  <p className="text-xs text-slate-500">{label}</p>
                  <p className={`text-2xl font-bold ${color}`}>{count}</p>
                </div>
              ))}
            </div>

            {/* Tabla de reservas */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h2 className="text-lg font-semibold text-slate-800">Todas las Reservas</h2>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                    <tr>
                      <th className="px-5 py-3 text-left">Código</th>
                      <th className="px-5 py-3 text-left">Cliente</th>
                      <th className="px-5 py-3 text-left">Unidad</th>
                      <th className="px-5 py-3 text-left">Check-in</th>
                      <th className="px-5 py-3 text-left">Check-out</th>
                      <th className="px-5 py-3 text-left">Noches</th>
                      <th className="px-5 py-3 text-left">Upgrade</th>
                      <th className="px-5 py-3 text-left">Costo Total</th>
                      <th className="px-5 py-3 text-left">Estado</th>
                      <th className="px-5 py-3 text-left">Acción</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {reservas.map(r => (
                      <tr key={r.id_reserva} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-mono text-xs text-slate-700">{r.codigo_confirmacion}</td>
                        <td className="px-5 py-3">
                          <div className="font-medium text-slate-800">{getNombreCliente(r.id_cliente)}</div>
                          <span className={`text-xs px-1.5 py-0.5 rounded font-semibold ${badgeTipoCliente(getTipoCliente(r.id_cliente))}`}>
                            {getTipoCliente(r.id_cliente)}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-slate-700">
                          <div>{getNumeroUnidad(r.id_alojamiento)}</div>
                          <div className="text-xs text-slate-500">{etiquetaTipo(getTipoAlojamiento(r.id_alojamiento))}</div>
                        </td>
                        <td className="px-5 py-3 text-slate-600">{r.fecha_check_in}</td>
                        <td className="px-5 py-3 text-slate-600">{r.fecha_check_out}</td>
                        <td className="px-5 py-3 text-center text-slate-700 font-medium">{r.num_noches}</td>
                        <td className="px-5 py-3">
                          {r.porcentaje_upgrade !== 100 ? (
                            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded font-semibold">
                              {r.porcentaje_upgrade}%
                            </span>
                          ) : (
                            <span className="text-xs text-slate-400">—</span>
                          )}
                        </td>
                        <td className="px-5 py-3 font-semibold text-slate-800">
                          ${r.costo_total.toLocaleString()}
                          {r.monto_penalizacion > 0 && (
                            <div className="text-xs text-red-500 font-normal">
                              Pen. ${r.monto_penalizacion.toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${badgeEstadoReserva(r.estado)}`}>
                            {r.estado}
                          </span>
                        </td>
                        <td className="px-5 py-3">
                          {(r.estado === 'CONFIRMADA' || r.estado === 'PENDIENTE') ? (
                            <button
                              onClick={() => cancelarReserva(r.id_reserva)}
                              className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition font-medium"
                            >
                              Cancelar
                            </button>
                          ) : (
                            <span className="text-slate-400 text-xs">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════
            VISTA: CREAR RESERVA — UC-04, UC-05, UC-06, UC-07
        ══════════════════════════════════════════════════════ */}
        {vistaActiva === 'crear' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-8 py-5">
              <h2 className="text-xl font-serif font-bold text-amber-500">Nueva Reserva de Alojamiento</h2>
              <p className="mt-1 text-slate-300 text-xs">
                UC-04 · El upgrade se aplica automáticamente según tipo de cliente y número de noches.
              </p>
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmitCrear}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Cliente */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Cliente <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="id_cliente"
                      value={formCrear.id_cliente}
                      onChange={handleChangeCrear}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione un cliente...</option>
                      {clientes.map(c => (
                        <option key={c.id_cliente} value={c.id_cliente}>
                          {c.nombre_completo} — {c.tipo_cliente} ({c.numero_cliente})
                        </option>
                      ))}
                    </select>
                    {/* UC-05: aviso de restricción de villas */}
                    {clienteSeleccionado?.tipo_cliente === 'ESTANDAR' && (
                      <p className="mt-1 text-xs text-amber-600">
                        ⚠ Cliente Estándar: no puede reservar villas Premium.
                      </p>
                    )}
                  </div>

                  {/* Alojamiento (filtrado por UC-05) */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Alojamiento Disponible <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="id_alojamiento"
                      value={formCrear.id_alojamiento}
                      onChange={handleChangeCrear}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione un alojamiento...</option>
                      {alojamientosDisponibles(clienteSeleccionado?.tipo_cliente ?? null).map(a => (
                        <option key={a.id_alojamiento} value={a.id_alojamiento}>
                          {a.numero_unidad} — {etiquetaTipo(a.tipo)} · ${a.precio_base_noche.toLocaleString()}/noche
                          {a.tipo === 'VILLA_PREMIUM' ? ' · Mín. 2 noches' : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Fecha Check-in */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha Check-in <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fecha_check_in"
                      value={formCrear.fecha_check_in}
                      onChange={handleChangeCrear}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  {/* Fecha Check-out */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Fecha Check-out <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="fecha_check_out"
                      value={formCrear.fecha_check_out}
                      onChange={handleChangeCrear}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                    {/* UC-06: aviso estancia mínima */}
                    {preview?.esVilla && preview.numNoches < 2 && (
                      <p className="mt-1 text-xs text-red-500">
                        ✗ Las villas requieren mínimo 2 noches.
                      </p>
                    )}
                  </div>

                  {/* Tipo de pago */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Tipo de Pago <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="tipo_pago"
                      value={formCrear.tipo_pago}
                      onChange={handleChangeCrear}
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

                {/* ── UC-07: Preview de upgrade y costo ─────────── */}
                {preview && preview.numNoches > 0 && (
                  <div className="bg-amber-50 border border-amber-200 rounded-lg p-5 space-y-2">
                    <h3 className="text-sm font-bold text-amber-800 mb-3">
                      💰 Resumen de Costo — Upgrade Temporal (UC-07)
                    </h3>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
                      <div>
                        <p className="text-xs text-amber-700">Noches</p>
                        <p className="text-xl font-bold text-slate-800">{preview.numNoches}</p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-700">Precio base/noche</p>
                        <p className="text-xl font-bold text-slate-800">
                          ${preview.alojamiento?.precio_base_noche.toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-700">% Upgrade ({preview.tipoCliente})</p>
                        <p className={`text-xl font-bold ${preview.porcentaje !== 100 ? 'text-amber-600' : 'text-slate-800'}`}>
                          {preview.porcentaje}%
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-amber-700">Costo Total</p>
                        <p className="text-xl font-bold text-green-700">
                          ${preview.costoTotal.toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {preview.porcentaje !== 100 && (
                      <p className="text-xs text-amber-700 text-center pt-1">
                        * El upgrade temporal reduce el costo según su nivel de membresía y número de noches.
                      </p>
                    )}
                  </div>
                )}

                {/* ── Tabla de upgrades de referencia ─────────────── */}
                <details className="border border-slate-200 rounded-lg">
                  <summary className="px-4 py-3 text-sm font-medium text-slate-600 cursor-pointer hover:bg-slate-50 rounded-lg">
                    📊 Ver tabla de upgrades por noches (UC-07)
                  </summary>
                  <div className="overflow-x-auto p-4">
                    <table className="w-full text-xs text-center">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-3 py-2 text-left">Noches</th>
                          <th className="px-3 py-2">Estándar</th>
                          <th className="px-3 py-2 text-amber-600">Premium</th>
                          <th className="px-3 py-2 text-purple-600">VIP</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {reglasUpgrade.map(r => (
                          <tr key={r.id_regla} className="hover:bg-slate-50">
                            <td className="px-3 py-2 text-left font-medium text-slate-700">
                              {r.noches_hasta >= 999
                                ? `${r.noches_desde}+ noches`
                                : r.noches_desde === r.noches_hasta
                                ? `${r.noches_desde} noche${r.noches_desde > 1 ? 's' : ''}`
                                : `${r.noches_desde}–${r.noches_hasta} noches`}
                            </td>
                            <td className="px-3 py-2 text-slate-500">100%</td>
                            <td className="px-3 py-2 text-amber-600 font-semibold">{r.porcentaje_premium}%</td>
                            <td className="px-3 py-2 text-purple-600 font-semibold">{r.porcentaje_vip}%</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </details>

                {/* ── Notas de negocio ─────────────────────────────── */}
                <div className="bg-slate-50 border-l-4 border-slate-400 p-4 text-xs text-slate-600 space-y-1">
                  <p><strong>UC-05:</strong> Las villas solo son visibles para clientes Premium y VIP.</p>
                  <p><strong>UC-06:</strong> Las villas requieren una estancia mínima de 2 noches.</p>
                  <p><strong>UC-08 Cancelación:</strong> Estándar penalización 50% ({'<'}48h) · Premium 30% ({'<'}24h) · VIP sin cargo.</p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-amber-500 font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition shadow-md"
                  >
                    Confirmar Reserva
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

        {/* ══════════════════════════════════════════════════════
            VISTA: ALOJAMIENTOS — Estado del inventario
        ══════════════════════════════════════════════════════ */}
        {vistaActiva === 'detalle' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Inventario de Alojamientos</h2>
              <p className="text-xs text-slate-500 mt-0.5">Estado actual de todas las unidades.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-5 py-3 text-left">Unidad</th>
                    <th className="px-5 py-3 text-left">Tipo</th>
                    <th className="px-5 py-3 text-left">Precio/Noche</th>
                    <th className="px-5 py-3 text-left">Mín. Noches</th>
                    <th className="px-5 py-3 text-left">Acceso</th>
                    <th className="px-5 py-3 text-left">Estado</th>
                    <th className="px-5 py-3 text-left">Amenidades</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alojamientos.map(a => {
                    const estadoColor: Record<string, string> = {
                      DISPONIBLE:   'bg-green-100 text-green-700',
                      OCUPADA:      'bg-blue-100 text-blue-700',
                      SUCIA:        'bg-yellow-100 text-yellow-700',
                      EN_LIMPIEZA:  'bg-orange-100 text-orange-700',
                      MANTENIMIENTO:'bg-red-100 text-red-600',
                      INACTIVA:     'bg-slate-100 text-slate-500',
                    };
                    return (
                      <tr key={a.id_alojamiento} className="hover:bg-slate-50 transition">
                        <td className="px-5 py-3 font-bold text-slate-800">{a.numero_unidad}</td>
                        <td className="px-5 py-3 text-slate-700">{etiquetaTipo(a.tipo)}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">${a.precio_base_noche.toLocaleString()}</td>
                        <td className="px-5 py-3 text-center text-slate-600">{a.estancia_minima_noches}</td>
                        <td className="px-5 py-3">
                          {a.tipo === 'VILLA_PREMIUM' ? (
                            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2 py-0.5 rounded font-medium">
                              Premium / VIP
                            </span>
                          ) : (
                            <span className="text-xs text-slate-500">Todos</span>
                          )}
                        </td>
                        <td className="px-5 py-3">
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${estadoColor[a.estado] ?? ''}`}>
                            {a.estado}
                          </span>
                        </td>
                        <td className="px-5 py-3 text-xs text-slate-500 max-w-xs truncate">{a.amenidades_incluidas}</td>
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