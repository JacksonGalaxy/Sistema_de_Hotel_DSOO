import { useState, ChangeEvent, FormEvent } from 'react';

// ─── Enums ────────────────────────────────────────────────────────
export type TipoCliente    = 'ESTANDAR' | 'PREMIUM' | 'VIP';
export type EstadoMembresia = 'ACTIVA' | 'VENCIDA' | 'CANCELADA';
export type TipoPago       = 'EFECTIVO' | 'TARJETA_CREDITO' | 'TARJETA_DEBITO' | 'TRANSFERENCIA';
export type EstadoPago     = 'PENDIENTE' | 'APROBADO' | 'RECHAZADO' | 'REEMBOLSADO';

// ─── Interfaces del diagrama de clases ────────────────────────────
export interface Beneficio {
  id_beneficio: number;
  nombre: string;
  descripcion: string;
  tipo_cliente: TipoCliente;
  acceso_villas: boolean;
  tipo_amenidades: string;
  prioridad_reserva: string;
  politica_cancelacion: string;
}

export interface Pago {
  id_pago: number;
  monto: number;
  tipo_pago: TipoPago;
  estado: EstadoPago;
  referencia: string;
  fecha_hora: string;
  descripcion: string;
}

export interface Membresia {
  id_membresia: number;
  plan_meses: number;
  fecha_inicio: string;
  fecha_fin: string;
  estado: EstadoMembresia;
  costo_total: number;
  pago: Pago | null;
}

