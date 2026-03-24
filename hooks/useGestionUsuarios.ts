import { useState, ChangeEvent, FormEvent } from 'react';

export type TipoNotificacion = 'CORREO' | 'SISTEMA' | 'PUSH';
export type TipoPago = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA';

export interface Rol {
  id_rol: number;
  nombre: string;
  descripcion: string;
}

export interface Permiso {
  id_permiso: number;
  nombre: string;
  recurso: string;
  accion: string;
}

export interface Usuario {
  id_usuario: number;
  nombre_completo: string;
  correo_electronico: string;
  contrasena_hash: string;
  activo: boolean;
  id_rol: number;
}

export interface RegistroAuditoria {
  id_registro: number;
  fecha_hora: string;
  accion: string;
  entidad_afectada: string;
  id_entidad: number;
  descripcion: string;
  ip_origen: string;
}

// ─── Datos semilla ────────────────────────────────────────────────
const rolesIniciales: Rol[] = [
  { id_rol: 1, nombre: 'Administrador',  descripcion: 'Acceso total al sistema' },
  { id_rol: 2, nombre: 'Recepcionista',  descripcion: 'Gestión de reservas y clientes' },
  { id_rol: 3, nombre: 'Limpieza',       descripcion: 'Gestión de habitaciones y áreas' },
  { id_rol: 4, nombre: 'Restaurante',    descripcion: 'Gestión del área de restaurante' },
];

const usuariosIniciales: Usuario[] = [
  { id_usuario: 1, nombre_completo: 'María García',    correo_electronico: 'maria@hotel.com',  contrasena_hash: 'hash1', activo: true,  id_rol: 1 },
  { id_usuario: 2, nombre_completo: 'Carlos López',    correo_electronico: 'carlos@hotel.com', contrasena_hash: 'hash2', activo: true,  id_rol: 2 },
  { id_usuario: 3, nombre_completo: 'Ana Martínez',    correo_electronico: 'ana@hotel.com',    contrasena_hash: 'hash3', activo: true,  id_rol: 3 },
  { id_usuario: 4, nombre_completo: 'Pedro Ramírez',   correo_electronico: 'pedro@hotel.com',  contrasena_hash: 'hash4', activo: false, id_rol: 2 },
];

const auditoriaInicial: RegistroAuditoria[] = [
  { id_registro: 1, fecha_hora: '2025-03-20 10:30', accion: 'CREAR_USUARIO',      entidad_afectada: 'Usuario', id_entidad: 2, descripcion: 'Usuario Carlos López creado', ip_origen: '192.168.1.10' },
  { id_registro: 2, fecha_hora: '2025-03-21 14:15', accion: 'MODIFICAR_ROL',      entidad_afectada: 'Usuario', id_entidad: 3, descripcion: 'Rol cambiado a Limpieza',     ip_origen: '192.168.1.10' },
  { id_registro: 3, fecha_hora: '2025-03-22 09:00', accion: 'DESACTIVAR_USUARIO', entidad_afectada: 'Usuario', id_entidad: 4, descripcion: 'Usuario Pedro desactivado',   ip_origen: '192.168.1.10' },
];

// ─── Formulario crear usuario ─────────────────────────────────────
export interface CrearUsuarioForm {
  nombre_completo: string;
  correo_electronico: string;
  contrasena_hash: string;
  id_rol: number | '';
}

