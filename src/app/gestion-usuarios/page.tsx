'use client';

import { useGestionUsuarios } from '@/hooks/useGestionUsuarios';

export default function GestionUsuarios() {
  const {
    usuarios,
    roles,
    auditoria,
    vistaActiva,
    setVistaActiva,
    mensaje,
    formCrear,
    handleChangeCrear,
    handleSubmitCrear,
    modificarRol,
    desactivarUsuario,
    getNombreRol,
  } = useGestionUsuarios();

  return (
    <main className="min-h-screen bg-slate-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-5xl mx-auto">

        {/* ── Encabezado ─────────────────────────────────────────── */}
        <div className="bg-slate-900 rounded-xl px-8 py-6 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-serif font-bold text-amber-500">
              Gestión de Usuarios
            </h1>
            <p className="mt-1 text-slate-300 text-sm">
              Administración de usuarios, roles y privilegios del sistema.
            </p>
          </div>
          <button
            onClick={() => setVistaActiva('crear')}
            className="bg-amber-500 text-slate-900 font-bold px-5 py-2 rounded-lg hover:bg-amber-400 transition text-sm whitespace-nowrap"
          >
            + Nuevo Usuario
          </button>
        </div>

        {/* ── Mensaje de feedback ─────────────────────────────────── */}
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

        {/* ── Pestañas de navegación ──────────────────────────────── */}
        <div className="flex gap-2 mb-6">
          {(['lista', 'crear', 'auditoria'] as const).map(v => {
            const etiquetas = { lista: 'Lista de Usuarios', crear: 'Crear Usuario', auditoria: 'Auditoría' };
            return (
              <button
                key={v}
                onClick={() => setVistaActiva(v)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  vistaActiva === v
                    ? 'bg-slate-900 text-amber-500'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {etiquetas[v]}
              </button>
            );
          })}
        </div>

        {/* ══════════════════════════════════════════════════════════
            VISTA: LISTA DE USUARIOS — UC-02 y UC-03
        ══════════════════════════════════════════════════════════ */}
        {vistaActiva === 'lista' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Usuarios del Sistema</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                {usuarios.filter(u => u.activo).length} activos · {usuarios.filter(u => !u.activo).length} inactivos
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Usuario</th>
                    <th className="px-6 py-3 text-left">Correo</th>
                    <th className="px-6 py-3 text-left">Rol actual</th>
                    <th className="px-6 py-3 text-left">Estado</th>
                    <th className="px-6 py-3 text-left">Cambiar Rol (UC-02)</th>
                    <th className="px-6 py-3 text-left">Acciones (UC-03)</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {usuarios.map(usuario => (
                    <tr key={usuario.id_usuario} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 font-medium text-slate-800">
                        {usuario.nombre_completo}
                      </td>
                      <td className="px-6 py-4 text-slate-600">
                        {usuario.correo_electronico}
                      </td>
                      <td className="px-6 py-4">
                        <span className="bg-slate-100 text-slate-700 px-2 py-1 rounded text-xs font-medium">
                          {getNombreRol(usuario.id_rol)}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            usuario.activo
                              ? 'bg-green-100 text-green-700'
                              : 'bg-red-100 text-red-600'
                          }`}
                        >
                          {usuario.activo ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      {/* UC-02: Cambiar rol */}
                      <td className="px-6 py-4">
                        {usuario.activo ? (
                          <select
                            value={usuario.id_rol}
                            onChange={e => modificarRol(usuario.id_usuario, Number(e.target.value))}
                            className="text-xs border border-slate-300 rounded px-2 py-1 bg-white text-slate-700 focus:ring-amber-500 focus:border-amber-500"
                          >
                            {roles.map(r => (
                              <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>
                            ))}
                          </select>
                        ) : (
                          <span className="text-slate-400 text-xs">—</span>
                        )}
                      </td>

                      {/* UC-03: Desactivar */}
                      <td className="px-6 py-4">
                        {usuario.activo ? (
                          <button
                            onClick={() => desactivarUsuario(usuario.id_usuario)}
                            className="text-xs bg-red-50 text-red-600 border border-red-200 px-3 py-1 rounded hover:bg-red-100 transition font-medium"
                          >
                            Desactivar
                          </button>
                        ) : (
                          <span className="text-slate-400 text-xs">Inactivo</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ══════════════════════════════════════════════════════════
            VISTA: CREAR USUARIO — UC-01
        ══════════════════════════════════════════════════════════ */}
        {vistaActiva === 'crear' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="bg-slate-900 px-8 py-5">
              <h2 className="text-xl font-serif font-bold text-amber-500">Crear Nuevo Usuario</h2>
              <p className="mt-1 text-slate-300 text-xs">
                UC-01 · El usuario recibirá sus credenciales por correo al ser creado.
              </p>
            </div>

            <div className="p-8">
              <form className="space-y-6" onSubmit={handleSubmitCrear}>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                  {/* Nombre completo */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="nombre_completo"
                      value={formCrear.nombre_completo}
                      onChange={handleChangeCrear}
                      placeholder="Ej. Juan Pérez"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  {/* Correo electrónico */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Correo Electrónico <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="correo_electronico"
                      value={formCrear.correo_electronico}
                      onChange={handleChangeCrear}
                      placeholder="usuario@hotel.com"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  {/* Contraseña */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Contraseña Inicial <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="password"
                      name="contrasena_hash"
                      value={formCrear.contrasena_hash}
                      onChange={handleChangeCrear}
                      placeholder="Mínimo 8 caracteres"
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 text-slate-700"
                    />
                  </div>

                  {/* Rol */}
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-1">
                      Rol Asignado <span className="text-red-500">*</span>
                    </label>
                    <select
                      name="id_rol"
                      value={formCrear.id_rol}
                      onChange={handleChangeCrear}
                      required
                      className="w-full px-4 py-2 border border-slate-300 rounded-md focus:ring-amber-500 focus:border-amber-500 bg-white text-slate-700"
                    >
                      <option value="">Seleccione un rol...</option>
                      {roles.map(r => (
                        <option key={r.id_rol} value={r.id_rol}>
                          {r.nombre} — {r.descripcion}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Nota informativa */}
                <div className="bg-amber-50 border-l-4 border-amber-500 p-4">
                  <p className="text-sm text-amber-700">
                    <strong>Nota:</strong> Al crear el usuario se generará automáticamente una notificación
                    con las credenciales de acceso al correo registrado. La acción quedará registrada en
                    la bitácora de auditoría.
                  </p>
                </div>

                {/* Botones */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="submit"
                    className="flex-1 bg-slate-900 text-amber-500 font-bold py-3 px-4 rounded-md hover:bg-slate-800 transition shadow-md"
                  >
                    Crear Usuario
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

        {/* ══════════════════════════════════════════════════════════
            VISTA: AUDITORÍA — RegistroAuditoria
        ══════════════════════════════════════════════════════════ */}
        {vistaActiva === 'auditoria' && (
          <div className="bg-white rounded-xl shadow-lg overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-800">Bitácora de Auditoría</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Registro de todas las acciones realizadas sobre usuarios.
              </p>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 text-slate-600 uppercase text-xs tracking-wider">
                  <tr>
                    <th className="px-6 py-3 text-left">Fecha / Hora</th>
                    <th className="px-6 py-3 text-left">Acción</th>
                    <th className="px-6 py-3 text-left">Descripción</th>
                    <th className="px-6 py-3 text-left">ID Entidad</th>
                    <th className="px-6 py-3 text-left">IP Origen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {auditoria.map(reg => (
                    <tr key={reg.id_registro} className="hover:bg-slate-50 transition">
                      <td className="px-6 py-4 text-slate-600 whitespace-nowrap">{reg.fecha_hora}</td>
                      <td className="px-6 py-4">
                        <span
                          className={`px-2 py-1 rounded text-xs font-semibold ${
                            reg.accion === 'CREAR_USUARIO'
                              ? 'bg-green-100 text-green-700'
                              : reg.accion === 'DESACTIVAR_USUARIO'
                              ? 'bg-red-100 text-red-600'
                              : 'bg-blue-100 text-blue-700'
                          }`}
                        >
                          {reg.accion}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-slate-700">{reg.descripcion}</td>
                      <td className="px-6 py-4 text-slate-500">{reg.id_entidad}</td>
                      <td className="px-6 py-4 text-slate-500 font-mono text-xs">{reg.ip_origen}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

      </div>
    </main>
  );
}