export interface Cliente {
  id_cliente: number;
  numero_cliente: string;
  nombre_completo: string;
  correo_electronico: string;
  telefono: string;
  documento_identificacion: string;
  direccion: string;
  tipo_cliente: TipoCliente;
  fecha_registro: string;
  membresia: Membresia | null;
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

// ─── Datos semilla ─────────────────────────────────────────────────
const beneficiosIniciales: Beneficio[] = [
  {
    id_beneficio: 1,
    nombre: 'Acceso Estándar',
    descripcion: 'Acceso a habitaciones estándar y deluxe con amenidades básicas.',
    tipo_cliente: 'ESTANDAR',
    acceso_villas: false,
    tipo_amenidades: 'Básicas (WiFi, TV, Piscina común)',
    prioridad_reserva: 'Normal',
    politica_cancelacion: 'Cancelación gratuita hasta 48 horas antes del check-in. Penalización del 50% si cancela con menos de 48 horas.',
  },
  {
    id_beneficio: 2,
    nombre: 'Acceso Premium',
    descripcion: 'Acceso a habitaciones, suites y villas con amenidades extendidas.',
    tipo_cliente: 'PREMIUM',
    acceso_villas: true,
    tipo_amenidades: 'Extendidas (WiFi, TV, Spa, Gimnasio, Piscina privada)',
    prioridad_reserva: 'Media — acceso preferencial a disponibilidad',
    politica_cancelacion: 'Cancelación gratuita hasta 24 horas antes del check-in. Penalización del 30% si cancela con menos de 24 horas.',
  },
  {
    id_beneficio: 3,
    nombre: 'Acceso VIP',
    descripcion: 'Acceso total sin restricciones con todas las amenidades disponibles.',
    tipo_cliente: 'VIP',
    acceso_villas: true,
    tipo_amenidades: 'Sin límite (todas las amenidades + servicio personalizado)',
    prioridad_reserva: 'Alta — acceso prioritario y reserva garantizada',
    politica_cancelacion: 'Cancelación gratuita hasta el momento del check-in, sin penalización.',
  },
];

const clientesIniciales: Cliente[] = [
  {
    id_cliente: 1,
    numero_cliente: 'CLI-001',
    nombre_completo: 'Laura Sánchez',
    correo_electronico: 'laura@email.com',
    telefono: '555-1001',
    documento_identificacion: 'DOC-001',
    direccion: 'Calle Principal 1, Oaxaca',
    tipo_cliente: 'ESTANDAR',
    fecha_registro: '2025-01-10',
    membresia: null,
  },
  {
    id_cliente: 2,
    numero_cliente: 'CLI-002',
    nombre_completo: 'Miguel Torres',
    correo_electronico: 'miguel@email.com',
    telefono: '555-1002',
    documento_identificacion: 'DOC-002',
    direccion: 'Av. Reforma 45, Oaxaca',
    tipo_cliente: 'PREMIUM',
    fecha_registro: '2025-01-15',
    membresia: {
      id_membresia: 1,
      plan_meses: 6,
      fecha_inicio: '2025-01-15',
      fecha_fin: '2025-07-15',
      estado: 'ACTIVA',
      costo_total: 3600,
      pago: { id_pago: 1, monto: 3600, tipo_pago: 'TARJETA_CREDITO', estado: 'APROBADO', referencia: 'PAY-MEM-001', fecha_hora: '2025-01-15 10:00', descripcion: 'Membresía Premium 6 meses' },
    },
  },
  {
    id_cliente: 3,
    numero_cliente: 'CLI-003',
    nombre_completo: 'Sofía Herrera',
    correo_electronico: 'sofia@email.com',
    telefono: '555-1003',
    documento_identificacion: 'DOC-003',
    direccion: 'Blvd. Independencia 90, Oaxaca',
    tipo_cliente: 'VIP',
    fecha_registro: '2025-02-01',
    membresia: {
      id_membresia: 2,
      plan_meses: 12,
      fecha_inicio: '2025-02-01',
      fecha_fin: '2026-02-01',
      estado: 'ACTIVA',
      costo_total: 9600,
      pago: { id_pago: 2, monto: 9600, tipo_pago: 'TRANSFERENCIA', estado: 'APROBADO', referencia: 'PAY-MEM-002', fecha_hora: '2025-02-01 09:00', descripcion: 'Membresía VIP 12 meses' },
    },
  },
  {
    id_cliente: 4,
    numero_cliente: 'CLI-004',
    nombre_completo: 'Carlos Ruiz',
    correo_electronico: 'carlos@email.com',
    telefono: '555-1004',
    documento_identificacion: 'DOC-004',
    direccion: 'Col. Centro 22, Oaxaca',
    tipo_cliente: 'ESTANDAR',
    fecha_registro: '2025-03-05',
    membresia: {
      id_membresia: 3,
      plan_meses: 3,
      fecha_inicio: '2025-01-01',
      fecha_fin: '2025-01-31',
      estado: 'VENCIDA',
      costo_total: 1500,
      pago: { id_pago: 3, monto: 1500, tipo_pago: 'EFECTIVO', estado: 'APROBADO', referencia: 'PAY-MEM-003', fecha_hora: '2025-01-01 11:00', descripcion: 'Membresía Premium 3 meses' },
    },
  },
];

const auditoriaInicial: RegistroAuditoria[] = [
  { id_registro: 1, fecha_hora: '2025-01-15 10:05', accion: 'REGISTRAR_CLIENTE',  entidad_afectada: 'Cliente', id_entidad: 2, descripcion: 'Cliente Miguel Torres registrado',         ip_origen: '192.168.1.10' },
  { id_registro: 2, fecha_hora: '2025-01-15 10:10', accion: 'ACTIVAR_MEMBRESIA',  entidad_afectada: 'Cliente', id_entidad: 2, descripcion: 'Membresía Premium 6 meses activada',      ip_origen: '192.168.1.10' },
  { id_registro: 3, fecha_hora: '2025-02-01 09:05', accion: 'ACTIVAR_MEMBRESIA',  entidad_afectada: 'Cliente', id_entidad: 3, descripcion: 'Membresía VIP 12 meses activada',         ip_origen: '192.168.1.10' },
  { id_registro: 4, fecha_hora: '2025-02-01 00:01', accion: 'EXPIRACION_MEMBRESIA', entidad_afectada: 'Cliente', id_entidad: 4, descripcion: 'Membresía vencida — regresa a Estándar', ip_origen: 'SISTEMA' },
];

// ─── Tarifas de membresía ─────────────────────────────────────────
const tarifas: Record<TipoCliente, Record<number, number>> = {
  ESTANDAR: { 3: 0,    6: 0,    12: 0    },
  PREMIUM:  { 3: 1500, 6: 2700, 12: 4800 },
  VIP:      { 3: 3000, 6: 5400, 12: 9600 },
};

// ─── Formularios ──────────────────────────────────────────────────
export interface RegistrarClienteForm {
  nombre_completo: string;
  correo_electronico: string;
  telefono: string;
  documento_identificacion: string;
  direccion: string;
}

export interface ActivarMembresiaForm {
  id_cliente: number | '';
  tipo_membresia: TipoCliente | '';
  plan_meses: 3 | 6 | 12 | '';
  tipo_pago: TipoPago | '';
}

// ─── Helpers ──────────────────────────────────────────────────────
const generarNumeroCliente = (id: number) =>
  `CLI-${String(id).padStart(3, '0')}`;

const calcularFechaFin = (meses: number): string => {
  const d = new Date();
  d.setMonth(d.getMonth() + meses);
  return d.toISOString().slice(0, 10);
};

const hoy = () => new Date().toISOString().slice(0, 10);
const ahora = () => new Date().toLocaleString('sv-SE').slice(0, 16);

// ─── Hook principal ───────────────────────────────────────────────
export const useTiposClientes = () => {
  const [clientes,   setClientes]   = useState<Cliente[]>(clientesIniciales);
  const [beneficios]                = useState<Beneficio[]>(beneficiosIniciales);
  const [auditoria,  setAuditoria]  = useState<RegistroAuditoria[]>(auditoriaInicial);

  const [vistaActiva, setVistaActiva] = useState<'lista' | 'registrar' | 'membresia' | 'beneficios' | 'auditoria'>('lista');
  const [mensaje, setMensaje]         = useState<{ tipo: 'exito' | 'error'; texto: string } | null>(null);

  // ── Formulario UC-09 ─────────────────────────────────────────────
  const [formRegistrar, setFormRegistrar] = useState<RegistrarClienteForm>({
    nombre_completo: '',
    correo_electronico: '',
    telefono: '',
    documento_identificacion: '',
    direccion: '',
  });

  // ── Formulario UC-10 ─────────────────────────────────────────────
  const [formMembresia, setFormMembresia] = useState<ActivarMembresiaForm>({
    id_cliente: '',
    tipo_membresia: '',
    plan_meses: '',
    tipo_pago: '',
  });

  // ── Costo preview para UC-10 ──────────────────────────────────────
  const costoPreview = (() => {
    if (!formMembresia.tipo_membresia || !formMembresia.plan_meses) return null;
    return tarifas[formMembresia.tipo_membresia as TipoCliente]?.[formMembresia.plan_meses as number] ?? null;
  })();

  const mostrarMensaje = (tipo: 'exito' | 'error', texto: string) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 4000);
  };

  const registrarAuditoria = (accion: string, id_entidad: number, descripcion: string, ip = '192.168.1.10') => {
    setAuditoria(prev => [{
      id_registro: prev.length + 1,
      fecha_hora: ahora(),
      accion,
      entidad_afectada: 'Cliente',
      id_entidad,
      descripcion,
      ip_origen: ip,
    }, ...prev]);
  };

  // ── UC-09: Registrar cliente ──────────────────────────────────────
  const handleChangeRegistrar = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormRegistrar(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmitRegistrar = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validar correo único
    if (clientes.some(c => c.correo_electronico === formRegistrar.correo_electronico)) {
      mostrarMensaje('error', 'El correo ya está registrado. Busque al cliente existente.');
      return;
    }
    // Validar documento único
    if (clientes.some(c => c.documento_identificacion === formRegistrar.documento_identificacion)) {
      mostrarMensaje('error', 'El documento de identificación ya está registrado.');
      return;
    }

    const nuevoId = clientes.length + 1;
    const nuevo: Cliente = {
      id_cliente: nuevoId,
      numero_cliente: generarNumeroCliente(nuevoId),
      nombre_completo: formRegistrar.nombre_completo,
      correo_electronico: formRegistrar.correo_electronico,
      telefono: formRegistrar.telefono,
      documento_identificacion: formRegistrar.documento_identificacion,
      direccion: formRegistrar.direccion,
      tipo_cliente: 'ESTANDAR',       // UC-09: siempre inicia como ESTANDAR
      fecha_registro: hoy(),
      membresia: null,
    };

    setClientes(prev => [...prev, nuevo]);
    registrarAuditoria('REGISTRAR_CLIENTE', nuevoId, `Cliente ${nuevo.nombre_completo} registrado`);
    mostrarMensaje('exito', `✓ Cliente "${nuevo.nombre_completo}" registrado con número ${nuevo.numero_cliente}. Tipo: ESTÁNDAR.`);
    setFormRegistrar({ nombre_completo: '', correo_electronico: '', telefono: '', documento_identificacion: '', direccion: '' });
    setVistaActiva('lista');
  };

  // ── UC-10: Activar membresía ──────────────────────────────────────
  const handleChangeMembresia = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormMembresia(prev => ({
      ...prev,
      [name]: name === 'id_cliente' || name === 'plan_meses'
        ? (value === '' ? '' : Number(value))
        : value,
    }) as ActivarMembresiaForm);
  };

  const handleSubmitMembresia = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const cliente = clientes.find(c => c.id_cliente === Number(formMembresia.id_cliente));
    if (!cliente) { mostrarMensaje('error', 'Seleccione un cliente válido.'); return; }
    if (!formMembresia.tipo_membresia || !formMembresia.plan_meses || !formMembresia.tipo_pago) {
      mostrarMensaje('error', 'Complete todos los campos.'); return;
    }

    const tipo      = formMembresia.tipo_membresia as TipoCliente;
    const meses     = formMembresia.plan_meses as number;
    const costo     = tarifas[tipo][meses];
    const fechaFin  = calcularFechaFin(meses);

    // UC-10: Si ya tiene membresía activa → extender
    const esExtension = cliente.membresia?.estado === 'ACTIVA';
    const nuevoIdMem  = auditoria.length + 10;

    const nuevaMembresia: Membresia = {
      id_membresia: nuevoIdMem,
      plan_meses: meses,
      fecha_inicio: hoy(),
      fecha_fin: fechaFin,
      estado: 'ACTIVA',
      costo_total: costo,
      pago: {
        id_pago: nuevoIdMem,
        monto: costo,
        tipo_pago: formMembresia.tipo_pago as TipoPago,
        estado: 'APROBADO',
        referencia: `PAY-MEM-${String(nuevoIdMem).padStart(3, '0')}`,
        fecha_hora: ahora(),
        descripcion: `Membresía ${tipo} ${meses} meses`,
      },
    };

    setClientes(prev =>
      prev.map(c =>
        c.id_cliente === cliente.id_cliente
          ? { ...c, tipo_cliente: tipo, membresia: nuevaMembresia }
          : c
      )
    );

    const accion = esExtension ? 'EXTENDER_MEMBRESIA' : 'ACTIVAR_MEMBRESIA';
    const desc   = `${esExtension ? 'Membresía extendida' : 'Membresía activada'}: ${tipo} ${meses} meses — vence ${fechaFin}`;
    registrarAuditoria(accion, cliente.id_cliente, desc);

    mostrarMensaje('exito', `✓ Membresía ${tipo} ${meses} meses ${esExtension ? 'extendida' : 'activada'} para "${cliente.nombre_completo}". Vence: ${fechaFin}.`);
    setFormMembresia({ id_cliente: '', tipo_membresia: '', plan_meses: '', tipo_pago: '' });
    setVistaActiva('lista');
  };

  // ── UC-11: Expiración automática (simulada) ───────────────────────
  const verificarExpiraciones = () => {
    const fechaHoy = hoy();
    let expirados = 0;

    setClientes(prev =>
      prev.map(c => {
        if (c.membresia?.estado === 'ACTIVA' && c.membresia.fecha_fin < fechaHoy) {
          expirados++;
          registrarAuditoria('EXPIRACION_MEMBRESIA', c.id_cliente, `Membresía vencida — ${c.nombre_completo} regresa a Estándar`, 'SISTEMA');
          return {
            ...c,
            tipo_cliente: 'ESTANDAR' as TipoCliente,
            membresia: { ...c.membresia, estado: 'VENCIDA' as EstadoMembresia },
          };
        }
        return c;
      })
    );

    if (expirados > 0) {
      mostrarMensaje('exito', `✓ Verificación completada. ${expirados} membresía(s) vencida(s) procesada(s).`);
    } else {
      mostrarMensaje('exito', '✓ Verificación completada. No hay membresías vencidas.');
    }
  };

  // ── UC-12: Consultar beneficios ───────────────────────────────────
  const getBeneficiosPorTipo = (tipo: TipoCliente) =>
    beneficios.find(b => b.tipo_cliente === tipo) ?? null;

  // ── Helpers UI ────────────────────────────────────────────────────
  const clienteMembresia = formMembresia.id_cliente
    ? clientes.find(c => c.id_cliente === Number(formMembresia.id_cliente)) ?? null
    : null;

  return {
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
  };
};