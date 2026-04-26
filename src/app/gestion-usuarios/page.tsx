'use client';

import { useGestionUsuarios } from '@/hooks/useGestionUsuarios';
import { Shield, Plus, ClipboardList, Users, ChevronLeft, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function GestionUsuarios() {
  const {
    usuarios, roles, auditoria, vistaActiva, setVistaActiva, mensaje,
    formCrear, handleChangeCrear, handleSubmitCrear, modificarRol, desactivarUsuario, getNombreRol,
  } = useGestionUsuarios();

  const totalActivos = usuarios.filter(u => u.activo).length;
  const totalInactivos = usuarios.filter(u => !u.activo).length;

  return (
    <main className="min-h-screen bg-luxury-ivory px-6 py-10 md:px-10">
      <div className="mx-auto max-w-7xl space-y-8">

        <Link href="/" className="inline-flex items-center gap-2 text-xs uppercase tracking-wider text-luxury-charcoal/50 hover:text-luxury-black transition-colors mb-4">
          <ArrowLeft size={14} /> Volver al inicio
        </Link>

        <header className="rounded-3xl border border-luxury-gold/25 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-luxury-charcoal/60">Administración del sistema</p>
              <h1 className="mt-3 font-serif text-4xl text-luxury-black md:text-5xl">Gestión de Usuarios</h1>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-luxury-charcoal/80 md:text-base">
                Administra los accesos, roles y privilegios del personal del hotel.
              </p>
            </div>
            <button onClick={() => setVistaActiva('crear')}
              className="inline-flex items-center gap-2 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold shadow-sm transition hover:bg-luxury-charcoal">
              <Plus size={16} /> Nuevo Usuario
            </button>
          </div>
          <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              { label: 'Total usuarios', value: usuarios.length, color: 'text-luxury-black' },
              { label: 'Activos', value: totalActivos, color: 'text-green-600' },
              { label: 'Inactivos', value: totalInactivos, color: 'text-red-500' },
              { label: 'Roles', value: roles.length, color: 'text-luxury-gold' },
            ].map(s => (
              <div key={s.label} className="rounded-2xl border border-luxury-gold/15 bg-luxury-champagne/30 px-5 py-4">
                <p className={`font-serif text-3xl font-bold ${s.color}`}>{s.value}</p>
                <p className="mt-1 text-xs uppercase tracking-wider text-luxury-charcoal/60">{s.label}</p>
              </div>
            ))}
          </div>
        </header>

        {mensaje && (
          <div className={`rounded-2xl border px-6 py-4 text-sm font-medium ${mensaje.tipo === 'exito' ? 'border-green-200 bg-green-50 text-green-800' : 'border-red-200 bg-red-50 text-red-800'}`}>{mensaje.texto}</div>
        )}

        <div className="flex gap-2 border-b border-luxury-gold/20 pb-1">
          {([{ key: 'lista', label: 'Lista', icon: Users }, { key: 'crear', label: 'Crear', icon: Plus }, { key: 'auditoria', label: 'Auditoría', icon: ClipboardList }] as const).map(({ key, label, icon: Icon }) => (
            <button key={key} onClick={() => setVistaActiva(key)}
              className={`inline-flex items-center gap-2 rounded-t-xl px-5 py-2.5 text-sm font-medium transition ${vistaActiva === key ? 'bg-luxury-black text-luxury-gold' : 'text-luxury-charcoal/60 hover:bg-luxury-champagne/40'}`}>
              <Icon size={15} /> {label}
            </button>
          ))}
        </div>

        {vistaActiva === 'lista' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-luxury-champagne/30 text-xs uppercase tracking-wider text-luxury-charcoal/60">
                  <tr>
                    <th className="px-8 py-4 text-left">Usuario</th><th className="px-8 py-4 text-left">Correo</th>
                    <th className="px-8 py-4 text-left">Rol</th><th className="px-8 py-4 text-left">Estado</th>
                    <th className="px-8 py-4 text-left">Cambiar Rol</th><th className="px-8 py-4 text-left">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-luxury-gold/10">
                  {usuarios.map(u => (
                    <tr key={u.id_usuario} className="hover:bg-luxury-champagne/20 transition">
                      <td className="px-8 py-4 font-medium text-luxury-black">{u.nombre_completo}</td>
                      <td className="px-8 py-4 text-luxury-charcoal/70">{u.correo_electronico}</td>
                      <td className="px-8 py-4"><span className="rounded-full border border-luxury-gold/30 bg-luxury-champagne/50 px-3 py-1 text-xs font-medium">{getNombreRol(u.id_rol)}</span></td>
                      <td className="px-8 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${u.activo ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{u.activo ? 'Activo' : 'Inactivo'}</span></td>
                      <td className="px-8 py-4">{u.activo ? (
                        <select value={u.id_rol} onChange={e => modificarRol(u.id_usuario, Number(e.target.value))}
                          className="rounded-xl border border-luxury-gold/30 bg-white px-3 py-1.5 text-xs focus:border-luxury-gold focus:outline-none">
                          {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre}</option>)}
                        </select>) : <span className="text-luxury-charcoal/30 text-xs">—</span>}</td>
                      <td className="px-8 py-4">{u.activo ? (
                        <button onClick={() => desactivarUsuario(u.id_usuario)}
                          className="rounded-xl border border-red-200 bg-red-50 px-4 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100">Desactivar</button>
                      ) : <span className="text-luxury-charcoal/30 text-xs">Inactivo</span>}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {vistaActiva === 'crear' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <button onClick={() => setVistaActiva('lista')} className="flex h-9 w-9 items-center justify-center rounded-xl border border-luxury-gold/20 text-luxury-charcoal/60 hover:bg-luxury-champagne"><ChevronLeft size={16} /></button>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-black"><Shield size={18} className="text-luxury-gold" /></div>
              <div><h2 className="font-serif text-xl text-luxury-black">Crear Nuevo Usuario</h2><p className="text-xs text-luxury-charcoal/50">UC-01</p></div>
            </div>
            <div className="p-8">
              <form onSubmit={handleSubmitCrear} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                  {[{ label: 'Nombre Completo', name: 'nombre_completo', type: 'text', ph: 'Ej. Juan Pérez' },
                    { label: 'Correo Electrónico', name: 'correo_electronico', type: 'email', ph: 'usuario@hotel.com' },
                    { label: 'Contraseña', name: 'contrasena_hash', type: 'password', ph: 'Mínimo 8 caracteres' }].map(f => (
                    <div key={f.name}>
                      <label className="mb-2 block text-sm font-medium text-luxury-black">{f.label} <span className="text-red-400">*</span></label>
                      <input type={f.type} name={f.name} value={formCrear[f.name as keyof typeof formCrear] as string} onChange={handleChangeCrear} placeholder={f.ph} required
                        className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm text-luxury-black placeholder-luxury-charcoal/40 focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold" />
                    </div>
                  ))}
                  <div>
                    <label className="mb-2 block text-sm font-medium text-luxury-black">Rol <span className="text-red-400">*</span></label>
                    <select name="id_rol" value={formCrear.id_rol} onChange={handleChangeCrear} required
                      className="w-full rounded-2xl border border-luxury-gold/30 bg-luxury-ivory px-4 py-3 text-sm focus:border-luxury-gold focus:outline-none focus:ring-1 focus:ring-luxury-gold">
                      <option value="">Seleccione...</option>
                      {roles.map(r => <option key={r.id_rol} value={r.id_rol}>{r.nombre} — {r.descripcion}</option>)}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit" className="flex-1 rounded-2xl bg-luxury-black px-6 py-3 text-sm font-semibold text-luxury-gold hover:bg-luxury-charcoal transition">Crear Usuario</button>
                  <button type="button" onClick={() => setVistaActiva('lista')} className="rounded-2xl border border-luxury-gold/30 px-6 py-3 text-sm font-medium text-luxury-charcoal hover:bg-luxury-champagne/40">Cancelar</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {vistaActiva === 'auditoria' && (
          <div className="rounded-3xl border border-luxury-gold/20 bg-white shadow-sm overflow-hidden">
            <div className="flex items-center gap-3 border-b border-luxury-gold/15 px-8 py-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-luxury-champagne"><ClipboardList size={18} /></div>
              <div><h2 className="font-serif text-xl text-luxury-black">Bitácora de Auditoría</h2></div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-luxury-champagne/30 text-xs uppercase tracking-wider text-luxury-charcoal/60">
                  <tr><th className="px-8 py-4 text-left">Fecha</th><th className="px-8 py-4 text-left">Acción</th><th className="px-8 py-4 text-left">Descripción</th><th className="px-8 py-4 text-left">ID</th><th className="px-8 py-4 text-left">IP</th></tr>
                </thead>
                <tbody className="divide-y divide-luxury-gold/10">
                  {auditoria.map(r => (
                    <tr key={r.id_registro} className="hover:bg-luxury-champagne/20">
                      <td className="px-8 py-4 text-luxury-charcoal/70 whitespace-nowrap">{r.fecha_hora}</td>
                      <td className="px-8 py-4"><span className={`rounded-full px-3 py-1 text-xs font-semibold ${r.accion === 'CREAR_USUARIO' ? 'bg-green-100 text-green-700' : r.accion === 'DESACTIVAR_USUARIO' ? 'bg-red-100 text-red-600' : 'bg-blue-100 text-blue-700'}`}>{r.accion}</span></td>
                      <td className="px-8 py-4 text-luxury-charcoal/80">{r.descripcion}</td>
                      <td className="px-8 py-4 text-luxury-charcoal/50">{r.id_entidad}</td>
                      <td className="px-8 py-4 font-mono text-xs text-luxury-charcoal/50">{r.ip_origen}</td>
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