// ─── Hook principal ───────────────────────────────────────────────
export const useGestionUsuarios = () => {
  const [usuarios, setUsuarios]         = useState<Usuario[]>(usuariosIniciales);
  const [roles]                         = useState<Rol[]>(rolesIniciales);
  const [auditoria, setAuditoria]       = useState<RegistroAuditoria[]>(auditoriaInicial);

  const [vistaActiva, setVistaActiva]   = useState<'lista' | 'crear' | 'auditoria'>('lista');
  const [mensaje, setMensaje]           = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // UC-01 — Crear usuario
  const [formCrear, setFormCrear] = useState<CrearUsuarioForm>({
    nombre_completo: '',
    correo_electronico: '',
    contrasena_hash: '',
    id_rol: '',
  });

  const handleChangeCrear = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormCrear(prev => ({
      ...prev,
      [name]: name === 'id_rol' ? (value === '' ? '' : Number(value)) : value,
    }));
  };

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3500);
  };

  const registrarAuditoria = (accion: string, id_entidad: number, descripcion: string) => {
    const nuevo: RegistroAuditoria = {
      id_registro: auditoria.length + 1,
      fecha_hora: new Date().toLocaleString('sv-SE').slice(0, 16),
      accion,
      entidad_afectada: 'Usuario',
      id_entidad,
      descripcion,
      ip_origen: '192.168.1.10',
    };
    setAuditoria(prev => [nuevo, ...prev]);
  };

  const handleSubmitCrear = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar correo único
    if (usuarios.some(u => u.correo_electronico === formCrear.correo_electronico)) {
      mostrarMensaje('error', 'El correo ya está registrado. Use otro correo.');
      return;
    }
    if (!formCrear.nombre_completo || !formCrear.correo_electronico || !formCrear.contrasena_hash || formCrear.id_rol === '') {
      mostrarMensaje('error', 'Complete todos los campos obligatorios.');
      return;
    }

    const nuevoUsuario: Usuario = {
      id_usuario: usuarios.length + 1,
      nombre_completo: formCrear.nombre_completo,
      correo_electronico: formCrear.correo_electronico,
      contrasena_hash: formCrear.contrasena_hash,
      activo: true,
      id_rol: formCrear.id_rol as number,
    };

    setUsuarios(prev => [...prev, nuevoUsuario]);
    registrarAuditoria('CREAR_USUARIO', nuevoUsuario.id_usuario, `Usuario ${nuevoUsuario.nombre_completo} creado`);
    mostrarMensaje('exito', `✓ Usuario "${nuevoUsuario.nombre_completo}" creado exitosamente. Se enviaron las credenciales al correo.`);
    setFormCrear({ nombre_completo: '', correo_electronico: '', contrasena_hash: '', id_rol: '' });
    setVistaActiva('lista');
  };

  // UC-02 — Modificar rol
  const modificarRol = (id_usuario: number, nuevo_id_rol: number) => {
    const usuario = usuarios.find(u => u.id_usuario === id_usuario);
    if (!usuario) return;

    const rolAnterior = roles.find(r => r.id_rol === usuario.id_rol)?.nombre ?? '';
    const rolNuevo    = roles.find(r => r.id_rol === nuevo_id_rol)?.nombre ?? '';

    setUsuarios(prev =>
      prev.map(u => u.id_usuario === id_usuario ? { ...u, id_rol: nuevo_id_rol } : u)
    );
    registrarAuditoria('MODIFICAR_ROL', id_usuario, `Rol cambiado de "${rolAnterior}" a "${rolNuevo}"`);
    mostrarMensaje('exito', `✓ Rol de "${usuario.nombre_completo}" actualizado a "${rolNuevo}".`);
  };

  // UC-03 — Desactivar usuario
  const desactivarUsuario = (id_usuario: number) => {
    const adminsActivos = usuarios.filter(u => u.activo && u.id_rol === 1);
    const usuario = usuarios.find(u => u.id_usuario === id_usuario);
    if (!usuario) return;

    if (!usuario.activo) {
      mostrarMensaje('error', 'El usuario ya está desactivado.');
      return;
    }
    if (usuario.id_rol === 1 && adminsActivos.length <= 1) {
      mostrarMensaje('error', 'No se puede desactivar el último administrador activo.');
      return;
    }

    setUsuarios(prev =>
      prev.map(u => u.id_usuario === id_usuario ? { ...u, activo: false } : u)
    );
    registrarAuditoria('DESACTIVAR_USUARIO', id_usuario, `Usuario ${usuario.nombre_completo} desactivado`);
    mostrarMensaje('exito', `✓ Usuario "${usuario.nombre_completo}" desactivado. El acceso fue bloqueado.`);
  };

  const getNombreRol = (id_rol: number) => roles.find(r => r.id_rol === id_rol)?.nombre ?? '—';

  return {
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
  };
};